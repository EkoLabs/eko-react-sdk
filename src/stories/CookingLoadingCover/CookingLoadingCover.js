import CustomLoadingCover from "./CookingLoadingCover.scss";

// Cooking animation by Pawal
// source: https://codepen.io/pawelqcm/pen/ObwyNe

export default function CookingLoadingCover(props){
    return (
        <div className="cooking_loading_cover">
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