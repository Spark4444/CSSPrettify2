export default function mergeRepeatedSelectors(json) {
    let newJson = [];

    json.forEach(item => {
        const selector = Object.keys(item)[0];
        const attributes = item[selector];
        const children = item.children;

        // Check if the selector already exists in the newJson
        const existing = newJson.find(obj => Object.keys(obj)[0] === selector);
        if (existing) {
            // If it exists, merge the attributes and children
            existing[selector] = [...existing[selector], ...attributes];
            existing.children = [...existing.children, ...children];
        } else {
            // If it doesn't exist, add it as a new entry
            newJson.push({
                [selector]: attributes,
                children: children
            });
        }
    });

    return newJson;
}
