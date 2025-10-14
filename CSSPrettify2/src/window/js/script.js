const checkboxes = document.querySelectorAll("input[type=checkbox]");
const cssInput = document.querySelector("#cssInput");
const fileSelectBtn = document.querySelector("#fileSelectBtn");
const resultMessage = document.querySelector(".resultMessage");

let optionsMap = [
    [ "sortSelectors", true ],
    [ "sortProperties", true ],
    [ "mergeDuplicates", true ]
];

function showMessage(msg) {
    resultMessage.innerHTML = msg;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage("Copied new CSS to clipboard!");
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
            showMessage(`Error prettifying CSS: ${error.message}`);
        }
    }
});

fileSelectBtn.addEventListener("click", async () => {
    try {
        const options = Object.fromEntries(optionsMap);
        const result = await window.electron.prettifyFile(options);

        if (result) {
            showMessage(`Edited CSS file saved to: \n ${result}`);
        }
    } catch (error) {
        showMessage(`Error selecting or processing file: ${error.message}`);
    }
});