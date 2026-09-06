// ============================================================
// BLOK-EKSEMPLER.JS
//
// Denne fil er IKKE en del af selve hjemmesiden — den bliver
// aldrig indlæst af nogen side. Den er kun en samling eksempler,
// du kan copy-paste fra, når du tilføjer indhold til en side.
//
// Sådan bruger du den: find den blok-type du mangler herunder,
// kopiér hele "{ ... }"-blokken, sæt den ind i den rigtige side's
// SIDE_INDHOLD- eller EMNE_LISTE-liste, og ret felterne til.
//
// Bruger du VS Code (eller github.dev), er der en hurtigere måde:
// skriv fx "blok-tekst-billede" i et <script>-tag og tryk Tab,
// så indsætter VS Code selv blokken med felterne klar til udfyldning
// (se .vscode/fagportal.code-snippets for alle genveje).
// ============================================================

// ---- Billede + tekst side om side (billede til højre som standard) ----
{
  type: "tekst-billede",
  overskrift: "Overskriften",
  overskriftLille: "Valgfri lille overskrift",
  tekst: "Din tekst her.",
  billede: "assets/images/billede.jpg",
  altTekst: "Kort beskrivelse af billedet"
},

// ---- Samme, men med billedet til venstre i stedet ----
{
  type: "tekst-billede",
  overskrift: "Overskriften",
  overskriftLille: "Valgfri lille overskrift",
  tekst: "Din tekst her.",
  billede: "assets/images/billede.jpg",
  altTekst: "Kort beskrivelse af billedet",
  side: "venstre"
},

// ---- Tekst-billede med flere afsnit (tekst kan også være en liste) ----
{
  type: "tekst-billede",
  overskrift: "Overskriften",
  tekst: [
    "Første afsnit.",
    "Andet afsnit. Du kan bruge <strong>fed tekst</strong> og andre HTML-tags her."
  ],
  billede: "assets/images/billede.jpg",
  altTekst: "Kort beskrivelse af billedet",
  billedtekst: "Valgfri billedtekst, vist under billedet."
},

// ---- Video vist direkte på siden (som under Matematik) ----
{
  type: "video",
  overskrift: "Overskriften",
  youtubeId: "sæt-youtube-id-ind-her",
  visning: "indlejret"
},

// ---- Video som et kort, der linker ud til YouTube (som under Valgfag) ----
{
  type: "video",
  overskrift: "Overskriften",
  youtubeId: "sæt-youtube-id-ind-her",
  visning: "kort"
},

// ---- Et enkelt, centreret billede (klik for at zoome ind) ----
{
  type: "billede",
  overskrift: "Valgfri overskrift",
  billede: "assets/images/billede.jpg",
  altTekst: "Kort beskrivelse af billedet"
},

// ---- Samme, men uden zoom-funktion (fx til et diagram med tekst) ----
{
  type: "billede",
  overskrift: "Valgfri overskrift",
  billede: "assets/images/billede.jpg",
  altTekst: "Kort beskrivelse af billedet",
  fuldSkaerm: false
},

// ---- Nummereret liste (fx reaktionsskemaer, se afstemme-reaktionsskemaer.html) ----
{
  type: "liste",
  overskrift: "Overskriften",
  undertekst: "Valgfri undertekst",
  nummereret: true,
  punkter: [
    "Første punkt. Kemiske formler skrives som $$H2O$$",
    "Andet punkt."
  ]
},

// ---- Unummereret liste ----
{
  type: "liste",
  overskrift: "Overskriften",
  nummereret: false,
  punkter: [
    "Første punkt.",
    "Andet punkt."
  ]
},

// ---- Nyt kort til EMNE_LISTE (vises på fagets egen forside, fx fysik-kemi.html) ----
{
  billede: "assets/images/billede.jpg",
  altTekst: "Kort beskrivelse af billedet",
  titel: "Titel",
  tekst: "Kort beskrivelse under titlen.",
  link: "sidenavn.html"
},

// ---- Nyt fag til FAG_LISTE (vises i menuen øverst på ALLE sider + som kort på forsiden) ----
// Rør kun denne, hvis du laver et helt nyt FAG (ikke bare et nyt emne under et eksisterende fag).
// Ligger i sin egen fil: assets/js/fag-liste.js
{
  billede: "assets/images/billede.jpg",
  altTekst: "Kort beskrivelse af billedet",
  titel: "Fagets navn",
  tekst: "Kort beskrivelse af faget.",
  link: "sidenavn.html"
}
