import React, { useState } from "react";
import { EkoVideo } from '../../components/EkoVideo/EkoVideo';
import './EkoVideoTemplate.scss';

export default function EkoVideoTemplate(args, context){
    let [shouldLoad, setShouldLoad] = useState();

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
        console.log('fff');
        return (
            <div className="ekoVideoCanvas">{ekoVideoEl}</div>
        )
    }
}