import React, {useEffect, useState} from "react";
import {getRenderable} from "./utils";
import DefaultPlayCover from "../DefaultPlayCover/DefaultPlayCover";


export function useCovers({loadingCover,
                           playCover = DefaultPlayCover,
                           waitForAutoplayTimeout = 1.5,
                           playerLoadingState}){
    const [shouldShowLoadingCover, setShouldShowLoadingCover] = useState(true);
    const [shouldShowPlayCover, setShouldShowPlayCover] = useState(false);
    const [autoplayTimedOut, setAutoplayTimedOut] = useState(false);


    useEffect(()=>{
        if (playerLoadingState.state === 'loading') {
            // We should show the loading cover while loading
            setShouldShowLoadingCover(true);

            // We should hide the play cover while loading
            setShouldShowPlayCover(false);
        } else if (playerLoadingState.state === 'loaded') {
            const isAutoplayExpected = !!(playerLoadingState.params && playerLoadingState.params.isAutoplayExpected);
            if (isAutoplayExpected) {
                setTimeout(() => {
                    setAutoplayTimedOut(true);
                }, waitForAutoplayTimeout * 1000);
            } else {
                setShouldShowLoadingCover(false);
                setShouldShowPlayCover(true);
            }
        } else if (playerLoadingState.state === 'started') {
            setShouldShowLoadingCover(false);
            setShouldShowPlayCover(false);
        }
    }, [playerLoadingState])

    useEffect(() => {
        if (!autoplayTimedOut) {
            return;
        }

        // Reset autoplayTimedOut
        setAutoplayTimedOut(false);

        // If we're currently showing the loading cover,
        // hide the loading cover and display the play cover instead.
        if (shouldShowLoadingCover) {
            setShouldShowLoadingCover(false);
            setShouldShowPlayCover(true);
        }
    }, [autoplayTimedOut])



    // Conditionally render the custom loading cover (if any given)
    let playCoverEl = shouldShowPlayCover &&
        (
            <div className="eko_cover">
                {getRenderable(playCover)}
            </div>
        );

    // Conditionally render the play cover
    let loadingCoverEl =  loadingCover && shouldShowLoadingCover &&
        (
            <div className="eko_cover">
                {getRenderable(loadingCover)}
            </div>
        );


    return (
        <>
            {playCoverEl}
            {loadingCoverEl}
        </>
    )
}