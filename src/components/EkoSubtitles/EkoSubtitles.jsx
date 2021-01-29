import React, {useEffect, useState} from 'react';
import "./EkoSubtitles.scss";
// https://meta.wikimedia.org/wiki/Template:List_of_language_names_ordered_by_code
const RTL_LANGUAGES = ['ar', 'arc', 'dv', 'fa', 'ha', 'he', 'khw', 'ks', 'ku', 'ps', 'ur', 'yi'];
const AD_LANGUAGES = ['en-US-AD'];

export function EkoSubtitles({player, style}) {
    // TODO: Do I need to useRef() or useState() for the player?

    const [visible, setVisible] = useState(false);
    const [text, setText] = useState('');
    const [effectiveLang, setEffectiveLang] = useState('');

    useEffect(() => {
        if (!player) {
            return;
        }
        const onVisibilityChange = (isVisible) => { setVisible(isVisible); };
        const onSubStart = (subObj) => { setText(subObj.text); };
        const onSubEnd = (subObj) => { setText(''); };
        const onLangChange = (effectiveLanguage) => { setEffectiveLang(effectiveLanguage); };

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
    }, [player]);

    // Add right-to-left "direction" css for required languages.
    let rtl = RTL_LANGUAGES.includes(effectiveLang) ? 'rtl' : '';
    let isAudioDescriptionLanguage = AD_LANGUAGES.includes(effectiveLang);
    // Aria Live should only be present for Audio Description languages
    let ariaLiveValue = isAudioDescriptionLanguage ? 'polite' : null;

    return (
        <div role= "Subtitles" style={style}>
            {visible && text && <div className={`eko_subtitles_div ${rtl}`} aria-live={ariaLiveValue} >
                <span>{text}</span>
            </div>}
        </div>
    );
}
