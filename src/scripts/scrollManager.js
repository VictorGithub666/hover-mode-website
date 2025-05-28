export function initScrollManager(threeApp) {
  const isMobile = window.innerWidth <= 768; // You can adjust the breakpoint

  const sections = document.querySelectorAll(".page-section");
  const sectionPositions = [];
  let currentSection = 0;

  // Calculate section positions
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    sectionPositions.push({
      top: rect.top + window.scrollY,
      height: rect.height,
      targetSide: index % 2 === 0 ? 1 : -1,
    });
  });

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Find current section
    currentSection = sectionPositions.findIndex((section, i) => {
      return (
        scrollY >= section.top - windowHeight * 0.5 &&
        scrollY < section.top + section.height - windowHeight * 0.5
      );
    });

    if (currentSection === -1) {
      currentSection =
        scrollY < sectionPositions[0].top ? 0 : sections.length - 1;
    }

    // Calculate progress within current section
    const section = sectionPositions[currentSection];
    const sectionProgress = Math.min(
      Math.max(
        (scrollY - section.top + windowHeight * 0.5) / section.height,
        0
      ),
      1
    );

    const docHeight = document.body.scrollHeight - windowHeight;
    const globalProgress = Math.min(scrollY / docHeight, 1);

    // 💡 Device-specific update
    if (isMobile) {
      // Keep drone centered for mobile
      threeApp.updateDronePosition(globalProgress, {
        sectionIndex: currentSection,
        sectionProgress,
        targetSide: 0, // 0 means center
      });
    } else {
      // Original behavior for desktop
      threeApp.updateDronePosition(globalProgress, {
        sectionIndex: currentSection,
        sectionProgress,
        targetSide: section.targetSide,
      });
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      const targetRect = target.getBoundingClientRect();
      const targetMiddle =
        targetRect.top + window.scrollY - window.innerHeight * 0.3;

      window.scrollTo({
        top: targetMiddle,
        behavior: "smooth",
      });
    });
  });
}
