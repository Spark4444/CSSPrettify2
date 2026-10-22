/**
 * Merge duplicate CSS rules across selectors
 * 
 * Rules are merged when:
 * - A property:value pair appears in 3+ selectors, OR
 * - A property:value pair appears in 2+ selectors with 2+ common properties
 * 
 * @param {array} json - The CSS array to process
 * @returns {array} CSS array with duplicate rules merged
 */
export default function mergeDuplicateRules(json) {
    // Use a Map to track how often each "property:value" pair appears and which selectors contain it
    const propertyValueRepeatCount = new Map();

    // Go through all selectors and count how many times each property:value repeats
    json.forEach(rule => {
        const selector = Object.keys(rule)[0];
        const attributes = rule[selector];
        if (!Array.isArray(attributes)) return;

        attributes.forEach(propObj => {
            const property = Object.keys(propObj)[0];
            const value = propObj[property];
            const key = `${property}:${value}`;

            if (propertyValueRepeatCount.has(key)) {
                const [count, selectors] = propertyValueRepeatCount.get(key);
                selectors.push(selector);
                propertyValueRepeatCount.set(key, [count + 1, selectors]);
            } else {
                propertyValueRepeatCount.set(key, [1, [selector]]);
            }
        });
    });

    // newMergedObjects will hold combined rules keyed by a comma-separated selector list
    const newMergedObjects = {};

    // Count how many times each selector-combination appears across all property:value pairs
    const selectorRepeatCount = new Map();
    for (const [propertyValue, [count, selectors]] of propertyValueRepeatCount.entries()) {
        const joined = selectors.join(", ");
        selectorRepeatCount.set(joined, (selectorRepeatCount.get(joined) || 0) + count);
    }

    // Determine which property:value pairs should be merged and remove them from their original selectors
    for (const [propertyValue, [count, selectors]] of propertyValueRepeatCount.entries()) {
        if (count > 2 || selectorRepeatCount.get(selectors.join(", ")) > 2) {
            const joinedSelectors = selectors.join(", ");

            // Split on the first colon to allow colons inside values (e.g. data URLs)
            const colonIndex = propertyValue.indexOf(":");
            const property = propertyValue.slice(0, colonIndex).trim();
            const value = propertyValue.slice(colonIndex + 1).trim();

            if (!newMergedObjects[joinedSelectors]) newMergedObjects[joinedSelectors] = {};
            newMergedObjects[joinedSelectors][property] = value;

            // Remove the property from old selectors
            selectors.forEach(selectorName => {
                const idx = json.findIndex(item => Object.keys(item)[0] === selectorName);
                if (idx === -1) return;

                const currentAttrs = json[idx][selectorName];
                if (!Array.isArray(currentAttrs)) return;

                // Keep all property objects except the exact property:value pair we're removing
                const filteredAttrs = currentAttrs.filter(propObj => {
                    const propKey = Object.keys(propObj)[0];
                    const propVal = propObj[propKey];
                    return !(propKey === property && String(propVal) === String(value));
                });

                if (filteredAttrs.length === 0) {
                    // If no attributes remain for this selector, remove the selector entry entirely
                    json.splice(idx, 1);
                } else {
                    json[idx][selectorName] = filteredAttrs;
                }
            });
        }
    }

    // Add the new merged selectors back into the json array
    Object.entries(newMergedObjects).forEach(([key, value]) => {
        const newObject = { [key]: [], children: [] };
        Object.entries(value).forEach(([option, optionV]) => {
            newObject[key].push({ [option]: optionV });
        });
        json.push(newObject);
    });

    return json;
}
