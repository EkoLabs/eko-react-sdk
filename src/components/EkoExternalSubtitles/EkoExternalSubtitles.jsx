import React, {useEffect, useRef, useState} from 'react';
export function EkoExternalSubtitles() {
    const [visible, setVisible] = useState(true);
    const [text, setText] = useState('');
    return (
        <div role= "Subtitles" className="eko_subtitles_container" style={{pointerEvents: 'none'}}>
            {visible && text && <div className={`eko_subtitles_div`}>
                <span>{text}</span>
            </div>}
        </div>
    );
}
