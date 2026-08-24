// FagPortal — "Klassens ynglingsmusik": indsendelse til Google Forms + live oversigt fra Google Sheets.
(function () {
  var FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSctybQJ9kq5Bzuv5LVYDGKfsRVH5pjalU62t6NavS9IHGSFLw/formResponse";
  var CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vReBMzISMm1AaVe6SM74VleTOXy0Q3BcIg38urzMUYkdMc3D37oJX2SzhpW7KOD5axfw9KDwKKjF813/pub?gid=1551239065&single=true&output=csv";

  var ENTRY = {
    klasse: "entry.1970466963",
    songs: [
      { t: "entry.540737381", k: "entry.2075568487", g: "entry.994801228" },
      { t: "entry.2038399167", k: "entry.1913237459", g: "entry.627565602" },
      { t: "entry.1284275872", k: "entry.892206126", g: "entry.1130859583" },
      { t: "entry.624727451", k: "entry.477674225", g: "entry.127234115" }
    ]
  };

  var form = document.getElementById("ym-form");
  var tbody = document.getElementById("ym-tbody");
  if (!form || !tbody) return;

  var klasse = form.getAttribute("data-klasse");
  var updatedEl = document.querySelector(".ym-updated");

  // ---------- indsendelse af skema ----------

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector(".ym-submit");
    var status = form.querySelector(".ym-status");

    var data = new URLSearchParams();
    data.append(ENTRY.klasse, klasse);
    var anySong = false;
    ENTRY.songs.forEach(function (entry, i) {
      var n = i + 1;
      var t = form.querySelector('[name="s' + n + 't"]').value.trim();
      var k = form.querySelector('[name="s' + n + 'k"]').value.trim();
      var g = form.querySelector('[name="s' + n + 'g"]').value.trim();
      if (t) anySong = true;
      data.append(entry.t, t);
      data.append(entry.k, k);
      data.append(entry.g, g);
    });

    if (!anySong) {
      status.textContent = "Skriv mindst én sang, før du sender.";
      status.className = "ym-status err";
      return;
    }

    submitBtn.disabled = true;
    status.textContent = "Sender…";
    status.className = "ym-status";

    fetch(FORM_ACTION, { method: "POST", mode: "no-cors", body: data })
      .then(function () {
        status.textContent = "Tak! Dine sange er sendt af sted. Det kan tage nogle minutter, før de dukker op i oversigten herunder.";
        status.className = "ym-status ok";
        form.reset();
        submitBtn.disabled = false;
      })
      .catch(function () {
        status.textContent = "Der gik noget galt — prøv igen.";
        status.className = "ym-status err";
        submitBtn.disabled = false;
      });
  });

  // ---------- CSV-parsing ----------

  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field); field = "";
      } else if (c === "\r") {
        // ignoreres
      } else if (c === "\n") {
        row.push(field); rows.push(row); row = []; field = "";
      } else {
        field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // ---------- normalisering + fuzzy-sammenligning ----------

  function norm(s) {
    return (s || "")
      .toLowerCase()
      .trim()
      .replace(/[.,!?'"()\[\]:;_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    var prev = new Array(n + 1);
    var curr = new Array(n + 1);
    for (var j = 0; j <= n; j++) prev[j] = j;
    for (var i = 1; i <= m; i++) {
      curr[0] = i;
      for (var j2 = 1; j2 <= n; j2++) {
        var cost = a[i - 1] === b[j2 - 1] ? 0 : 1;
        curr[j2] = Math.min(prev[j2] + 1, curr[j2 - 1] + 1, prev[j2 - 1] + cost);
      }
      var tmp = prev; prev = curr; curr = tmp;
    }
    return prev[n];
  }

  function similarity(a, b) {
    if (!a.length && !b.length) return 1;
    var dist = levenshtein(a, b);
    return 1 - dist / Math.max(a.length, b.length);
  }

  function escapeHtml(s) {
    return (s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- indlæs og vis oversigt ----------

  function loadOverview() {
    tbody.innerHTML = '<tr><td colspan="5">Henter…</td></tr>';

    fetch(CSV_URL + "&_=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var rows = parseCSV(text);
        if (!rows.length) {
          tbody.innerHTML = '<tr><td colspan="5">Ingen svar endnu.</td></tr>';
          return;
        }

        var header = rows[0];
        var idx = {};
        header.forEach(function (h, i) { idx[h.trim()] = i; });

        var klasseIdx = idx["Klasse"];
        var songCols = [
          [idx["Sang 1 - titel"], idx["Sang 1 - kunstner"], idx["Sang 1 - genre"]],
          [idx["Sang 2 - titel"], idx["Sang 2 - kunstner"], idx["Sang 2 - genre"]],
          [idx["Sang 3 - titel"], idx["Sang 3 - kunstner"], idx["Sang 3 - genre"]],
          [idx["Sang 4 - titel"], idx["Sang 4 - kunstner"], idx["Sang 4 - genre"]]
        ];

        var groups = [];

        for (var r = 1; r < rows.length; r++) {
          var row = rows[r];
          if (!row || row.length < 2) continue;
          if ((row[klasseIdx] || "").trim() !== klasse) continue;

          songCols.forEach(function (cols) {
            var title = (row[cols[0]] || "").trim();
            var artist = (row[cols[1]] || "").trim();
            var genre = (row[cols[2]] || "").trim();
            if (!title) return;

            var tN = norm(title), aN = norm(artist);
            var match = null;

            for (var g = 0; g < groups.length; g++) {
              if (groups[g].titleNorm === tN && groups[g].artistNorm === aN) { match = groups[g]; break; }
            }
            if (!match) {
              for (var g2 = 0; g2 < groups.length; g2++) {
                var grp = groups[g2];
                var tSim = similarity(tN, grp.titleNorm);
                var aSim = similarity(aN, grp.artistNorm);
                if (tSim >= 0.84 && aSim >= 0.7) { match = grp; break; }
              }
            }
            if (!match) {
              match = { titleNorm: tN, artistNorm: aN, titleDisplay: title, artistDisplay: artist, genreCounts: {}, count: 0 };
              groups.push(match);
            }
            match.count++;
            if (genre) match.genreCounts[genre] = (match.genreCounts[genre] || 0) + 1;
          });
        }

        if (!groups.length) {
          tbody.innerHTML = '<tr><td colspan="5">Ingen svar endnu fra ' + escapeHtml(klasse) + '.</td></tr>';
        } else {
          groups.sort(function (a, b) { return b.count - a.count; });

          tbody.innerHTML = "";
          groups.forEach(function (grp, i) {
            var bestGenre = "", bestN = 0;
            Object.keys(grp.genreCounts).forEach(function (g) {
              if (grp.genreCounts[g] > bestN) { bestN = grp.genreCounts[g]; bestGenre = g; }
            });
            var tr = document.createElement("tr");
            tr.innerHTML =
              "<td>" + (i + 1) + "</td>" +
              "<td>" + escapeHtml(grp.titleDisplay) + "</td>" +
              "<td>" + escapeHtml(grp.artistDisplay) + "</td>" +
              "<td>" + escapeHtml(bestGenre) + "</td>" +
              "<td>" + grp.count + "</td>";
            tbody.appendChild(tr);
          });
        }

        if (updatedEl) updatedEl.textContent = "Opdateret " + new Date().toLocaleTimeString("da-DK");
      })
      .catch(function () {
        tbody.innerHTML = '<tr><td colspan="5">Kunne ikke hente oversigten lige nu. Prøv "Opdater oversigt".</td></tr>';
      });
  }

  var refreshBtn = document.getElementById("ym-refresh");
  if (refreshBtn) refreshBtn.addEventListener("click", loadOverview);

  loadOverview();
})();
