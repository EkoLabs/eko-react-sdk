import {useRef} from "react";
import CustomLoadingCover from "./CookingLoadingCover.scss";

// Cooking animation by Pawal
// source: https://codepen.io/pawelqcm/pen/ObwyNe

export default function CookingLoadingCoverWithCustomTransition(props){
    let loadingCoverRef = useRef()

    // example of a css-based fade out transition
    props.registerTransitionOut(transitionComplete => {
        let loadingCoverEl = loadingCoverRef.current;
        // register handler for when the transition ends
        // we let eko-react-sdk know that the loading cover can now be removed
        loadingCoverEl.addEventListener('transitionend', () => {
            transitionComplete();
        }, {once: true});

        // add a class which starts the transition animation
        loadingCoverEl.classList.add("loaded");
    })

    return (
        <div className="cooking_loading_cover" ref={loadingCoverRef}>
            <h1>Cooking video..</h1>
            <div className="cooking">
                <div className="bubbles">
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                </div>
                <div className="area">
                    <div className="sides">
                        <div className="pan"></div>
                        <div className="handle"></div>
                    </div>
                    <div className="pancake">
                        <div className="pastry"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}