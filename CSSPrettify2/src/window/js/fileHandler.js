const cssInput = document.querySelector("#cssInput");
const fileSelectBtn = document.querySelector("#fileSelectBtn");
const resultMessage = document.querySelector(".resultMessage");

let messageAnimation = null;

// Copy to clipboard function?
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage("Copied new CSS to clipboard!");
    });
}

// Handle text input with Enter key
document.addEventListener("keydown", async (event) => {
    if (event.key === "Enter" && event.target === cssInput && cssInput.value.trim() !== "") {
        try {
            const options = Object.fromEntries(optionsMap);
            const prettified = await window.electron.prettify(event.target.value, options);
            copyToClipboard(prettified);

            // Reset the input field after processing
            event.target.value = "";
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