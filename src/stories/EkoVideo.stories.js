import React from 'react';
import { EkoVideo } from '../components/EkoVideo/EkoVideo';
import CookingLoadingCover from "./CookingLoadingCover/CookingLoadingCover";
import CookingLoadingCoverWithCustomTransition from "./CookingLoadingCover/CookingLoadingCoverWithCustomTransition";
import EkoVideoTemplate from "./EkoVideoTemplate/EkoVideoTemplate";

export default {
    title: 'Example/EkoVideo',
    component: EkoVideo,
    argTypes: {
        unsupportedCover: { control: { disable: true } },
        loadingCover: { control: { disable: true } },
        playCover: { control: { disable: true } },
        events: { control: { disable: true } },
        onPlayerInit: { control: { disable: true } },
        params: { control: { disable: true } },
        forwardParams: { control: { disable: true } }
    },
    parameters: {
        docs: {
            // inlineStories: false,
            iframeHeight: 500,
            description: {
                component: 'Renders an eko Video'
            },
            source: {
                code: `<EkoVideo projectId="VyYYl0"/>`
            }
        },
        // Sets a delay for the component's stories
        chromatic: {
            // prevent false positives
            // Chromatic’s default threshold is .063 where 0 is most accurate and 1 is least accurate
            diffThreshold: 0.2,
            delay: 20000
        },
    }
};


const defaultArgs = {
    projectId: "VyYYl0",
    params: {
        clearcheckpoints: true,
        autoplay: true
    }
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
NoAutoplay.parameters = {
    docs: {
        source: {
            code: `<EkoVideo projectId="VyYYl0" params={{autoplay: false}} />`
        }
    }
}

NoAutoplay.args = {
    ...defaultArgs,
    params: {
        ...defaultArgs.params,
        autoplay: false
    }
};

// custom loading cover
export const CustomLoadingCover = EkoVideoTemplate.bind({});
CustomLoadingCover.args = {
    projectId: "AWLLK1",
    loadingCover: CookingLoadingCover,
    embedAPI: "2.0",
};

CustomLoadingCover.parameters = {
    docs: {
        description: { story: 'This cover will be displayed while the project is loading, and removed once playback is possible'},
        source: {
            code: `<EkoVideo projectId="AWLLK1" loadingCover={CookingLoadingCover} />`
        }
    },
};

export const CustomLoadingCoverWithCustomTransition = EkoVideoTemplate.bind({});
CustomLoadingCoverWithCustomTransition.args = {
    projectId: "AWLLK1",
    loadingCover: CookingLoadingCoverWithCustomTransition,
    embedAPI: "2.0",
};

CustomLoadingCoverWithCustomTransition.parameters = {
    docs: {
        description: { story: 'This cover will be displayed while the project is loading, and removed using some transition animation once playback is possible. See `CookingLoadingCoverWithCustomTransition.jsx` for an example of implementation'},
        source: {
            code: `<EkoVideo projectId="AWLLK1" loadingCover={CookingLoadingCoverWithCustomTransition} />`
        }
    },
};