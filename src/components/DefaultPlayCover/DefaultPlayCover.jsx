import React from 'react';
import "./DefaultPlayCover.scss"

export default function DefaultPlayCover(){
    return (
        <div className="eko_playCover">
            <div className="eko_playCover_playButton">
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
}
