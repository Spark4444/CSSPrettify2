/**
 * Reformat parsed JSON into a more usable and filterable format.
 * 
 * New Format:
 * [
 *     {
 *         "selectorName": [{
 *             "property": "value"
 *         }, ...],
 *         "children": [ ... ]
 *     },
 *     ...
 * ]
 * 
 * @param {object} json - The parsed CSS JSON object
 * @returns {array} Reformatted CSS structure
 */
export default function reformatCSS(json) {
    const reformatted = [];
    const children = json.children;
    for (const selector in children) {
        const node = children[selector];
        const attributes = node.attributes;

        const attrArray = [];
        for (const prop in attributes) {
            const value = attributes[prop];
            // If the value is an array, take the last value (to handle duplicates), just like real CSS would do
            if (Array.isArray(value)) {
                attrArray.push({ [prop]: value[value.length - 1] });
            } else {
                attrArray.push({ [prop]: value });
            }
        }

        const childrenArray = [];
        if (node.children && Object.keys(node.children).length > 0) {
            childrenArray.push(...reformatCSS(node));
        }

        reformatted.push({
            [selector]: attrArray,
            children: childrenArray
        });
    }
    
    return reformatted;
}
