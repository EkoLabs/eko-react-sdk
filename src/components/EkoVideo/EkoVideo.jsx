import React, {useEffect, useRef, useState, useContext} from 'react';
import PropTypes from 'prop-types';
import EkoPlayer from '@ekolabs/eko-js-sdk';
import DefaultUnsupportedMessage from "../DefaultUnsupportedMessage/DefaultUnsupportedMessage";
import "./EkoVideo.scss";
import {useCovers} from "./useCovers";
import {getRenderable} from "./utils";
import {EkoPlayerContext} from "../EkoPlayerContext/EkoPlayerContext";

const DEFAULT_EVENTS = ['subtitles.visibilitychange', 'subtitles.substart', 'subtitles.subend', 'subtitles.effectivelanguagechange', 'plugininitsubtitles'];

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
 * @param {string} props.id - The eko project ID to load. Changing this prop will cause a reload.
 * @param {embedAPI} props.embedAPI - eko embed api version to be used internally. Valid values include "1.0", "2.0". If no value given, default value "1.0" will be used.
 * @param {string} props.env - The eko env
 * @param {object} props.params - A dictionary of embed params that will affect the delivery. Default includes `{autoplay: true}`
 * @param {string[]} props.excludePropagatedParams - By default, all query string params present on the page will be forwarded onto the video iframe. In order to exclude params from being forwarded, you can supply an array of query param keys (strings or regexes) to list the params that should not be propagated.
 * @param {object | string[]} props.events - A list of events that should be forwarded to the frame from the player OR a map of eko player events to listeners.
 * @param {boolean} [props.expandToFillContainer=false] - if true, the eko component styling will be set to fill its container. Otherwise the intrinsic size will be 100% width with a height ratio of 16:9.
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
                      id,
                      embedAPI = "1.0",
                      env,
                      clientSideParams,
                      params = {},
                      excludePropagatedParams,
                      events,
                      expandToFillContainer,
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

    let context = useContext(EkoPlayerContext);
    
    const ekoProjectContainer = useRef(null);
    const onCoverStateChanged = (state, params) => {
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
            if (context && context.setPlayerState) {
                context.setPlayerState({player: playerRef.current});
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

        let eventList = events || [];
        let boundHandlers = {};

        // events can be either an array of event names an on object of handlers.
        // In the latter case, assign event listeners according to the events map.
        if (typeof events === "object" && !Array.isArray(events)) {
            Object.keys(events).forEach(eventName => {
                let boundHandler = events[eventName].bind(playerRef.current);
                boundHandlers[eventName] = boundHandlers[eventName] || [];
                boundHandlers[eventName].push(boundHandler)
                playerRef.current.on(eventName, boundHandler);
            })
            eventList = Object.keys(events);
        }

        setPlayerLoadingState({state: 'loading'});

        // Build loading options and load required project.
        playerRef.current.load(id, {
            cover: loadingCover ? onCoverStateChanged : undefined,
            clientSideParams,
            env,
            params,
            events: [...eventList, ...DEFAULT_EVENTS],
            excludePropagatedParams: excludePropagatedParams || [],
        });

        // We return the removeEventListeners from the useEffect function so it'll be called when the component unmounts, or when deps change.
        return () => {
            if (typeof events === "object" && !Array.isArray(events)) {
                Object.keys(boundHandlers).forEach( eventName => {
                    boundHandlers[eventName].forEach( handler => playerRef.current.off(eventName, handler));
                })
            }
        };

    }, [playerRef.current, id]);


    // Render unsupportedCover if browser does not support eko videos
    if (isSupported === false) {
        return getRenderable(unsupportedCover);
    }

    let containerClassNames = ["eko_component_container"];
    containerClassNames.push(expandToFillContainer?"expand":"intrinsicSize")


    // Render eko video
    return (
        <div className={containerClassNames.join(" ")}>
            {/* Render div that will contain the eko video iframe */}
            <div className="eko_video_container" ref={ekoProjectContainer} />
            {covers}
        </div>
    );
}

EkoVideo.propTypes = {
    id: PropTypes.string.isRequired,
    embedAPI: PropTypes.string,
    env: PropTypes.string,
    clientSideParams: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    params: PropTypes.objectOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.number
        ])
    ),
    excludePropagatedParams: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)])),
    events: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.object]),
    expandToFillContainer: PropTypes.bool,
    loadingCover: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
    playCover: PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
    unsupportedCover:  PropTypes.oneOfType([PropTypes.elementType, PropTypes.element]),
    waitForAutoplayTimeout: PropTypes.number,
    onPlayerInit: PropTypes.func,
};
