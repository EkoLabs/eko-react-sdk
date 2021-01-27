import React from 'react';
import {EkoExternalSubtitles} from '../components/EkoExternalSubtitles/EkoExternalSubtitles';
import ExternalSubtitlesTemplate from "./ExternalSubtitlesTemplate/ExternalSubtitlesTemplate";

export default {
    title: 'Example/EkoExternalSubtitles',
    component: EkoExternalSubtitles,
    argTypes: {
    },
    parameters: {
        docs: {
            // inlineStories: false,
            iframeHeight: 500,
            description: {
                component: 'Renders an eko Video'
            },
            source: {
                code: `<EkoVideo id="VyYYl0"/>`
            }
        },
    }
};


const defaultArgs = {
    id: "VyYYl0",
    params: {
        clearcheckpoints: true,
        autoplay: true
    }
};

const defaultParams = {
    // Sets a delay for the component's stories
    chromatic: {
        // prevent false positives
        // Chromatic’s default threshold is .063 where 0 is most accurate and 1 is least accurate
        diffThreshold: 0.4,
        delay: 14500
    },
}

export const ExternalSubtitlesTestStory = ExternalSubtitlesTemplate.bind({});
ExternalSubtitlesTestStory.args = {
    ...defaultArgs
}
ExternalSubtitlesTestStory.parameters ={
    ...defaultParams
}

ExternalSubtitlesTestStory.parameters = {
    docs: { description: { story: 'a subtitles test'} },
};
