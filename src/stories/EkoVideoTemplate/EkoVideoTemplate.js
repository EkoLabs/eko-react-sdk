import React, { useState } from "react";
import isChromatic from 'chromatic/isChromatic';
import { EkoVideo } from '../../components/EkoVideo/EkoVideo';
import './EkoVideoTemplate.scss';


export default function EkoVideoTemplate(args, context){
    let [shouldLoad, setShouldLoad] = useState();

    if (isChromatic()) {
        // without this player.once can't register to "nodestart" event
        args.events = {nodestart: ()=>{}}
        args.onPlayerInit = player => {
            // always pause on the one second mark  to achieve consistent visual regression test results
            player.once("nodestart", () => {
                player.pause();
                player.invoke("currentTime", 1)
            });
        }
    }
    let ekoVideoEl = <EkoVideo {...args} />;

    let ekoVideoDocsEl = (
        <div className="ekoVideoTemplate">
            <div className="ekoVideoTemplateContent">
                {ekoVideoEl}
            </div>
        </div>
    )

    if (context.viewMode === 'docs'){
        if (shouldLoad){
            return ekoVideoDocsEl;
        } else {
            return (
                <button className="ekoVideoTemplate" onClick={()=>setShouldLoad(true)}>
                    <div className="ekoVideoTemplateContent">
                        <div className="caption">Click to load</div>
                    </div>
                </button>
            )
        }
    } else {
        return (
            <div className="ekoVideoCanvas">{ekoVideoEl}</div>
        )
    }
}