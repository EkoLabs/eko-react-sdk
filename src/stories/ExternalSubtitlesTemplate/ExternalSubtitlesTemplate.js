import React from "react";
import EkoVideoTemplate from "../EkoVideoTemplate/EkoVideoTemplate";
import { EkoSubtitles } from '../../components/EkoSubtitles/EkoSubtitles';
import {EkoPlayerProvider} from '../../components/EkoPlayerContext/EkoPlayerContext';

export default function ExternalSubtitlesTemplate(args, context){
    args.onPlayerInit = (player) => { 
        if (player) {
            player.once('plugininitsubtitles', () => {
                player.invoke('subtitles.visible', true);
                player.invoke('subtitles.language', 'en');
            });
        } 
    };
    let ekoVideo = EkoVideoTemplate(args, context);
    let style = args.style || {};
    return (
        <EkoPlayerProvider>
            <div style={{height: 100 + '%', width: 100 + '%'}}>
                <div style={{height: 80 + '%'}}>
                    {ekoVideo}
                </div>
                <h5 style={{padding: '10px 30px', margin: 0, color: 'white', background: 'black'}}>External Subtitles Below:</h5>
                <EkoSubtitles style={style}/>
            </div>
        </EkoPlayerProvider>
    )
}

