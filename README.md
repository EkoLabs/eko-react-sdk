# eko-react-sdk

A React component wrapper for [eko-js-sdk](https://github.com/EkoLabs/eko-js-sdk) which enables easy integration of eko videos into React apps

Demo (Storybook) available [here](https://ekolabs.github.io/eko-react-sdk/)

## Installation

From your favorite CLI tool:

```
npm install @ekolabs/eko-react-sdk
```

## Simple usecase

```jsx
import EkoVideo from '@ekolabs/eko-react-sdk';
<EkoVideo id="VyYYl0"/>
```

## Props

| Prop           | Type           | Description  |
| :-------------: |:--------------:| :------------|
| id | `string` | The eko video ID to load. Changing this prop will cause a reload. |  
| params | `object` | A dictionary of embed params that will affect the delivery. Default includes `{ autoplay: true }` |
| pageParams | `string[]` | Any query params from the page url that should be forwarded to the iframe. Can supply regex and strings. By default, the following query params will automatically be forwarded: `autoplay, debug, utm_*, headnodeid`. |
| events | `object / string[]` | A (1) list of events that should be forwarded to the frame from the player OR (2) a map of eko player events to listeners. In the case of 2, the handler function will be called with the player instance as the `this` context 
| loadingCover | `ReactElement / ElementType` | A React element that will be displayed while video is loading. If not given, will show eko's default loading animation. |
| playCover | `ReactElement / ElementType` | A React element that will be displayed when a custom loading cover (i.e. props.loadingCover) is given, and player does not autoplay. Clicks must pass through this element (i.e. using `pointer-events: none`) so they are triggered on the iframe behind this element and playback can begin. If not given, will display a default play cover. |
| unsupportedCover | `ReactElement / elementType` | A React element that will be displayed in case eko videos are not supported on current environment/browser. If not given, will display a default unsupportedCover message. |
| waitForAutoplayTimeout | `number` | Timeout in seconds to wait for autoplay after video has loaded, but before it has started playback. This is relevant for when a `loadingCover` is passed and video is expected to autoplay. Will hold off on hiding the `loadingCover` until timeout expires, at which point, if video has not started playing, the `playCover` will be displayed instead of `loadingCover`. Default value is 1.5 seconds. |
| onPlayerInit | `function` | A callback function that will be called with an [EkoPlayer](https://github.com/EkoLabs/eko-js-sdk#ekoplayer) instance once available. Useful for when you want to be able to use the underlying functionality exposed by the EkoPlayer, for example calling `ekoPlayer.invoke('muted', true)`. |

## Common use cases

### Using a custom loading cover

![Custom loading cover](https://user-images.githubusercontent.com/3951311/103168643-a433df80-483d-11eb-9177-78da47bb4d83.gif)

By default every project loads with the default eko experience cover. This cover gets removed to display the video itself (if autoplay is available) or the play cover if it's not. You can supply your own loading cover component:

```jsx
import MyLoadingCover from "./MyLoadingCover";
<EkoVideo id="AWLLK1" loadingCover={MyLoadingCover}/>
```

[Working example](https://ekolabs.github.io/eko-react-sdk/?path=/story/example-ekovideo--custom-loading-cover)

### Using a custom out transition in a custom loading cover

![Custom transition in a custom loading cover](https://user-images.githubusercontent.com/3951311/103168637-98e0b400-483d-11eb-9a44-c39f29ed82b2.gif)

[demo](https://ekolabs.github.io/eko-react-sdk/?path=/story/example-ekovideo--custom-loading-cover-with-custom-transition)

If you wish to have animate an out transition once the project is a available to play, be it a CSS animation or JS based - It's possible to do so using the `registerTransition` function passed on to every cover. This function receives a function which takes a `transitionComplete` callback function as a parameter (phew). The `transitionComplete()` should be called once the animation is completed and it's safe to unmount the cover element.

Note that if you don't call `transitionComplete()`, the cover component will not be unmounted.

Here's an example implementation using a CSS animation:

```jsx
export default function MyLoadingCoverWithCustomTransition(props){
    let loadingCoverRef = useRef();

    // example of a css-based fade out transition
    props.registerTransitionOut(transitionComplete => {
        let loadingCoverEl = loadingCoverRef.current;

        // register handler for when the transition ends
        // we let eko-react-sdk know that the loading cover can now be removed
        loadingCoverEl.addEventListener('transitionend', () => transitionComplete(), { once: true });

        // add a class which starts the transition animation
        loadingCoverEl.classList.add("loaded");
    })

    return <div className="my_loading_cover" ref={loadingCoverRef}></div>
}
```

### Interacting with the player

To get a reference to the underlying [`EkoPlayer`](https://github.com/EkoLabs/eko-js-sdk#ekoplayerel) that's exposed by the `eko-js-sdk`, use `onPlayerInit`:

Example implementation saving a reference to the EkoPlayer using the useRef hook:

```jsx
import { useRef } from "react";

function myEkoVideo() {
    const ekoPlayer = useRef();
    const onPlayerInit = player => ekoPlayer.current = player;

    return (
        <div>
            <EkoVideo id="AWLLK1" onPlayerInit={onPlayerInit}/>
            <button onClick={() =>  ekoPlayer.current.pause()}>pause</button>
            <button onClick={() =>  ekoPlayer.current.play()}>play</button>
        </div>
    );
}
```

### Listening to player events

To listen and react to events originating in the eko player inside the iframe, use the `events` prop.
It's a dictionary of [player event names](https://developer.eko.com/api/InterludePlayer.html#Events) to handler functions.

Example:

```jsx
let playerEventHandlers = {
    play: () => console.log("Video is playing"),
    pause: () => console.log("Video is paused"),
    nodestart: node => console.log(`Node ${node.id} has started playing`)
};
<EkoVideo id="AWLLK1" events={playerEventHandlers}/>
```
