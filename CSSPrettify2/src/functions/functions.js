import CSSJSON from "cssjson";

// Function to parse CSS string to JSON, removing comments first
export function parseCSS(css) {
    const cssCommentsRegex = /\/\*[\s\S]*?\*\//g;
    const cssWithoutComments = css.replace(cssCommentsRegex, "");
    return CSSJSON.toJSON(cssWithoutComments);
}


/*
    Function to reformat the parsed JSON into a more usable and filterable format.
    New Format:
    [
        {
            "selectorName": [{
                "property": "value"
            }, ...],
            "children": [ ... ]
        },
        ...
    ]
*/
export function reformatCSS(json) {
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

// Filter Selectors and Properties alphabetically
export function filterCSS(json, options = {}) {
    const {
        sortSelectors = true,
        sortProperties = true,
        mergeDuplicates = true
    } = options;

    // Merge rules, if two elements have at least two repeating rules you can merge them into one with comas and remove the rules from the original elements
    // Or if one or more rules is repeat accross 3 or more elements
    // min - minimum
    // So 2 min rules with 2 min elements can be merged
    // Or 1 min rule with 3 min elements can be merged
    if (mergeDuplicates) {
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
    }

    const filtered = [];
    json.forEach(item => {
        const selector = Object.keys(item)[0];
        const attributes = item[selector];

        // Filter properties alphabetically if option is enabled
        let sortedAttributes = attributes;
    
        if (sortProperties) {
            sortedAttributes = attributes.sort((a, b) => {
                const propA = Object.keys(a)[0].toLowerCase();
                const propB = Object.keys(b)[0].toLowerCase();
                return propA.localeCompare(propB);
            });
        }

        const children = item.children;
        const sortedChildren = children.length > 0 ? filterCSS(children, options) : [];
        
        filtered.push({
            [selector]: sortedAttributes,
            children: sortedChildren
        });
    });

    // Filter selectors alphabetically if option is enabled
    if (sortSelectors) {
        // Sort all the rules alphabetically, ignoring special characters
        filtered.sort((a, b) => {
            const selectorA = Object.keys(a)[0].toLowerCase();
            const selectorB = Object.keys(b)[0].toLowerCase();
            
            // Normalize selectors for comparison by removing leading special characters
            // and other CSS-specific characters, keeping only alphanumeric characters
            function normalizeSelector(selector) {
                return selector.replace(/^[.#]/, '').replace(/[^a-z0-9]/g, '');
            }

            const normalizedA = normalizeSelector(selectorA);
            const normalizedB = normalizeSelector(selectorB);
            
            return normalizedA.localeCompare(normalizedB);
        });

        // Sort all the at rules to the top
        filtered.sort((a, b) => {
            const selectorA = Object.keys(a)[0];
            const selectorB = Object.keys(b)[0];
            const isAtRuleA = selectorA.startsWith("@");
            const isAtRuleB = selectorB.startsWith("@");

            if (isAtRuleA && !isAtRuleB) return -1;
            if (!isAtRuleA && isAtRuleB) return 1;
            return 0;
        });
    }

    return filtered;
}



// Function to add tabbing to each line based on the level of indentation
export function addTabbing(string, level) {
    const tabbing = "    ".repeat(level);
    return string.split("\n").map(line => {
        // Don't add tabbing to empty lines
        if (line.trim() === "") return line;
        return tabbing + line;
    }).join("\n");
}

/* 
    Function to stringify the filtered JSON back to a CSS string
    CSS Format:
    selector {
        property: value;
        ...
    } \n \n
    ...
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