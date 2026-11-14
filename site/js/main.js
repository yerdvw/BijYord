// Vereist js/web3forms.js (koppelFormulier) en js/rekentool.js (initRekentool).
const rekentool = document.getElementById("rekentool");
const rekentoolSamenvatting = initRekentool(rekentool);

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

const waarde = (form, naam) => form.elements[naam].value.trim();
const terugbelTekst = (voornaam) => `Dank je, ${voornaam}! We bellen je binnen één werkdag.`;

// Rekentool: terugbelverzoek met de berekening erbij. De berekening zelf blijft staan.
koppelFormulier(rekentool, {
  onderwerp: "Terugbelverzoek via de rekentool",
  gegevens: (f) => ({
    naam: waarde(f, "voornaam"),
    email: waarde(f, "email"),
    velden: {
      Voornaam: waarde(f, "voornaam"),
      Telefoonnummer: waarde(f, "telefoon"),
      "E-mail": waarde(f, "email") || "niet ingevuld",
      ...rekentoolSamenvatting(),
    },
  }),
  succesTekst: terugbelTekst,
  naSucces: (f) => { for (const naam of ["voornaam", "telefoon", "email"]) f.elements[naam].value = ""; },
});

// Terugbelformulier onderaan de pagina.
koppelFormulier(contactForm, {
  onderwerp: "Terugbelverzoek via de website",
  gegevens: (f) => ({
    naam: waarde(f, "voornaam"),
    email: waarde(f, "email"),
    velden: {
      Voornaam: waarde(f, "voornaam"),
      Telefoonnummer: waarde(f, "telefoon"),
      "E-mail": waarde(f, "email") || "niet ingevuld",
      "Waar kunnen we mee helpen": f.elements.situatie.value,
      Bericht: waarde(f, "bericht") || "—",
    },
  }),
  succesTekst: terugbelTekst,
});

// Logolint: lijst dupliceren voor een naadloze loop; knop om de beweging te pauzeren.
for (const lint of document.querySelectorAll("[data-marquee]")) {
  const track = lint.querySelector(".lender-track");
  const kopie = track.firstElementChild.cloneNode(true);
  kopie.setAttribute("aria-hidden", "true");
  kopie.removeAttribute("aria-label");
  track.append(kopie);
  const knop = lint.querySelector("[data-marquee-toggle]");
  knop.addEventListener("click", () => {
    const pauze = lint.classList.toggle("is-paused");
    knop.setAttribute("aria-pressed", String(pauze));
  });
}
