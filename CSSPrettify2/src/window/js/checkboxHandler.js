// Checkbox handling functionality
const checkboxes = document.querySelectorAll("input[type=checkbox]");

let optionsMap = [
    [ "sortSelectors", true ],
    [ "sortProperties", true ],
    [ "mergeDuplicates", true ]
];

// Event listeners for checkboxes
checkboxes.forEach((element, index) => {
    element.addEventListener("change", (event) => {
        optionsMap[index][1] = event.target.checked;
    });
});
