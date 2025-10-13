const checkboxes = document.querySelectorAll("input[type=checkbox]");
const cssInput = document.querySelector("#cssInput");
const fileInput = document.querySelector("#fileInput");

let options = {
    sortSelectors: true,
    sortProperties: true,
    mergeDuplicates: true
};

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    });
}

checkboxes.forEach(element => {
    element.addEventListener("change", (event) => {
        options[Object.keys(options).find(key => key === element.name)] = event.target.checked;
    });
});

cssInput.addEventListener("input", async (event) => {
    const prettified = await window.electron.prettify(event.target.value, options);
    copyToClipboard(prettified);
});

fileInput.addEventListener("change", async (event) => {
    const filePath = event.target.files[0].path;
    await window.electron.prettifyFile(filePath, options);
    alert("Prettified file saved to the same directory with .prettified.css extension.");
});