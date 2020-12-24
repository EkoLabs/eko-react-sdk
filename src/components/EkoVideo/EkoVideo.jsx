import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import EkoPlayer from 'eko-js-sdk';
import DefaultUnsupportedMessage from "../DefaultUnsupportedMessage/DefaultUnsupportedMessage";
import "./EkoVideo.scss";
import {useCovers} from "./useCovers";
import {getRenderable} from "./utils";

// TODO
// ====
//
// - Fix react-hooks/exhaustive-deps warning

/**
 * The EkoVideo React component embeds an eko video iframe using [eko-js-sdk](https://github.com/EkoLabs/eko-js-sdk).
 *
 * @export
 * @member module:components#EkoVideo
 * @type {React.Component}
 * @param {object} props
 * @param {string} props.projectId - The eko project ID to load. Changing this prop will cause a reload.
 * @param {embedAPI} props.embedAPI - eko embed api version to be used internally. Valid values include "1.0", "2.0". If no value given, default value "1.0" will be used.
 * @param {string} props.env - The eko env
 * @param {object} props.params - A dictionary of embed params that will affect the delivery. Default includes `{autoplay: true}`
 * @param {string[]} props.pageParams - Any query params from the page url that should be forwarded to the iframe. Can supply regex and strings. By default, the following query params will automatically be forwarded: `autoplay, debug, utm_*, headnodeid`.
 * @param {object} props.events - Map of eko player events to listeners.
 * @param {ReactElement| ElementType} props.loadingCover - A React element that will be displayed while video is loading.
 * If not given, will show eko's default loading animation.
 * @param {ReactElement | ElementType } props.playCover - A React element that will be displayed when a custom loading cover (i.e. props.loadingCover) is given, and player does not autoplay.
 * Clicks must pass through this element (i.e. using `pointer-events: none`) so they are triggered on the iframe behind this element and playback can begin.
 * If not given, will display a default play cover.
 * @param {ReactElement | elementType} props.unsupportedCover - A React element that will be displayed in case eko videos are not supported on current environment/browser.
 * If not given, will display a default unsupportedCover message.
 * @param {number} props.waitForAutoplayTimeout - Timeout in seconds to wait for autoplay after video has loaded, but before it has started playback.
 * This is relevant for when a `loadingCover` is passed and video is expected to autoplay.
 * Will hold off on hiding the `loadingCover` until timeout expires, at which point, if video has not started playing, the `playCover` will be displayed instead of `loadingCover`.
 * Default value is 1.5 seconds.
 * @param {function} props.onPlayerInit - A callback function that will be called with an {@link https://github.com/EkoLabs/eko-js-sdk#ekoplayer|EkoPlayer} instance once available
 * Useful for when you want to be able to use the underlying functionality exposed by {@link https://github.com/EkoLabs/eko-js-sdk#ekoplayer|EkoPlayer}, for example calling `ekoPlayer.invoke('muted', true)`.
 *
 */
export function EkoVideo({
                      projectId,
                      embedAPI = "1.0",
                      env,
                      params = {},
                      pageParams,
                      events,
                      loadingCover,
                      playCover,
                      unsupportedCover = DefaultUnsupportedMessage,
                      waitForAutoplayTimeout,
                      onPlayerInit,
                  }) {
    let playerRef = useRef();
    const [isSupported, setIsSupported] = useState(true); // we optimistically assume the player is supported
    const [playerLoadingState, setPlayerLoadingState] = useState({state: null, params: {}});
    let covers = useCovers({
                            loadingCover,
                            playCover,
                            playerLoadingState,
                            waitForAutoplayTimeout
    });

    const ekoProjectContainer = useRef(null);
    const onCoverStateChanged = (state, params) => {
        // console.log(state, params);
        setPlayerLoadingState({state, params});
    }

    // We do this since EkoPlayer.isSupported() accesses the window object, and that breaks SSR compatiblity
    // in the future when the player EkoPlayer.isSupported() adds window safety, we can remove this and use it statically
    useEffect(() => {
        if (EkoPlayer.isSupported()) {
            setIsSupported(true);
            playerRef.current = new EkoPlayer(ekoProjectContainer.current, embedAPI);
            if (onPlayerInit){
                onPlayerInit(playerRef.current);
            }
        } else {
            setIsSupported(false);
        }
    }, []);

    // actual loading logic
    useEffect(() => {
        if (!playerRef.current) {
            return;
        }

        // Assign event listeners according to the events map.
        addEventListeners(playerRef.current, events);

        setPlayerLoadingState({state: 'loading'});

        // Build loading options and load required project.
        playerRef.current.load(projectId, {
            cover: loadingCover ? onCoverStateChanged : undefined,
            env,
            params,
            events: (events && Object.keys(events)) || [],
            pageParams: pageParams || [],
        });

        // We return the removeEventListeners from the useEffect function so it'll be called when the component unmounts, or when deps change.
        return () => removeEventListeners(playerRef.current, events);

    }, [playerRef.current, projectId]);


    // Render unsupportedCover if browser does not support eko videos
    if (isSupported === false) {
        return getRenderable(unsupportedCover);
    }

    // Render eko video
    return (
        <>
            {/* Render div that will contain the eko video iframe */}
            <div className="eko_component_container" ref={ekoProjectContainer} />
            {covers}
        </>
    );
}

const addEventListeners = (player, events) => {
    if (events) {
        Object.keys(events).forEach((event) => {
            player.on(event, events[event]);
        })
    }
};

const removeEventListeners = (player, events) => {
    if (events) {
        Object.keys(events).forEach((event) => {
            player.off(event, events[event]);
        })
    }
};

EkoVideo.propTypes = {
    projectId: PropTypes.string.isRequired,
    embedAPI: PropTypes.string,
    env: PropTypes.string,
    params: PropTypes.objectOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.number
        ])
    ),
    pageParams: PropTypes.arrayOf(PropTypes.string),
    events: PropTypes.objectOf(PropTypes.func),
    loadingCover: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
    playCover: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
    unsupportedCover:  PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
    waitForAutoplayTimeout: PropTypes.number,
    onPlayerInit: PropTypes.func,
};

