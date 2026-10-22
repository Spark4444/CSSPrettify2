import mergeDuplicateRules from "./filterMergeDuplicates.js";
import sortPropertiesAlphabetically from "./filterSortProperties.js";
import sortSelectorsAlphabetically from "./filterSortSelectors.js";
import mergeRepeatedSelectors from "./filterMergeRepeatedSelectors.js";

/**
 * Filter selectors and properties alphabetically, optionally merging duplicates
 * 
 * @param {array} json - The reformatted CSS array
 * @param {object} options - Configuration options
 * @param {boolean} options.sortSelectors - Sort selectors alphabetically (default: true)
 * @param {boolean} options.sortProperties - Sort properties alphabetically (default: true)
 * @param {boolean} options.mergeDuplicates - Merge duplicate rules (default: true)
 * @returns {array} Filtered and optimized CSS structure
 */
export default function filterCSS(json, options = {}) {
    const {
        sortSelectors = true,
        sortProperties = true,
        mergeDuplicates = true
    } = options;

    let result = json;

    // Apply merge duplicates if enabled
    if (mergeDuplicates) {
        result = mergeDuplicateRules(result);
        result = mergeRepeatedSelectors(result);
    }

    // Apply property sorting if enabled
    if (sortProperties) {
        result = sortPropertiesAlphabetically(result);
    }

    // Apply selector sorting if enabled
    if (sortSelectors) {
        result = sortSelectorsAlphabetically(result);
    }

    return result;
}
