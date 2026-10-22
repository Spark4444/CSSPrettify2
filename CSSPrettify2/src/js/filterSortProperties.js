/**
 * Sort properties alphabetically within each selector
 * 
 * @param {array} json - The CSS array to process
 * @returns {array} CSS array with properties sorted alphabetically
 */
export default function sortPropertiesAlphabetically(json) {
    const filtered = [];
    
    json.forEach(item => {
        const selector = Object.keys(item)[0];
        const attributes = item[selector];
        const children = item.children;

        // Sort properties alphabetically
        const sortedAttributes = attributes.sort((a, b) => {
            const propA = Object.keys(a)[0].toLowerCase();
            const propB = Object.keys(b)[0].toLowerCase();
            return propA.localeCompare(propB);
        });

        // Recursively sort children
        const sortedChildren = children.length > 0 ? sortPropertiesAlphabetically(children) : [];
        
        filtered.push({
            [selector]: sortedAttributes,
            children: sortedChildren
        });
    });

    return filtered;
}
