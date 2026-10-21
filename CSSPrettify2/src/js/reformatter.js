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
            attrArray.push({ [prop]: attributes[prop] });
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
