document.addEventListener("DOMContentLoaded", function () {
  const moreCertBtn = document.getElementById("moreCertBtn");
  const certificationsSection = document.querySelector(
    ".certifications-section",
  );

  if (!moreCertBtn || !certificationsSection) return;

  const buttonText = moreCertBtn.querySelector(".button-text");
  const buttonIcon = moreCertBtn.querySelector(".material-symbols-outlined");

  moreCertBtn.addEventListener("click", function () {
    const isExpanded = certificationsSection.classList.toggle("show-all");

    moreCertBtn.setAttribute("aria-expanded", String(isExpanded));

    if (isExpanded) {
      buttonText.textContent = "Show Less";
    } else {
      buttonText.textContent = "More Certifications";
      buttonIcon.textContent = "arrow_forward";

      certificationsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
