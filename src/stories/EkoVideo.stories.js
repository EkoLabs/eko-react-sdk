import React from 'react';
import { EkoVideo } from '../components/EkoVideo/EkoVideo';
import CookingLoadingCover from "./CookingLoadingCover/CookingLoadingCover";
import CookingLoadingCoverWithCustomTransition from "./CookingLoadingCoverWithCustomTransition/CookingLoadingCoverWithCustomTransition";
import EkoVideoTemplate from "./EkoVideoTemplate/EkoVideoTemplate";

export default {
    title: 'Example/EkoVideo',
    component: EkoVideo,
    argTypes: {
        // backgroundColor: { control: 'color' },
        playCover: {
            type: { summary: 'React Element'},
            defaultValue: null
        }
    },
    parameters: {docs: {
            // inlineStories: false,
            iframeHeight: 500,
            description: {
                component: 'Renders an eko Video'
            }
        }}
};


const defaultArgs = {
    projectId: "VyYYl0"
};

export const Simple = EkoVideoTemplate.bind({});
Simple.args = {
    ...defaultArgs,
};

Simple.parameters = {
    docs: { description: { story: 'some story **markdown**'} },
};


// no autoplay
export const NoAutoplay = EkoVideoTemplate.bind({});
NoAutoplay.args = {
    ...defaultArgs,
    params: {
        autoplay: false
    }
};

// custom loading cover
export const CustomLoadingCover = EkoVideoTemplate.bind({});
CustomLoadingCover.args = {
    projectId: "M48nxx",
    // projectId: "V5ErbX",
    // projectId: "AWLLK1",
    loadingCover: CookingLoadingCover,
    // params: {autoplay: false}
};

CustomLoadingCover.parameters = {
    docs: { description: { story: 'This cover will be displayed while the project is loading, and removed once playback is possible'}},
};

export const CustomLoadingCoverWithCustomTransition = EkoVideoTemplate.bind({});
CustomLoadingCoverWithCustomTransition.args = {
    projectId: "AWLLK1",
    loadingCover: CookingLoadingCoverWithCustomTransition,
    params: {autoplay: false}
};