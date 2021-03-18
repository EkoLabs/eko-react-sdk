import React, {useEffect, useState, useContext} from 'react';
import PropTypes from 'prop-types';
import {EkoPlayerContext} from '../EkoPlayerContext/EkoPlayerContext';
import "./EkoSubtitles.scss";
// https://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code
const RTL_LANGUAGES = ['ar', 'arc', 'dv', 'fa', 'ha', 'he', 'khw', 'ks', 'ku', 'ps', 'ur', 'yi'];
const AD_LANGUAGES = ['en-US-AD'];
/**
 * The EkoSubtitles React component displays the subtitles outside of the player. If you are using this,
 * you must wrap both the EkoVideo component and the EkoSubtitles component in an EkoPlayerProvider.
 *
 * @export
 * @member module:components#EkoSubtitles
 * @type {React.Component}
 * @param {object} props
 * @param {object} props.style - Used to style the subtitles component
 * @param {boolean} props.initialVisibility - Used to determine if the subtitles should be visible by default or not
 *
 */
export function EkoSubtitles({style, initialVisibility}) {
    const [visible, setVisible] = useState(initialVisibility || false);
    const [text, setText] = useState('');
    const [effectiveLang, setEffectiveLang] = useState('');
    
    let context = useContext(EkoPlayerContext);
    if (!context) {
        throw new Error('This component needs to be wrapped in a player context, but one was not found');
    }
    let player = context && context.playerState && context.playerState.player;
    let pluginInited = context && context.playerState && context.playerState.pluginInited;
    
    useEffect(() => {
        if (!player) {
            return;
        }
        if (pluginInited) {
            pluginInited('subtitles').then((res) => {
                player.invoke('subtitles.mode', 'proxy');
                player.invoke('subtitles.visible', visible);
            });
        }

        const onVisibilityChange = (isVisible) =>  setVisible(isVisible);
        const onSubStart = (subObj) =>  setText(subObj.text);
        const onSubEnd = (subObj) =>  {
            setText('');
            //TO DO: remove this, its just to test the plugin inited api
            pluginInited('audio').then((res) => {
                console.log('AUDIOS BEEN LOADED');
            })
        }
        const onLangChange = (effectiveLanguage) =>  setEffectiveLang(effectiveLanguage);
        
        player.on('subtitles.visibilitychange', onVisibilityChange);
        player.on('subtitles.substart', onSubStart);
        player.on('subtitles.subend', onSubEnd);
        player.on('subtitles.effectivelanguagechange', onLangChange);
        
        return () => {
            player.off('subtitles.visibilitychange', onVisibilityChange);
            player.off('subtitles.substart', onSubStart);
            player.off('subtitles.subend', onSubEnd);
            player.off('subtitles.effectivelanguagechange', onLangChange);
        };
    }, [player, visible, pluginInited]);

    // Add right-to-left "direction" css for required languages.
    let rtl = RTL_LANGUAGES.includes(effectiveLang) ? 'rtl' : '';
    let isAudioDescriptionLanguage = AD_LANGUAGES.includes(effectiveLang);
    // Aria Live should only be present for Audio Description languages
    let ariaLiveValue = isAudioDescriptionLanguage ? 'polite' : null;

    return (
        <div role="Subtitles" style={style}>
            {visible && text && <div className={`eko_subtitles_container ${rtl}`} aria-live={ariaLiveValue} >
                <span>{text}</span>
            </div>}
        </div>
    );
}

EkoSubtitles.propTypes = {
    style: PropTypes.object,
    initialVisibility: PropTypes.bool
};
