// Rekentool maximale hypotheek — INDICATIEF.
// Vereenvoudigde benadering van de Nibud-leennormen. Controleer de normen
// (woonquote, toetsrente, energielabelbedragen, NHG-grens) jaarlijks.

const LOOPTIJD_MAANDEN = 360;
const MINIMALE_TOETSRENTE = 5.0; // bij rentevaste periode korter dan 10 jaar
const KREDIET_FACTOR = 0.02; // maandlast = 2% van de kredietlimiet
const NHG_GRENS = 470000;

// Extra leenruimte per energielabel.
const ENERGIELABEL_RUIMTE = {
  "A++++": 40000, "A+++": 30000, "A++": 20000, "A+": 20000,
  "A": 10000, "B": 10000, "C": 5000, "D": 5000,
  "E": 0, "F": 0, "G": 0,
};

// Aandeel van het bruto-inkomen dat naar woonlasten mag (benadering bij 4% toetsrente).
const WOONQUOTE_PUNTEN = [
  [0, 0.10], [20000, 0.14], [30000, 0.19], [40000, 0.225], [50000, 0.245],
  [60000, 0.26], [80000, 0.275], [110000, 0.29], [150000, 0.30],
];

function woonquote(inkomen, toetsrente) {
  let basis = WOONQUOTE_PUNTEN[WOONQUOTE_PUNTEN.length - 1][1];
  for (let i = 1; i < WOONQUOTE_PUNTEN.length; i++) {
    const [x1, y1] = WOONQUOTE_PUNTEN[i];
    if (inkomen <= x1) {
      const [x0, y0] = WOONQUOTE_PUNTEN[i - 1];
      basis = y0 + (y1 - y0) * (inkomen - x0) / (x1 - x0);
      break;
    }
  }
  const correctie = 1 + (toetsrente - 4) * 0.06;
  return Math.min(0.40, Math.max(0.08, basis * correctie));
}

function annuiteitsfactor(rentePct) {
  const r = rentePct / 100 / 12;
  return r === 0 ? LOOPTIJD_MAANDEN : (1 - Math.pow(1 + r, -LOOPTIJD_MAANDEN)) / r;
}

const afrondenOpDuizend = (n) => Math.floor(n / 1000) * 1000;

function berekenMaximaleHypotheek(invoer) {
  const { inkomen, partnerInkomen, rente, rentevastePeriode, studieschuldMaand, kredietlimiet, energielabel, woningwaarde } = invoer;
  const toetsrente = rentevastePeriode < 10 ? Math.max(rente, MINIMALE_TOETSRENTE) : rente;
  const totaalInkomen = inkomen + partnerInkomen;
  const quote = woonquote(totaalInkomen, toetsrente);
  const maandruimte = Math.max(0, totaalInkomen * quote / 12 - studieschuldMaand - KREDIET_FACTOR * kredietlimiet);

  const opInkomen = afrondenOpDuizend(maandruimte * annuiteitsfactor(toetsrente));
  const labelRuimte = opInkomen > 0 ? (ENERGIELABEL_RUIMTE[energielabel] ?? 0) : 0;

  let maximaal = opInkomen + labelRuimte;
  if (woningwaarde > 0) maximaal = Math.min(maximaal, afrondenOpDuizend(woningwaarde));

  return {
    maximaal,
    energielabelDeel: Math.max(0, Math.min(labelRuimte, maximaal - opInkomen)),
    toetsrente,
    brutoMaandlast: maximaal / annuiteitsfactor(rente),
    nhgMogelijk: maximaal > 0 && maximaal <= NHG_GRENS,
  };
}

// --- Koppeling met de pagina ---

const euro = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const getal = new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 });

// Leest "55.000", "55000" en "3,9" als getal.
function leesBedrag(waarde) {
  let v = String(waarde).replace(/[^\d,.]/g, "");
  if (v.includes(",")) v = v.replace(/\./g, "").replace(",", ".");
  else if (/\.\d{3}(?!\d)/.test(v)) v = v.replace(/\./g, "");
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function initRekentool(form) {
  const veld = (naam) => form.elements[naam];
  const uit = (naam) => form.querySelector(`[data-output="${naam}"]`);
  const bedragVelden = ["inkomen", "partnerInkomen", "studieschuldMaand", "kredietlimiet", "woningwaarde"];

  function invoer() {
    return {
      inkomen: leesBedrag(veld("inkomen").value),
      partnerInkomen: leesBedrag(veld("partnerInkomen").value),
      rente: leesBedrag(veld("rente").value),
      rentevastePeriode: Number(veld("rentevastePeriode").value),
      studieschuldMaand: leesBedrag(veld("studieschuldMaand").value),
      kredietlimiet: leesBedrag(veld("kredietlimiet").value),
      energielabel: veld("energielabel").value,
      woningwaarde: leesBedrag(veld("woningwaarde").value),
    };
  }

  function toon() {
    const r = berekenMaximaleHypotheek(invoer());
    uit("maximaal").textContent = euro.format(r.maximaal);
    uit("maandlast").textContent = euro.format(Math.round(r.brutoMaandlast));
    uit("energielabel").textContent = euro.format(r.energielabelDeel);
    uit("toetsrente").textContent = `${getal.format(r.toetsrente)}%`;
    uit("nhg").textContent = r.maximaal === 0 ? "—" : r.nhgMogelijk ? `Ja, onder ${euro.format(NHG_GRENS)}` : `Nee, boven ${euro.format(NHG_GRENS)}`;
  }

  // Bedragen netjes opmaken als het veld de focus verliest.
  for (const naam of bedragVelden) {
    veld(naam).addEventListener("blur", (e) => {
      const n = leesBedrag(e.target.value);
      e.target.value = n ? getal.format(n) : "";
    });
  }
  veld("rente").addEventListener("blur", (e) => { e.target.value = getal.format(leesBedrag(e.target.value)); });

  form.addEventListener("input", toon);
  form.addEventListener("change", toon);
  toon();

  // Invoer en uitkomst als leesbare regels, voor de e-mail bij een terugbelverzoek.
  return function samenvatting() {
    const i = invoer();
    const r = berekenMaximaleHypotheek(i);
    return {
      "Bruto jaarinkomen": euro.format(i.inkomen),
      "Inkomen partner": euro.format(i.partnerInkomen),
      "Hypotheekrente": `${getal.format(i.rente)}%`,
      "Rentevaste periode": `${i.rentevastePeriode} jaar`,
      "Studieschuld per maand": euro.format(i.studieschuldMaand),
      "Kredietlimiet andere leningen": euro.format(i.kredietlimiet),
      "Energielabel": i.energielabel,
      "Woningwaarde": i.woningwaarde ? euro.format(i.woningwaarde) : "niet ingevuld",
      "Indicatie maximale hypotheek": euro.format(r.maximaal),
      "Bruto maandlast": euro.format(Math.round(r.brutoMaandlast)),
      "Waarvan energielabel": euro.format(r.energielabelDeel),
      "Getoetst met": `${getal.format(r.toetsrente)}%`,
      "NHG mogelijk": r.maximaal === 0 ? "—" : r.nhgMogelijk ? "Ja" : "Nee",
    };
  };
}
