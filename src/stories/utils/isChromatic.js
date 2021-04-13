import origIsChromatic from 'chromatic/isChromatic';

const testChromatic = (new URLSearchParams(window.location.search)).has('testChromatic');

/**
 * @returns True if we're currently running on chromatic, and/or the "testChromatic" query param is present.
 * False otherwise.
 */
export default function isChromatic() {
    return !!(
        testChromatic ||
        origIsChromatic()
    );
}
