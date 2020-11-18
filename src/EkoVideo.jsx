import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import EkoPlayer from 'eko-js-sdk';

window.blahReact  = React;

const STYLES = {
    UNSUPPORTED: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center',
        fontSize: '30px',
        userSelect: 'none',
    },
    COVER: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
    },
    PLAY: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 'auto',
        fontSize: '2em',
        width: '6vw',
        minWidth: '140px',
        pointerEvents: 'none',
    }
};
const DEFAULT_UNSUPPORTED_EL = <div style={{ ...STYLES.COVER, ...STYLES.UNSUPPORTED }}>Video is not supported on current browser</div>;
const DEFAULT_PLAY_COVER_EL = (
    <div style={{ ...STYLES.COVER, backgroundColor: 'black' }}>
        <div style={STYLES.PLAY}>
            <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" stroke="#7420b9" strokeWidth="3"></circle>
                <circle fill="#111111" cx="50" cy="50" r="46"></circle>
                <path
                    fill="#7420b9"
                    d="M70.8,49.7c0,1-1,1.8-1,1.8L41.6,70.1c-2,1.4-3.7,0.4-3.7-2.3V31.6c0-2.7,1.7-3.8,3.7-2.4l28.1,18.6C69.7,47.9,70.8,48.6,70.8,49.7z"
                ></path>
            </svg>
        </div>
    </div>
);

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
                      playCover = DEFAULT_PLAY_COVER_EL,
                      unsupported = DEFAULT_UNSUPPORTED_EL,
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
                        <div style={STYLES.COVER}>
                            {loadingCover}
                        </div>
                    ) :
                    null
            }

            {/* Conditionally render the play cover */}
            {
                shouldShowPlayCover ?
                    (
                        <div style={STYLES.COVER}>
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