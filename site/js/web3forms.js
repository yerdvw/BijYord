// Verstuurt formulieren via Web3Forms (https://web3forms.com) naar info@bijyord.nl.
// De access key is publiek bedoeld; hij is gekoppeld aan info@bijyord.nl.
// De key staat in .env (WEB3FORMS_ACCESS_KEY); build-config.ps1 zet hem in js/config.js.
const WEB3FORMS_ACCESS_KEY = window.WEB3FORMS_ACCESS_KEY;

// Stuurt `velden` (label -> waarde) als e-mail. Geeft true terug bij succes.
async function verstuurFormulier({ onderwerp, naam, email, velden, botcheck }) {
  const antwoord = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: onderwerp,
      from_name: "Website BijYord",
      ...(email ? { replyto: email } : {}),
      name: naam,
      ...velden,
      botcheck,
    }),
  });
  const resultaat = await antwoord.json().catch(() => ({}));
  return antwoord.ok && resultaat.success === true;
}

// Koppelt een formulier aan Web3Forms. `gegevens(form)` levert { naam, email, velden }.
// `naSucces(form)` ruimt het formulier op; standaard wordt alles leeggemaakt.
function koppelFormulier(form, { onderwerp, gegevens, succesTekst, naSucces = (f) => f.reset() }) {
  const status = form.querySelector(".form-status");
  const knop = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const g = gegevens(form);
    knop.disabled = true;
    status.textContent = "Bezig met versturen…";
    try {
      const gelukt = await verstuurFormulier({ onderwerp, ...g, botcheck: form.elements.botcheck?.checked ?? false });
      if (!gelukt) throw new Error("Web3Forms weigerde het bericht");
      status.textContent = succesTekst(g.naam);
      naSucces(form);
    } catch {
      status.textContent = "Het versturen is niet gelukt. Probeer het nog eens, of bel of mail ons even direct.";
    } finally {
      knop.disabled = false;
    }
  });
}
