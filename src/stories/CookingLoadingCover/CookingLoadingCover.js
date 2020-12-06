import CustomLoadingCover from "./CookingLoadingCover.scss";

// Cooking animation by Pawal
// source: https://codepen.io/pawelqcm/pen/ObwyNe

export default function CookingLoadingCover(props){
    return (
        <div className="coocking_loading_cover">
            <h1>Cooking video..</h1>
            <div id="cooking">
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div id="area">
                    <div id="sides">
                        <div id="pan"></div>
                        <div id="handle"></div>
                    </div>
                    <div id="pancake">
                        <div id="pastry"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}