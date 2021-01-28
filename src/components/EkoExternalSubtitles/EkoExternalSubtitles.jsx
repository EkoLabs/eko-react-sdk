import React, {useEffect, useRef, useState} from 'react';
import "./EkoExternalSubtitles.scss";
export function EkoExternalSubtitles({player, style}) {
    const [visible, setVisible] = useState(true);
    const [text, setText] = useState('');
    useEffect(() => {
        if (!player) {
            return;
        }
        player.on('subtitles.visibilitychange', (isVisible) => {
            setVisible(isVisible);
        });
        player.on('subtitles.substart', (subObj) => {
            setText(subObj.text);
        });
        player.on('subtitles.subend', (subObj) => {
            setText('');
        });
    }, [player]);
    return (
        <div role= "Subtitles" className="eko_subtitles_container" style={{pointerEvents: 'none'}}>
            {visible && text && <div className={`eko_subtitles_div`} style={style}>
                <span>{text}</span>
            </div>}
        </div>
    );
}
