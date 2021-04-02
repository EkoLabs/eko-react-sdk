import React, { useState } from "react";
import isChromatic from 'chromatic/isChromatic';
import { EkoVideo } from '../../components/EkoVideo/EkoVideo';
import './EkoVideoTemplate.scss';

let testChromatic = (new URLSearchParams(window.location.search)).has("testChromatic");

export default function EkoVideoTemplate(args, context){
    let [shouldLoad, setShouldLoad] = useState();

    if (testChromatic || isChromatic()) {
        // some stories use specific tests for chromatic
        if (args.chromaticId){
            args.id = args.chromaticId;
        }

        // use the null engine so that tests don't actually load video or audio
        args.params = {
            ...args.params,
            forceTech: "null"
        }

        let seekedToPause = false;

        function onPlayStart(){
            if (!seekedToPause) {
                seekedToPause = true;
                this.invoke("currentTime", args.seekTime || 1);
            }
        }

        args.events = {
            "playing": onPlayStart,
            "ekoshell.playing": onPlayStart, // special handling for ekoshell 1 issue
            "seeked": function(){
                this.once('playing', () => {
                    this.pause();
                });
            },
            ...args.events,
        }

    }

    args.expandToFillContainer = true;

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
