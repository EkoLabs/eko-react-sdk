import React, { useState } from "react";
import EkoVideoTemplate from "../EkoVideoTemplate/EkoVideoTemplate";
import { EkoExternalSubtitles } from '../../components/EkoExternalSubtitles/EkoExternalSubtitles';

export default function ExternalSubtitlesTemplate(args, context){
    let [playerRef, setPlayerRef] = useState();
    args.onPlayerInit = (player) => { setPlayerRef(player) };
    let ekoVideo = EkoVideoTemplate(args, context);

    return (
        <div class="eko-subtitles-test-container" style={{height: 100 + '%', width: 100 + '%'}}>
            <div class="eko-video-test-container" style={{height: 80 + '%'}}>
                {ekoVideo}
            </div>
            <EkoExternalSubtitles player={playerRef} />
        </div>
    )
}
