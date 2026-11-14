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

// Levensmoment-tegels en links met data-situatie vullen de keuze in het formulier alvast in.
const contactForm = document.getElementById("contactformulier");
const situatie = contactForm.elements.situatie;
for (const link of document.querySelectorAll("[data-situatie]")) {
  link.addEventListener("click", () => {
    const optie = [...situatie.options].find((o) => o.text === link.dataset.situatie);
    if (optie) situatie.value = optie.value;
  });
}

// Terugbelformulier: nog niet gekoppeld aan een verzendservice.
// Zodra het wel verstuurt, toon dan na succes:
//   `Dank je, ${voornaam}! We bellen je binnen één werkdag.`
const status = contactForm.querySelector(".form-status");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!contactForm.reportValidity()) return;
  const voornaam = contactForm.elements.voornaam.value.trim();
  status.textContent = `Dank je, ${voornaam}! Dit formulier is alleen nog niet gekoppeld, dus je bericht is niet verstuurd. Bel of mail ons even direct, dan helpen we je meteen.`;
});
