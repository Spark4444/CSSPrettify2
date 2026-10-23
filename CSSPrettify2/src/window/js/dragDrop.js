// Drag and drop functionality
const drop = document.querySelector(".drop");
const body = document.body;

let animationCanBeCalled = true;
let leaveTimeout;
let dropAnimation = null;

function showDrop() {
    if (animationCanBeCalled) {
        animationCanBeCalled = false;
      // Get current opacity from running animation or computed style
      let startOpacity = 0;
      if (dropAnimation) {
        const computedOpacity = window.getComputedStyle(drop).opacity;
        startOpacity = parseFloat(computedOpacity);
        dropAnimation.cancel();
        dropAnimation = null;
      }

      drop.style.display = "";
      drop.style.opacity = startOpacity;

      // Animate from current opacity to 1 over 1000ms
      dropAnimation = drop.animate(
        [
          { opacity: startOpacity, offset: 0 },
          { opacity: 1, offset: 1 },
        ],
        {
          duration: 1000,
          easing: "ease-in-out",
          fill: "forwards",
        },
      );

      // Ensure final state is opacity 1 and clear animation reference
      dropAnimation.onfinish = () => {
        drop.style.opacity = 1;
        dropAnimation = null;
      };
    }
}

function hideDrop() {
    if (!animationCanBeCalled) {
        animationCanBeCalled = true;
        // Get current opacity from running animation or computed style
        let startOpacity = 1;
        if (dropAnimation) {
            const computedOpacity = window.getComputedStyle(drop).opacity;
            startOpacity = parseFloat(computedOpacity);
            dropAnimation.cancel();
            dropAnimation = null;
        }

        // Ensure starting opacity before animating
        drop.style.display = "";
        drop.style.opacity = startOpacity;

        // Animate: current opacity -> 0 over 1000ms
        dropAnimation = drop.animate(
            [
                { opacity: startOpacity, offset: 0 },
                { opacity: 0, offset: 1 },
            ],
            {
                duration: 1000,
                easing: "ease-in-out",
                fill: "forwards"
            }
        );
        
        // Ensure final state is opacity 0 and clear animation reference
        dropAnimation.onfinish = () => {
            drop.style.opacity = 0;
            drop.style.display = "none";
            dropAnimation = null;
        };
    }
}

// Drag and drop event listeners
body.addEventListener("dragover", (event) => {
    event.preventDefault();
    showDrop();

    // Timeout to hide the drop area after 500ms of no dragover events, if the event doesnt refire
    // My implementation idea from "MinimalisticNewTab" btw
    clearTimeout(leaveTimeout);
    leaveTimeout = setTimeout(() => {
        hideDrop();
    }, 500);
});

// Drop
body.addEventListener("drop", async (event) => {
    event.preventDefault();
    hideDrop();

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        try {
            const options = Object.fromEntries(optionsMap);
            const result = await window.electron.dropFile(files[0], options);
            
            if (result) {
                showMessage(`Edited CSS file saved to: \n ${result}`);
            }
        } catch (error) {
            showMessage(`Error processing dropped file: ${error.message}`);
        }
    }
});
