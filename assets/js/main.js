// FagPortal — delt lille script til mobilmenu og billed-lightbox.

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector("button");
    document.querySelectorAll(".gallery-2 figure, .wall-post").forEach(function (fig) {
      fig.addEventListener("click", function () {
        var src = fig.querySelector("img").getAttribute("src");
        lightboxImg.setAttribute("src", src);
        lightbox.classList.add("open");
      });
    });
    function close() { lightbox.classList.remove("open"); }
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  document.querySelectorAll(".zoom-wrap").forEach(function (wrap) {
    var img = wrap.querySelector("img");
    var hots = wrap.querySelectorAll(".el-hot");
    if (!hots.length) return;

    var popup = document.createElement("div");
    popup.className = "el-popup";
    var popupInner = document.createElement("div");
    popupInner.className = "el-popup-inner";
    popup.appendChild(popupInner);
    wrap.appendChild(popup);

    var activeBtn = null;

    function closePopup() {
      popup.classList.remove("open");
      if (activeBtn) activeBtn.classList.remove("active");
      activeBtn = null;
    }

    hots.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (activeBtn === btn) { closePopup(); return; }
        if (activeBtn) activeBtn.classList.remove("active");
        activeBtn = btn;
        btn.classList.add("active");

        var wrapRect = wrap.getBoundingClientRect();
        var btnRect = btn.getBoundingClientRect();

        // Baggrunden holdes på billedets naturlige, beskedne opløsning og forstørres
        // bagefter med CSS transform - beder man Chromium tegne SVG'en direkte ved en
        // meget stor background-size, bliver beskæringen synligt forskudt.
        var natW = img.naturalWidth;
        var natH = img.naturalHeight;

        var fracLeft = (btnRect.left - wrapRect.left) / wrapRect.width;
        var fracTop = (btnRect.top - wrapRect.top) / wrapRect.height;
        var fracW = btnRect.width / wrapRect.width;
        var fracH = btnRect.height / wrapRect.height;

        // lidt luft omkring feltet, så hele den (tynde) sorte kantlinje altid er synlig
        var pad = 1.09;
        var cellW = fracW * natW * pad;
        var cellH = fracH * natH * pad;
        var cellCenterX = (fracLeft + fracW / 2) * natW;
        var cellCenterY = (fracTop + fracH / 2) * natH;

        popupInner.style.width = cellW + "px";
        popupInner.style.height = cellH + "px";
        popupInner.style.backgroundImage = "url(" + img.getAttribute("src") + ")";
        popupInner.style.backgroundSize = natW + "px " + natH + "px";
        popupInner.style.backgroundPosition =
          (-(cellCenterX - cellW / 2)) + "px " +
          (-(cellCenterY - cellH / 2)) + "px";

        var maxDim = Math.max(180, Math.min(260, wrapRect.width * 0.16));
        var aspect = cellW / cellH;
        var finalW, finalH;
        if (aspect >= 1) { finalW = maxDim; finalH = maxDim / aspect; }
        else { finalH = maxDim; finalW = maxDim * aspect; }
        var scale = finalW / cellW;
        popupInner.style.transformOrigin = "top left";
        popupInner.style.transform = "scale(" + scale + ")";

        popup.style.width = finalW + "px";
        popup.style.height = finalH + "px";

        var btnCenterX = (btnRect.left + btnRect.width / 2) - wrapRect.left;
        var btnCenterY = (btnRect.top + btnRect.height / 2) - wrapRect.top;
        var left = btnCenterX - finalW / 2;
        var top = btnCenterY - finalH / 2;
        left = Math.max(4, Math.min(left, wrapRect.width - finalW - 4));
        top = Math.max(4, Math.min(top, wrapRect.height - finalH - 4));
        popup.style.left = left + "px";
        popup.style.top = top + "px";

        popup.classList.add("open");
      });
    });

    document.addEventListener("click", function (e) {
      if (activeBtn && !wrap.contains(e.target)) closePopup();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePopup();
    });
  });

  var printBtn = document.getElementById("print-chart-btn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }
});
