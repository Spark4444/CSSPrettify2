/**
 * Sort selectors alphabetically, with @-rules moved to the top
 * 
 * @param {array} json - The CSS array to process
 * @returns {array} CSS array with selectors sorted
 */
export default function sortSelectorsAlphabetically(json) {
    const filtered = [...json];

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

    return filtered;
}
