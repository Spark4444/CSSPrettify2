import CSSJSON from "cssjson";

/**
 * Parse CSS string to JSON, removing comments first
 * @param {string} css - The CSS string to parse
 * @returns {object} Parsed CSS as JSON object
 */
export default function parseCSS(css) {
    const cssCommentsRegex = /\/\*[\s\S]*?\*\//g;
    const cssWithoutComments = css.replace(cssCommentsRegex, "");
    return CSSJSON.toJSON(cssWithoutComments);
}
