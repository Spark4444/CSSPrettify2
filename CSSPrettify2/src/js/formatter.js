/**
 * Add indentation/tabbing to each line based on the nesting level
 * 
 * @param {string} string - The string to add tabbing to
 * @param {number} level - The indentation level (each level = 4 spaces)
 * @returns {string} String with proper indentation
 */
export function addTabbing(string, level) {
    const tabbing = "    ".repeat(level);
    return string.split("\n").map(line => {
        // Don't add tabbing to empty lines
        if (line.trim() === "") return line;
        return tabbing + line;
    }).join("\n");
}

/**
 * Stringify the filtered JSON back to a CSS string
 * 
 * CSS Format:
 * selector {
 *     property: value;
 *     ...
 * } \n \n
 * ...
 * 
 * @param {array} json - The filtered CSS array
 * @param {number} indentLevel - The current indentation level (default: 0)
 * @returns {string} Formatted CSS string
 */
export function stringifyCSS(json, indentLevel = 0) {
    let cssString = "";
    const baseIndent = "    ".repeat(indentLevel);
    
    json.forEach((item, index) => {
        const selector = Object.keys(item)[0];
        const attributes = item[selector];

        // Add the selector and its properties
        cssString += `${baseIndent}${selector} {\n`;
        attributes.forEach(attr => {
            const prop = Object.keys(attr)[0];
            const value = attr[prop];
            cssString += `${baseIndent}    ${prop}: ${value};\n`;
        });

        // Add the children after the properties recursively
        if (item.children && item.children.length > 0) {
            // Only add newline if there are properties before children
            if (attributes.length > 0) {
                cssString += "\n";
            }
            cssString += stringifyCSS(item.children, indentLevel + 1);
        }
        cssString += `${baseIndent}}\n`;

        // Add an extra newline if not the last item
        if (index < json.length - 1) {
            cssString += `\n`;
        }
    });

    return cssString;
}
