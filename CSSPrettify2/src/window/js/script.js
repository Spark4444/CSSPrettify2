const checkboxes = document.querySelectorAll("input[type=checkbox]");
const cssInput = document.querySelector("#cssInput");
const fileSelectBtn = document.querySelector("#fileSelectBtn");
const resultMessage = document.querySelector(".resultMessage");

let optionsMap = [
    [ "sortSelectors", true ],
    [ "sortProperties", true ],
    [ "mergeDuplicates", true ]
];

let messageAnimation = null;

function showMessage(msg) {
    resultMessage.innerHTML = msg;

    // Cancel any running animation so new messages restart the animation
    if (messageAnimation) {
        messageAnimation.cancel();
        messageAnimation = null;
    }

    // Ensure starting opacity is 0 before animating
    resultMessage.style.opacity = 0;

    // Animate: 0 -> 1 -> 0 over 3000ms
    messageAnimation = resultMessage.animate(
        [
            { opacity: 0, offset: 0 },
            { opacity: 1, offset: 0.5 },
            { opacity: 0, offset: 1 }
        ],
        {
            duration: 3000,
            easing: 'ease-in-out',
            fill: 'forwards'
        }
    );

    // Ensure final state is opacity 0 and clear animation reference
    messageAnimation.onfinish = () => {
        resultMessage.style.opacity = 0;
        messageAnimation = null;
    };
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