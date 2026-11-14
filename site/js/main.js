// Vereist js/rekentool.js (initRekentool).
initRekentool(document.getElementById("rekentool"));

// Actieve tab volgen tijdens het scrollen.
const links = document.querySelectorAll(".nav a");
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    for (const link of links) {
      if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
  }
}, { rootMargin: "-40% 0px -55% 0px" });
for (const link of links) {
  const sectie = document.querySelector(link.hash);
  if (sectie) observer.observe(sectie);
}

// Contactformulier: nog niet gekoppeld aan een verzendservice.
const contactForm = document.getElementById("contactformulier");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  contactForm.querySelector(".form-status").textContent = "Het formulier is nog niet gekoppeld. Bel of mail ons direct.";
});
