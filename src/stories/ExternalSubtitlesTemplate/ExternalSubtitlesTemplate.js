import React, { useState } from "react";
import EkoVideoTemplate from "../EkoVideoTemplate/EkoVideoTemplate";
import { EkoSubtitles } from '../../components/EkoSubtitles/EkoSubtitles';

export default function ExternalSubtitlesTemplate(args, context){
    let [playerRef, setPlayerRef] = useState();
    args.onPlayerInit = (player) => { setPlayerRef(player) };
    let ekoVideo = EkoVideoTemplate(args, context);
    let style = args.style || {};
    return (
        <div style={{height: 100 + '%', width: 100 + '%'}}>
            <div style={{height: 80 + '%'}}>
                {ekoVideo}
            </div>
            <EkoSubtitles player={playerRef} style={style}/>
        </div>
    )
}
