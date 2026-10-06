// Træningsspil til det periodiske system (bruges kun af periodisk-system.html).
// Grundstoffernes navne, symboler og farver er taget fra selve kortet.

(function () {
  "use strict";

  var root = document.getElementById("traener");
  if (!root) return;

  // Symbol, navn (som i kortet), andre accepterede navne. Rækkefølgen er atomnummer 1-109.
  var DATA = [
    ["H","Hydrogen","brint"],["He","Helium"],["Li","Lithium"],["Be","Beryllium"],["B","Bor"],
    ["C","Kulstof","carbon"],["N","Nitrogen","kvælstof"],["O","Oxygen","ilt"],["F","Fluor"],["Ne","Neon"],
    ["Na","Natrium"],["Mg","Magnesium"],["Al","Aluminium"],["Si","Silicium","silicon"],["P","Fosfor"],
    ["S","Svovl"],["Cl","Chlor"],["Ar","Argon"],["K","Kalium"],["Ca","Calcium"],
    ["Sc","Scandium"],["Ti","Titan"],["V","Vanadium"],["Cr","Chrom","krom"],["Mn","Mangan"],
    ["Fe","Jern"],["Co","Cobolt","kobolt"],["Ni","Nikkel"],["Cu","Kobber"],["Zn","Zink"],
    ["Ga","Gallium"],["Ge","Germanium"],["As","Arsen"],["Se","Selen"],["Br","Brom"],
    ["Kr","Krypton"],["Rb","Rubidium"],["Sr","Strontium"],["Y","Yttrium"],["Zr","Zirkonium"],
    ["Nb","Niobium"],["Mo","Molybdæn"],["Tc","Technetium"],["Ru","Ruthenium"],["Rh","Rhodium"],
    ["Pd","Palladium"],["Ag","Sølv"],["Cd","Cadmium"],["In","Indium"],["Sn","Tin"],
    ["Sb","Antimon"],["Te","Tellur"],["I","Jod","iod"],["Xe","Xenon"],["Cs","Cæsium","cesium,caesium"],
    ["Ba","Barium"],["La","Lanthan","lanthanum"],["Ce","Cerium"],["Pr","Praseodym"],["Nd","Neodym"],
    ["Pm","Promethium"],["Sm","Samarium"],["Eu","Europium"],["Gd","Gadolinium"],["Tb","Terbium"],
    ["Dy","Dysprosium"],["Ho","Holmium","hofmium"],["Er","Erbium"],["Tm","Thulium"],["Yb","Ytterbium"],
    ["Lu","Lutetium"],["Hf","Hafnium"],["Ta","Tantal"],["W","Wolfram"],["Re","Rhenium"],
    ["Os","Osmium"],["Ir","Iridium"],["Pt","Platin"],["Au","Guld"],["Hg","Kviksølv"],
    ["Tl","Thallium"],["Pb","Bly"],["Bi","Bismuth","vismut"],["Po","Polonium"],["At","Astatin"],
    ["Rn","Radon"],["Fr","Francium"],["Ra","Radium"],["Ac","Actinium"],["Th","Thorium"],
    ["Pa","Protactinium"],["U","Uran"],["Np","Neptunium"],["Pu","Plutonium"],["Am","Americium"],
    ["Cm","Curium"],["Bk","Berkelium"],["Cf","Californium"],["Es","Einsteinium"],["Fm","Fermium"],
    ["Md","Mendelevium"],["No","Nobelium"],["Lr","Lawrencium"],["Rf","Rutherfordium"],["Db","Dubnium"],
    ["Sg","Seaborgium"],["Bh","Bohrium"],["Hs","Hassium"],["Mt","Meitnerium"]
  ];

  // Farverne i kortet: ikke-metaller (blå), halvmetaller (røde). Resten er metaller (grønne).
  var IKKE = " H He C N O F Ne P S Cl Ar Se Br Kr I Xe Rn ";
  var HALV = " B Si As Sb Te At ";

  function periodeAf(z) { return z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : z <= 36 ? 4 : z <= 54 ? 5 : z <= 86 ? 6 : 7; }
  function iupacGruppe(z) {
    if (z === 1) return 1;
    if (z === 2) return 18;
    var p = periodeAf(z), start = [0, 1, 3, 11, 19, 37, 55, 87][p], pos = z - start + 1;
    if (p === 2 || p === 3) return pos <= 2 ? pos : pos + 10;
    if (p === 4 || p === 5) return pos;
    if (pos <= 2) return pos;
    if (pos === 3) return 3;
    if (z >= 58 && z <= 71) return 0;
    if (z >= 90 && z <= 103) return 0;
    return pos - 14;
  }
  function hovedgruppeAf(z) {
    var g = iupacGruppe(z);
    return g === 1 || g === 2 ? g : g >= 13 ? g - 10 : 0;
  }

  var EL = DATA.map(function (r, i) {
    var z = i + 1, s = r[0];
    var o = { z: z, s: s, n: r[1], alt: r[2] ? r[2].split(",") : [] };
    o.p = periodeAf(z);
    o.hg = hovedgruppeAf(z);
    o.yderst = o.hg === 0 ? 0 : (s === "He" ? 2 : o.hg);
    o.k = IKKE.indexOf(" " + s + " ") >= 0 ? "i" : HALV.indexOf(" " + s + " ") >= 0 ? "h" : "m";
    o.kort = z === 103 ? "Lw" : s; // symbolet, som det står i kortet
    return o;
  });

  /* ---------- Hjælpere ---------- */
  function norm(t) {
    return String(t).trim().toLowerCase().replace(/\s+/g, " ")
      .replace(/æ/g, "ae").replace(/ø/g, "oe").replace(/å/g, "aa");
  }
  var NAVNE = {}, SYMBOLER = {};
  EL.forEach(function (e) {
    NAVNE[norm(e.n)] = e;
    e.alt.forEach(function (a) { NAVNE[norm(a)] = e; });
    SYMBOLER[e.s.toLowerCase()] = e;
  });
  SYMBOLER["lw"] = EL[102];

  function findEl(tekst) {
    var n = norm(tekst);
    return NAVNE[n] || SYMBOLER[n] || null;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function vis(e) { return Math.random() < 0.5 ? { t: e.n, navn: true } : { t: e.s, navn: false }; }
  function fx(liste) { return pick(liste); }
  function navnOgSymbol(e) { return e.n + " (" + e.s + ")"; }
  function antalTekst(n, et, flere) { return n + " " + (n === 1 ? et : flere); }

  /* ---------- Spørgsmål ---------- */
  var KAT = {
    nummer:      { navn: "Grundstofnummer" },
    periode:     { navn: "Periode" },
    hovedgruppe: { navn: "Hovedgruppe" },
    metal:       { navn: "Metal eller ikke-metal" }
  };
  var ALLE = EL;
  var HOVEDTABEL = EL.filter(function (e) { return !(e.z >= 58 && e.z <= 71) && !(e.z >= 90 && e.z <= 103); });
  var HOVEDGRUPPE = EL.filter(function (e) { return e.hg > 0 && e.s !== "He"; });
  var METALIKKE = EL.filter(function (e) { return e.k !== "h"; });

  function tal(tekst) {
    var t = String(tekst).trim().replace(/\.$/, "");
    return /^\d+$/.test(t) ? parseInt(t, 10) : null;
  }
  function talSvar(rigtigt, forklaring) {
    return function (svar) {
      var n = tal(svar);
      if (n === null) return { retry: "Skriv svaret som et tal." };
      return { ok: n === rigtigt, forklaring: forklaring };
    };
  }
  function navnSvar(e) {
    return function (svar) {
      var n = norm(svar);
      if (n === norm(e.n) || e.alt.some(function (a) { return norm(a) === n; })) return { ok: true, forklaring: navnOgSymbol(e) + " har atomnummer " + e.z + "." };
      if (SYMBOLER[n] && !NAVNE[n]) return { retry: "Skriv grundstoffets navn, ikke symbolet." };
      return { ok: false, forklaring: "Grundstof nr. " + e.z + " er " + e.n.toLowerCase() + " (" + e.s + ")." };
    };
  }
  function symbolSvar(e) {
    return function (svar) {
      var t = String(svar).trim();
      if (t === e.s || (e.z === 103 && t === "Lw")) return { ok: true, forklaring: navnOgSymbol(e) + " har atomnummer " + e.z + "." };
      if (t.toLowerCase() === e.s.toLowerCase()) return { retry: "Næsten! Tjek store og små bogstaver i symbolet." };
      if (NAVNE[norm(t)]) return { retry: "Skriv grundstoffets symbol, ikke navnet." };
      return { ok: false, forklaring: "Grundstof nr. " + e.z + " er " + e.n.toLowerCase() + ", og symbolet er " + e.kort + "." };
    };
  }
  // Åbne spørgsmål ("Nævn et grundstof ..."): eleven skal svare i den form, der bliver bedt om
  function aabenSvar(vilNavn, godkend) {
    return function (svar) {
      var t = String(svar).trim(), n = norm(t), e;
      var ukendt = { retry: "Jeg kender ikke grundstoffet “" + t + "”. Tjek stavningen." };
      if (vilNavn) {
        e = NAVNE[n];
        if (!e) return SYMBOLER[n] ? { retry: "Skriv grundstoffets navn, ikke symbolet." } : ukendt;
      } else {
        e = SYMBOLER[n];
        if (!e) return NAVNE[n] ? { retry: "Skriv grundstoffets symbol, ikke navnet." } : ukendt;
        if (t !== e.s && !(e.z === 103 && t === "Lw")) return { retry: "Næsten! Tjek store og små bogstaver i symbolet." };
      }
      return godkend(e);
    };
  }
  function pille(vilNavn) {
    return ' <span class="pse-vil">Skriv grundstoffets ' + (vilNavn ? "navn" : "symbol") + "</span>";
  }

  var BYGGERE = {
    nummer: function (sidst) {
      var e = pickEl(ALLE, sidst);
      if (Math.random() < 0.5) {
        var v = vis(e);
        return { kat: "nummer", type: "tal", hl: e.z,
          tekst: "Hvad er atomnummeret på <strong>" + v.t + "</strong>?",
          tjek: talSvar(e.z, navnOgSymbol(e) + " har atomnummer " + e.z + ".") };
      }
      var vilNavn = Math.random() < 0.5;
      return { kat: "nummer", type: "tekst", vil: vilNavn ? "navn" : "symbol", hl: e.z,
        tekst: "Find grundstoffet med atomnummer <strong>" + e.z + "</strong>." + pille(vilNavn),
        tjek: vilNavn ? navnSvar(e) : symbolSvar(e) };
    },

    periode: function (sidst) {
      if (Math.random() < 0.5) {
        var e = pickEl(HOVEDTABEL, sidst), v = vis(e), skaller = Math.random() < 0.5;
        return { kat: "periode", type: "tal", hl: e.z,
          tekst: skaller ? "Hvor mange elektronskaller har <strong>" + v.t + "</strong>?" : "I hvilken periode står <strong>" + v.t + "</strong>?",
          tjek: talSvar(e.p, navnOgSymbol(e) + " står i periode " + e.p + " og har derfor " + antalTekst(e.p, "elektronskal", "elektronskaller") + ".") };
      }
      var P = 1 + Math.floor(Math.random() * 7), skal = Math.random() < 0.5, vilNavn = Math.random() < 0.5;
      var eksempler = HOVEDTABEL.filter(function (x) { return x.p === P && x.z <= 109; });
      return { kat: "periode", type: "tekst", vil: vilNavn ? "navn" : "symbol",
        tekst: (skal ? "Nævn et grundstof med <strong>" + P + "</strong> elektronskaller." : "Nævn et grundstof, der står i periode <strong>" + P + "</strong>.") + pille(vilNavn),
        tjek: aabenSvar(vilNavn, function (x) {
          var ok = x.p === P;
          return { ok: ok, hl: x.z, forklaring: ok ? navnOgSymbol(x) + " står i periode " + P + "." : navnOgSymbol(x) + " står i periode " + x.p + ", ikke " + P + ". Et rigtigt svar er fx " + navnOgSymbol(fx(eksempler)) + "." };
        }) };
    },

    hovedgruppe: function (sidst) {
      if (Math.random() < 0.5) {
        var e = pickEl(HOVEDGRUPPE, sidst), v = vis(e), skal = Math.random() < 0.5;
        return { kat: "hovedgruppe", type: "tal", hl: e.z,
          tekst: skal ? "Hvor mange elektroner har <strong>" + v.t + "</strong> i yderste skal?" : "I hvilken hovedgruppe står <strong>" + v.t + "</strong>?",
          tjek: talSvar(e.hg, navnOgSymbol(e) + " står i hovedgruppe " + e.hg + " og har derfor " + antalTekst(e.hg, "elektron", "elektroner") + " i yderste skal.") };
      }
      var G = 1 + Math.floor(Math.random() * 8), skalVariant = Math.random() < 0.5, vilNavn = Math.random() < 0.5;
      var gyldige = EL.filter(function (x) { return x.z <= 109 && x.hg > 0 && (skalVariant ? x.yderst === G : x.hg === G); });
      return { kat: "hovedgruppe", type: "tekst", vil: vilNavn ? "navn" : "symbol",
        tekst: (skalVariant ? "Nævn et grundstof med <strong>" + G + "</strong> elektroner i yderste skal." : "Nævn et grundstof, der står i hovedgruppe <strong>" + G + "</strong>.") + pille(vilNavn),
        tjek: aabenSvar(vilNavn, function (x) {
          if (x.hg === 0) return { ok: false, hl: x.z, forklaring: navnOgSymbol(x) + " står ikke i en hovedgruppe. Prøv et grundstof fra hovedgrupperne, fx " + navnOgSymbol(fx(gyldige)) + "." };
          var ok = skalVariant ? x.yderst === G : x.hg === G;
          if (ok) return { ok: true, hl: x.z, forklaring: navnOgSymbol(x) + " står i hovedgruppe " + x.hg + " og har " + antalTekst(x.yderst, "elektron", "elektroner") + " i yderste skal." };
          return { ok: false, hl: x.z, forklaring: navnOgSymbol(x) + " har " + antalTekst(x.yderst, "elektron", "elektroner") + " i yderste skal (hovedgruppe " + x.hg + "). Et rigtigt svar er fx " + navnOgSymbol(fx(gyldige)) + "." };
        }) };
    },

    metal: function (sidst) {
      if (Math.random() < 0.6) {
        var e = pickEl(METALIKKE, sidst), v = vis(e);
        return { kat: "metal", type: "valg", hl: e.z,
          tekst: "Er <strong>" + v.t + "</strong> et metal eller et ikke-metal?",
          tjek: function (svar) {
            var ok = svar === e.k;
            return { ok: ok, forklaring: navnOgSymbol(e) + " er " + (e.k === "m" ? "et metal" : "et ikke-metal") + "." };
          } };
      }
      var vilMetal = Math.random() < 0.5, onsket = vilMetal ? "m" : "i", vilNavn = Math.random() < 0.5;
      var gyldige = METALIKKE.filter(function (x) { return x.k === onsket; });
      return { kat: "metal", type: "tekst", vil: vilNavn ? "navn" : "symbol",
        tekst: "Nævn et <strong>" + (vilMetal ? "metal" : "ikke-metal") + "</strong>." + pille(vilNavn),
        tjek: aabenSvar(vilNavn, function (x) {
          if (x.k === "h") return { retry: navnOgSymbol(x) + " er et halvmetal. Nævn et " + (vilMetal ? "metal" : "ikke-metal") + ", der tydeligt er det." };
          var ok = x.k === onsket;
          return { ok: ok, hl: x.z, forklaring: ok ? navnOgSymbol(x) + " er " + (vilMetal ? "et metal" : "et ikke-metal") + "."
            : navnOgSymbol(x) + " er " + (x.k === "m" ? "et metal" : "et ikke-metal") + ". Et rigtigt svar er fx " + navnOgSymbol(fx(gyldige)) + "." };
        }) };
    }
  };

  function pickEl(pulje, sidst) {
    var e, tries = 0;
    do { e = pick(pulje); tries++; } while (sidst && e.z === sidst && tries < 6);
    return e;
  }

  /* ---------- Score (gemmes i browseren) ---------- */
  var NOEGLE = "pse-traener-v1";
  var tilstand = { valgte: ["nummer"], score: {} };
  Object.keys(KAT).forEach(function (k) { tilstand.score[k] = 0; });

  function indlaes() {
    try {
      var gemt = JSON.parse(localStorage.getItem(NOEGLE));
      if (!gemt) return;
      if (Array.isArray(gemt.valgte)) {
        var v = gemt.valgte.filter(function (k) { return KAT[k]; });
        if (v.length) tilstand.valgte = v;
      }
      Object.keys(KAT).forEach(function (k) {
        var s = gemt.score && gemt.score[k];
        var n = typeof s === "number" ? s : (s && s.rigtige);
        if (n > 0) tilstand.score[k] = n | 0;
      });
    } catch (e) { /* ingen lagring tilgængelig */ }
  }
  function gem() {
    try { localStorage.setItem(NOEGLE, JSON.stringify(tilstand)); } catch (e) { /* ignorér */ }
  }

  /* ---------- Brugerflade ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var qEl = $("pse-q"), form = $("pse-form"), input = $("pse-svar"), valg = $("pse-valg"),
      fb = $("pse-fb"), naeste = $("pse-next"), sp = $("pse-sp"), tom = $("pse-tom"),
      scoreListe = $("pse-score-liste"), nulstil = $("pse-nulstil");
  var kategoriBokse = root.querySelectorAll(".pse-kat input");

  var nu = null, besvaret = false, sidstZ = 0, markeret = null;

  function markerKort(z) {
    fjernMarkering();
    if (!z) return;
    var knap = document.querySelector('.el-hot[data-sym="' + EL[z - 1].kort + '"]');
    if (knap) { knap.classList.add("pse-markeret"); markeret = knap; }
  }
  function fjernMarkering() {
    if (markeret) { markeret.classList.remove("pse-markeret"); markeret = null; }
  }

  function tegnScore() {
    scoreListe.innerHTML = "";
    var sum = 0;
    Object.keys(KAT).forEach(function (k) {
      var n = tilstand.score[k];
      sum += n;
      var li = document.createElement("li");
      li.innerHTML = "<span>" + KAT[k].navn + "</span><strong>" + n + "</strong>";
      scoreListe.appendChild(li);
    });
    $("pse-sum").innerHTML = "<span>I alt</span><strong>" + sum + "</strong>";
  }

  function nytSpoergsmaal() {
    fjernMarkering();
    fb.hidden = true; fb.innerHTML = "";
    naeste.hidden = true;
    besvaret = false;
    if (!tilstand.valgte.length) {
      nu = null; sp.hidden = true; tom.hidden = false; return;
    }
    tom.hidden = true; sp.hidden = false;
    nu = BYGGERE[pick(tilstand.valgte)](sidstZ);
    if (nu.hl) sidstZ = nu.hl;
    qEl.innerHTML = nu.tekst;
    input.value = "";
    input.disabled = false;
    if (nu.type === "valg") {
      form.hidden = true; valg.hidden = false;
      valg.querySelectorAll("button").forEach(function (b) { b.disabled = false; });
    } else {
      form.hidden = false; valg.hidden = true;
      input.setAttribute("inputmode", nu.type === "tal" ? "numeric" : "text");
      var hint = nu.type === "tal" ? "Skriv et tal" : nu.vil === "symbol" ? "Skriv symbolet" : "Skriv navnet";
      input.setAttribute("aria-label", hint);
      input.placeholder = hint;
    }
  }

  function vis_fb(klasse, tekst) {
    fb.hidden = false;
    fb.className = "pse-fb " + klasse;
    fb.innerHTML = "<p>" + tekst + "</p>";
  }

  function afgiv(svar) {
    if (!nu || besvaret) return;
    var r = nu.tjek(svar);
    if (r.retry) { vis_fb("info", r.retry); if (nu.type !== "valg") input.focus(); return; }
    besvaret = true;
    if (r.ok) tilstand.score[nu.kat]++;
    gem(); tegnScore();
    markerKort(r.hl || nu.hl);
    vis_fb(r.ok ? "rigtigt" : "forkert", (r.ok ? "<strong>Rigtigt!</strong> " : "<strong>Ikke helt.</strong> ") + r.forklaring
      + ' <a href="#kortet" class="pse-vis">Se det i kortet</a>');
    input.disabled = true;
    valg.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
    naeste.hidden = false;
    naeste.focus();
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (besvaret) return;
    if (!input.value.trim()) { vis_fb("info", "Skriv et svar først."); input.focus(); return; }
    afgiv(input.value);
  });
  valg.querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () { afgiv(b.dataset.v); });
  });
  naeste.addEventListener("click", function () {
    nytSpoergsmaal();
    if (nu && nu.type !== "valg") input.focus();
  });
  fb.addEventListener("click", function (ev) {
    var a = ev.target.closest(".pse-vis");
    if (!a) return;
    ev.preventDefault();
    var kort = document.querySelector(".full-bleed");
    if (kort) kort.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  kategoriBokse.forEach(function (box) {
    box.checked = tilstand.valgte.indexOf(box.value) >= 0;
    box.addEventListener("change", function () {
      tilstand.valgte = Array.prototype.filter.call(kategoriBokse, function (b) { return b.checked; })
        .map(function (b) { return b.value; });
      gem();
      // Hører det aktuelle ubesvarede spørgsmål ikke længere med i valget, får man et nyt
      if (!nu || !tilstand.valgte.length || (!besvaret && tilstand.valgte.indexOf(nu.kat) < 0)) nytSpoergsmaal();
    });
  });

  // Bekræftelsen står på selve siden, så den ikke afhænger af browserens dialogbokse
  var bekraeft = $("pse-bekraeft");
  function visBekraeft(vis) { bekraeft.hidden = !vis; nulstil.hidden = vis; }
  nulstil.addEventListener("click", function () { visBekraeft(true); $("pse-nej").focus(); });
  $("pse-nej").addEventListener("click", function () { visBekraeft(false); nulstil.focus(); });
  $("pse-ja").addEventListener("click", function () {
    Object.keys(KAT).forEach(function (k) { tilstand.score[k] = 0; });
    gem(); tegnScore();
    visBekraeft(false); nulstil.focus();
  });

  // Start
  indlaes();
  kategoriBokse.forEach(function (box) { box.checked = tilstand.valgte.indexOf(box.value) >= 0; });
  tegnScore();
  nytSpoergsmaal();
})();
