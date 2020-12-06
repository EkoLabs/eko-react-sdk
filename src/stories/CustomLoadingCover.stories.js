import React from 'react';
import CookingLoadingCover from "./CookingLoadingCover/CookingLoadingCover";

export default {
    title: 'Example/CustomLoadingCover',
    component: CookingLoadingCover,
    argTypes: {
    },
    parameters: {docs: {
            inlineStories: false,
            iframeHeight: 500,
            description: {
                component: 'An example of a custom loading cover'
            }
        }}
};

// CustomLoadingCoverComponent.displayName = "Custom Loading Cover";
const Template = (args) => <CookingLoadingCover {...args} />;

export const Cooking = Template.bind({});
Cooking.parameters = {
    docs: { description: { story: 'some story **markdown**'} },
};