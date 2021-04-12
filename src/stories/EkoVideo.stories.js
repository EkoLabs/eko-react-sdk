import React from 'react';
import { EkoVideo } from '../components/EkoVideo/EkoVideo';
import CookingLoadingCover from "./CookingLoadingCover/CookingLoadingCover";
import CookingLoadingCoverWithCustomTransition from "./CookingLoadingCover/CookingLoadingCoverWithCustomTransition";
import EkoVideoTemplate from "./EkoVideoTemplate/EkoVideoTemplate";
import isChromatic from './utils/isChromatic';

export default {
    title: 'Example/EkoVideo',
    component: EkoVideo,
    argTypes: {
        id: {},
        params: { control: { disable: true } },
        excludePropagatedParams: { control: { disable: true } },
        events: { control: { disable: true } },
        loadingCover: { control: { disable: true } },
        playCover: { control: { disable: true } },
        unsupportedCover: { control: { disable: true } },
        waitForAutoplayTimeout: { control: { disable: true } },
        onPlayerInit: { control: { disable: true } },
        embedAPI: { table: { disable: true } },
        env: { table: { disable: true } },
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

export const Simple = EkoVideoTemplate.bind({});
Simple.args = {
    ...defaultArgs
};
Simple.parameters ={
    ...defaultParams
}

Simple.parameters = {
    docs: { description: { story: 'some story **markdown**'} },
};


// no autoplay
export const NoAutoplay = EkoVideoTemplate.bind({});
NoAutoplay.parameters = {
    ...defaultParams,
    docs: {
        source: {
            code: `<EkoVideo id="VyYYl0" params={{autoplay: false}} />`
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

const cookshopDefaultArgs = {
    id: "sc88q49",
    embedAPI: "2.0",
    excludePropagatedParams: ['id'],
    ...(
        isChromatic() &&
        {
            // Pause once decision has started (UI is shown)
            events: {
                'decision.start': () => {},
                seeked: function(){
                    this.once('decision.start', () => {
                        this.pause();
                    });
                },
            },
            params: {
                headnodeid: 'node_0_loop_55ad71',
                context: 'cc5jqNEz',

                // Disable ekoshell background color when paused
                deliveryobject: JSON.stringify({
                    environment: {
                        playerOptionsOverrides: {
                            plugins: {
                                ekoshell: {
                                    addons: {
                                        projectmetadata: {
                                            background: 'rgba(0,0,0,0)'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }),
            }
        }
    )
};

// custom loading cover
export const CustomLoadingCover = EkoVideoTemplate.bind({});
CustomLoadingCover.args = {
    ...cookshopDefaultArgs,
    loadingCover: CookingLoadingCover,
};

CustomLoadingCover.parameters = {
    ...defaultParams,
    docs: {
        description: { story: 'This cover will be displayed while the project is loading, and removed once playback is possible'},
        source: {
            code: `<EkoVideo id="sc88q49" loadingCover={CookingLoadingCover} />`
        }
    },
};

export const CustomLoadingCoverWithCustomTransition = EkoVideoTemplate.bind({});
CustomLoadingCoverWithCustomTransition.args = {
    ...cookshopDefaultArgs,
    loadingCover: CookingLoadingCoverWithCustomTransition,
};

CustomLoadingCoverWithCustomTransition.parameters = {
    ...defaultParams,
    docs: {
        description: { story: 'This cover will be displayed while the project is loading, and removed using some transition animation once playback is possible. See `CookingLoadingCoverWithCustomTransition.jsx` for an example of implementation'},
        source: {
            code: `<EkoVideo id="sc88q49" loadingCover={CookingLoadingCoverWithCustomTransition} />`
        }
    },
};
