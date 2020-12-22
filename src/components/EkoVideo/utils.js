import * as ReactIs from "react-is";
import React from "react";

/**
 * Accepts either a react element or react elementType and returns something that can be rendered
 * @param ref
 * @returns {JSX.Element|null|*}
 */
export function getRenderable(ref, props) {
    if (ReactIs.isValidElementType(ref)) {
        return React.createElement(ref, props);
    } else if (ReactIs.isElement(ref)) {
        return ref;
    }
    return null;
}