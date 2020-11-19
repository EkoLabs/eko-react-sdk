import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import EkoPlayer from 'eko-js-sdk';
import DefaultPlayCover from "../DefaultPlayCover/DefaultPlayCover";
import DefaultUnsupportedMessage from "../DefaultUnsupportedMessage/DefaultUnsupportedMessage";
import "./EkoVideo.scss";

// TODO
// ====
//
// - Fix react-hooks/exhaustive-deps warning
// - Support loading cover / play cover transitions
// - This implementation requires eko-js-sdk branch "complex-cover" (not yet merged to master)

/**
 * The EkoVideo React component embeds an eko video iframe using [eko-js-sdk](https://github.com/EkoLabs/eko-js-sdk).
 * @export
 * @member module:components#EkoVideo
 * @type {React.Component}
 * @param {object} props
 * @param {string} props.projectId - The eko project ID to load. Changing this prop will cause a reload.
 * @param {string} props.env - The eko env.
 * @param {object} props.params - Map of eko embed params.
 * @param {string[]} props.forwardParams - Array of params to forward from parent frame into eko embed.
 * @param {object} props.events - Map of eko player events to listeners.
 * @param {boolean} props.togglePlayback - Set to true to play the video and false to pause it.
 * @param {ReactElement} props.unsupported - A React element that will be displayed in case eko videos are not supported on current environment/browser.
 * If not given, will display a default unsupported message.
 * @param {ReactElement} props.loadingCover - A React element that will be displayed while video is loading.
 * If not given, will show eko's default loading animation.
 * @param {ReactElement} props.playCover - A React element that will be displayed when a custom loading cover (i.e. props.loadingCover) is given, and player does not autoplay.
 * Clicks must pass through this element (i.e. using `pointer-events: none`) so they are triggered on the iframe behind this element and playback can begin.
 * If not given, will display a default play cover.
 * @param {number} props.waitForAutoplayTimeout - Timeout in seconds to wait for autoplay after video has loaded, but before it has started playback.
 * This is relevant for when a `loadingCover` is passed and video is expected to autoplay.
 * Will hold off on hiding the `loadingCover` until timeout expires, at which point, if video has not started playing, the `playCover` will be displayed instead of `loadingCover`.
 * Default value is 1.5 seconds.
 * @param {function} props.getEkoPlayerRef - A callback function that will be called with an {@link https://github.com/EkoLabs/eko-js-sdk#ekoplayer|EkoPlayer} instance.
 * Useful for when you want to be able to use the underlying functionality exposed by {@link https://github.com/EkoLabs/eko-js-sdk#ekoplayer|EkoPlayer}, for example calling `ekoPlayer.invoke('muted', true)`.
 */
export function EkoVideo({
                      projectId,
                      env,
                      params,
                      forwardParams,
                      events,
                      togglePlayback,
                      getEkoPlayerRef,
                      loadingCover,
                      waitForAutoplayTimeout = 1.5,
                      children,
                      playCover = DefaultPlayCover,
                      unsupported = DefaultUnsupportedMessage,
                  }) {
    const [player, setPlayer] = useState(null);
    const [isSupported, setIsSupported] = useState(null);
    const [shouldShowLoadingCover, setShouldShowLoadingCover] = useState(true);
    const [shouldShowPlayCover, setShouldShowPlayCover] = useState(false);
    const [autoplayTimedOut, setAutoplayTimedOut] = useState(false);
    const ekoProjectContainer = useRef(null);

    const addEventListeners = () => {
        if (events) {
            Object.keys(events).forEach((event) => {
                player.on(event, events[event]);
            })
        }
    };

    const removeEventListeners = () => {
        if (events) {
            Object.keys(events).forEach((event) => {
                player.off(event, events[event]);
            })
        }
    };

    const onCoverStateChanged = (state, params) => {
        if (state === 'loaded') {
            const isAutoplayExpected = !!(params && params.isAutoplayExpected);
            if (isAutoplayExpected) {
                setTimeout(() => {
                    setAutoplayTimedOut(true);
                }, waitForAutoplayTimeout * 1000);
            } else {
                setShouldShowLoadingCover(false);
                setShouldShowPlayCover(true);
            }
        } else if (state === 'started') {
            setShouldShowLoadingCover(false);
            setShouldShowPlayCover(false);
        }
    };

    useEffect(() => {
        if (EkoPlayer.isSupported()) {
            setIsSupported(true);
            setPlayer(new EkoPlayer(ekoProjectContainer.current));
        } else {
            setIsSupported(false);
        }
    }, []);

    useEffect(() => {
        if (!autoplayTimedOut) {
            return;
        }

        // Reset autoplayTimedOut
        setAutoplayTimedOut(false);

        // If we're currently showing the loading cover,
        // hide the loading cover and display the play cover instead.
        if (shouldShowLoadingCover) {
            setShouldShowLoadingCover(false);
            setShouldShowPlayCover(true);
        }
    }, [autoplayTimedOut])

    useEffect(() => {
        if (!getEkoPlayerRef) {
            return;
        }

        getEkoPlayerRef(player);
    }, [player, getEkoPlayerRef]);

    useEffect(() => {
        if (!player) {
            return;
        }

        // Assign event listeners according to the events map.
        addEventListeners();

        // We should show the loading cover while loading
        setShouldShowLoadingCover(true);

        // We should hide the play cover while loading
        setShouldShowPlayCover(false);

        // Build loading options and load required project.
        player.load(projectId, {
            cover: loadingCover ? onCoverStateChanged : undefined,
            env,
            params,
            events: (events && Object.keys(events)) || [],
            pageParams: forwardParams || [],
        });

        // We return the removeEventListeners from the useEffect function so it'll be called when the component unmounts, or when deps change.
        return removeEventListeners;

    }, [player, projectId]);


    useEffect(() => {
        if (!player) {
            return;
        }

        if (togglePlayback) {
            player.play()
        } else {
            player.pause()
        }

    }, [player, togglePlayback]);

    // Render unsupported if browser does not support eko videos
    if (isSupported === false) {
        return unsupported;
    }

    // Render eko video
    return (
        <>
            {/* Render div that will contain the eko video iframe */}
            <div ref={ekoProjectContainer} />

            {/* Render children (if any given) */}
            {
                children
            }

            {/* Conditionally render the custom loading cover (if any given) */}
            {
                loadingCover && shouldShowLoadingCover ?
                    (
                        <div className="eko_cover">
                            {loadingCover}
                        </div>
                    ) :
                    null
            }

            {/* Conditionally render the play cover */}
            {
                shouldShowPlayCover ?
                    (
                        <div className="eko_cover">
                            {playCover}
                        </div>
                    ) :
                    null
            }
        </>
    );
}

EkoVideo.propTypes = {
    projectId: PropTypes.string.isRequired,
    env: PropTypes.string,
    params: PropTypes.objectOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
            PropTypes.number
        ])
    ),
    loadingCover: PropTypes.element,
    playCover: PropTypes.element,
    forwardParams: PropTypes.arrayOf(PropTypes.string),
    events: PropTypes.objectOf(PropTypes.func),
    togglePlayback: PropTypes.bool,
    unsupported: PropTypes.element,
    getEkoPlayerRef: PropTypes.func,
};