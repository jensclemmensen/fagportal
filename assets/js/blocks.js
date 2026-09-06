// ============================================================
// BLOCKS.JS — "motoren" der bygger sider ud fra almindelige
// data-lister (se fx fysik-kemi.html eller fag-liste.js).
//
// Du behøver ikke røre denne fil for at tilføje indhold —
// rediger i stedet data-listerne i den enkelte side, eller i
// fag-liste.js. Denne fil bygger bare HTML'en ud fra dem.
// ============================================================

(function () {

  // ---------- hjælpefunktioner ----------

  function el(tag, className) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }

  function safeEach(liste, fn) {
    (liste || []).forEach(function (item, i) {
      try {
        fn(item, i);
      } catch (e) {
        console.error("Kunne ikke vise blok #" + (i + 1) + ":", item, e);
      }
    });
  }

  // ---------- menu øverst (bygges ud fra FAG_LISTE) ----------

  function renderNav() {
    var ul = document.querySelector(".nav-links");
    if (!ul || typeof FAG_LISTE === "undefined") return;
    var currentFag = document.body.getAttribute("data-fag") || "";

    function lavLi(href, tekst, aktiv) {
      var li = el("li");
      var a = el("a");
      a.href = href;
      a.textContent = tekst;
      if (aktiv) a.setAttribute("aria-current", "page");
      li.appendChild(a);
      return li;
    }

    var frag = document.createDocumentFragment();
    frag.appendChild(lavLi("index.html", "Forsiden", currentFag === "index.html"));
    safeEach(FAG_LISTE, function (fag) {
      frag.appendChild(lavLi(fag.link, fag.titel, fag.link === currentFag));
    });
    ul.innerHTML = "";
    ul.appendChild(frag);
  }

  // ---------- kort (bruges af både "fag" og "emne") ----------

  function lavKort(item) {
    var a = el("a", "card");
    a.href = item.link;

    var imgWrap = el("div", "card-img");
    var img = el("img");
    img.src = item.billede;
    img.alt = item.altTekst || "";
    if (item.billedeTop) img.style.objectPosition = "top";
    imgWrap.appendChild(img);

    var body = el("div", "card-body");
    var h3 = el("h3", "card-title");
    h3.textContent = item.titel;
    var p = el("p");
    p.textContent = item.tekst;
    body.appendChild(h3);
    body.appendChild(p);

    a.appendChild(imgWrap);
    a.appendChild(body);
    return a;
  }

  function renderKortGrid(containerId, liste) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var grid = container.classList.contains("card-grid") ? container : el("div", "card-grid");
    safeEach(liste, function (item) {
      grid.appendChild(lavKort(item));
    });
    if (grid !== container) container.appendChild(grid);
  }

  // ---------- indholdsblokke (tekst-billede, video, billede, liste) ----------

  function lavTekstBillede(b) {
    var split = el("div", "section-split");

    var imgSide = el("div", "section-split-img");
    var figure = el("figure");
    var img = el("img");
    img.src = b.billede;
    img.alt = b.altTekst || "";
    figure.appendChild(img);
    if (b.billedtekst) {
      var figcap = el("figcaption");
      figcap.textContent = b.billedtekst;
      figure.appendChild(figcap);
    }
    imgSide.appendChild(figure);

    var textSide = el("div", "section-split-text");
    if (b.overskriftLille) {
      var h3 = el("h3");
      h3.textContent = b.overskriftLille;
      textSide.appendChild(h3);
    }
    if (b.overskrift) {
      var h2 = el("h2");
      h2.textContent = b.overskrift;
      textSide.appendChild(h2);
    }
    var afsnit = Array.isArray(b.tekst) ? b.tekst : [b.tekst];
    afsnit.forEach(function (t) {
      var p = el("p");
      p.innerHTML = t;
      textSide.appendChild(p);
    });

    if (b.side === "venstre") {
      imgSide.style.order = "1";
      textSide.style.order = "2";
    }

    split.appendChild(imgSide);
    split.appendChild(textSide);

    var wrap = el("div", "wrap");
    wrap.appendChild(split);
    return wrap;
  }

  function lavVideo(b) {
    var wrap = el("div", "wrap");
    wrap.style.maxWidth = "820px";

    if (b.visning === "kort") {
      var grid = el("div", "card-grid");
      var a = el("a", "card");
      a.href = "https://www.youtube.com/watch?v=" + b.youtubeId;
      a.target = "_blank";
      a.rel = "noopener";
      var imgWrap = el("div", "card-img");
      var img = el("img");
      img.src = b.billede || ("https://img.youtube.com/vi/" + b.youtubeId + "/maxresdefault.jpg");
      img.alt = b.overskrift || "";
      imgWrap.appendChild(img);
      var body = el("div", "card-body");
      var h3 = el("h3", "card-title");
      h3.textContent = b.overskrift || "";
      body.appendChild(h3);
      a.appendChild(imgWrap);
      a.appendChild(body);
      grid.appendChild(a);
      wrap.appendChild(grid);
    } else {
      if (b.overskrift) {
        var h2 = el("h2");
        h2.style.textAlign = "center";
        h2.textContent = b.overskrift;
        wrap.appendChild(h2);
      }
      var frame = el("div", "video-frame");
      var iframe = el("iframe");
      iframe.src = "https://www.youtube.com/embed/" + b.youtubeId + "?rel=0";
      iframe.title = b.overskrift || "Video";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      frame.appendChild(iframe);
      wrap.appendChild(frame);
    }
    return wrap;
  }

  function lavBillede(b) {
    var wrap = el("div", "wrap");
    wrap.style.maxWidth = "820px";
    if (b.overskrift) {
      var h2 = el("h2");
      h2.style.textAlign = "center";
      h2.textContent = b.overskrift;
      wrap.appendChild(h2);
    }
    var post = el("div", "wall-post");
    var img = el("img");
    img.src = b.billede;
    img.alt = b.altTekst || "";
    post.appendChild(img);
    wrap.appendChild(post);
    if (b.fuldSkaerm === false) post.classList.add("wall-post--ingen-zoom");
    return wrap;
  }

  function lavListe(b) {
    var wrap = el("div", "wrap");
    wrap.style.maxWidth = "820px";
    if (b.overskrift) {
      var h2 = el("h2");
      h2.style.textAlign = "center";
      h2.textContent = b.overskrift;
      wrap.appendChild(h2);
    }
    if (b.undertekst) {
      var p = el("p");
      p.style.textAlign = "center";
      p.textContent = b.undertekst;
      wrap.appendChild(p);
    }
    var ul = el("ul", "reaction-list");
    (b.punkter || []).forEach(function (punkt, i) {
      // punkt kan enten være ren tekst, eller { tekst, nummer } hvis
      // du har brug for at springe et tal over (fx opgave 15 findes ikke).
      var tekst = (punkt && typeof punkt === "object") ? punkt.tekst : punkt;
      var nummer = (punkt && typeof punkt === "object" && punkt.nummer != null) ? punkt.nummer : (i + 1);
      var li = el("li");
      if (b.nummereret) {
        var num = el("span", "num");
        num.textContent = nummer + ".";
        li.appendChild(num);
      }
      var span = el("span", "reaction-eq");
      span.innerHTML = tekst;
      li.appendChild(span);
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    return wrap;
  }

  var BYGGERE = {
    "tekst-billede": lavTekstBillede,
    "video": lavVideo,
    "billede": lavBillede,
    "liste": lavListe
  };

  function renderIndhold(containerId, liste) {
    var container = document.getElementById(containerId);
    if (!container) return;
    safeEach(liste, function (b, i) {
      var byg = BYGGERE[b.type];
      if (!byg) throw new Error('Ukendt type: "' + b.type + '"');
      var indre = byg(b);
      var section = el("section", "section" + (i % 2 === 1 ? " section-alt" : ""));
      section.appendChild(indre);
      container.appendChild(section);
    });
  }

  // ---------- kør automatisk når siden er klar ----------

  // OBS: denne fil skal indlæses FØR main.js i <script>-rækkefølgen,
  // så indholdet findes i siden, når main.js sætter fuld-skærm-klik op.
  document.addEventListener("DOMContentLoaded", function () {
    renderNav();
    if (typeof FAG_LISTE !== "undefined") renderKortGrid("fag-kort", FAG_LISTE);
    if (typeof EMNE_LISTE !== "undefined") renderKortGrid("emne-kort", EMNE_LISTE);
    if (typeof SIDE_INDHOLD !== "undefined") renderIndhold("side-indhold", SIDE_INDHOLD);
  });
})();
