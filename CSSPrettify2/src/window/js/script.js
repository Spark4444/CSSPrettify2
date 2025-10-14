const checkboxes = document.querySelectorAll("input[type=checkbox]");
const cssInput = document.querySelector("#cssInput");
const fileSelectBtn = document.querySelector("#fileSelectBtn");

let optionsMap = [
    [ "sortSelectors", true ],
    [ "sortProperties", true ],
    [ "mergeDuplicates", true ]
];

function copyToClipboard(text) {
    console.log(text);
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    });
}

checkboxes.forEach((element, index) => {
    element.addEventListener("change", (event) => {
        optionsMap[index][1] = event.target.checked;
    });
});

document.addEventListener("keydown", async (event) => {
    if (event.key === "Enter" && event.target === cssInput && cssInput.value.trim() !== "") {
        try {
            const options = Object.fromEntries(optionsMap);
            const prettified = await window.electron.prettify(event.target.value, options);
            copyToClipboard(prettified);
        } catch (error) {
            alert(`Error prettifying CSS: ${error.message}`);
        }
    }
});

fileSelectBtn.addEventListener("click", async () => {
    try {
        const options = Object.fromEntries(optionsMap);
        const result = await window.electron.prettifyFile(options);

        if (result) {
            alert(`Prettified file saved to: ${result}`);
        }
    } catch (error) {
        alert(`Error selecting or processing file: ${error.message}`);
    }
});