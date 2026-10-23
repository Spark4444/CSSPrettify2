// Show message that dissappears and appears
function showMessage(msg) {
  resultMessage.innerHTML = msg;

  // Get current opacity from running animation or computed style
  let startOpacity = 0;
  if (messageAnimation) {
    const computedOpacity = window.getComputedStyle(resultMessage).opacity;
    startOpacity = parseFloat(computedOpacity);
    messageAnimation.cancel();
    messageAnimation = null;
  }

  resultMessage.style.opacity = startOpacity;

  // Animate: current opacity -> 1 -> 0 over 3000ms
  messageAnimation = resultMessage.animate(
    [
      { opacity: startOpacity, offset: 0 },
      { opacity: 1, offset: 0.5 },
      { opacity: 0, offset: 1 },
    ],
    {
      duration: 3000,
      easing: "ease-in-out",
      fill: "forwards",
    },
  );

  // Ensure final state is opacity 0 and clear animation reference
  messageAnimation.onfinish = () => {
    resultMessage.style.opacity = 0;
    messageAnimation = null;
  };
}
