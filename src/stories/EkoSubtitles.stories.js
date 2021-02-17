import React from 'react';
import {EkoSubtitles} from '../components/EkoSubtitles/EkoSubtitles';
import ExternalSubtitlesTemplate from "./ExternalSubtitlesTemplate/ExternalSubtitlesTemplate";

export default {
    title: 'Example/EkoSubtitles',
    component: EkoSubtitles,
    argTypes: {
        style: {}
    },
    parameters: {
        docs: {
            // inlineStories: false,
            iframeHeight: 500,
            description: {
                component: 'Renders the subtitles outside of the player'
            },
            source: {
                code: `
function(props){
    return (
        <EkoPlayerProvider>
            <EkoVideo />
            <EkoSubtitles />
        </EkoPlayerProvider>
    )
}`
            }
        },
    }
};

// TODO: remove env once proxy mode feature has been released
const defaultArgs = {
    id: "MYjeJr",
    seekTime: 2,
    params: {
        clearcheckpoints: true,
        autoplay: true
    },
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

export const SimpleSubtitles = ExternalSubtitlesTemplate.bind({});
SimpleSubtitles.args = {
    ...defaultArgs,
    style: {background: 'black', color: 'white', padding: '10px 30px'}
}

SimpleSubtitles.parameters ={
    ...defaultParams,
    docs: { description: { story: 'Show subtitles underneath the player, no styling.'} },
}

export const StyledSubtitles = ExternalSubtitlesTemplate.bind({});
StyledSubtitles.args = {
    ...defaultArgs,
    style: {background: 'black', color: 'red', padding: '10px 30px', font: '18px Arial'}
}

StyledSubtitles.parameters ={
    ...defaultParams,
    docs: { 
        description: { 
            story: 'Show subtitles underneath the player, with some styling.'
        },
        source: {
            code: `<EkoSubtitles style={color: "red", font: "18px Arial"}/>` 
        }
    }
}