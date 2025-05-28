import "./styles/style.css";
import { initThreeApp } from "./scripts/threeApp.js";
import { initScrollManager } from "./scripts/scrollManager.js";

// Start Three.js and scroll effects
const threeApp = initThreeApp();
initScrollManager(threeApp);

// Handle resize
window.addEventListener("resize", () => {
  threeApp.onWindowResize();
});
