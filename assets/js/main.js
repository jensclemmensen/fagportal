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
    document.querySelectorAll(".gallery-2 figure").forEach(function (fig) {
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
    var lens = document.createElement("div");
    lens.className = "magnifier";
    wrap.appendChild(lens);
    var zoomFactor = 2.5;

    function move(e) {
      var rect = wrap.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var size = lens.offsetWidth;
      lens.style.left = (x - size / 2) + "px";
      lens.style.top = (y - size / 2) + "px";
      lens.style.backgroundImage = "url(" + img.getAttribute("src") + ")";
      lens.style.backgroundSize = (rect.width * zoomFactor) + "px " + (rect.height * zoomFactor) + "px";
      lens.style.backgroundPosition = (-(x * zoomFactor - size / 2)) + "px " + (-(y * zoomFactor - size / 2)) + "px";
    }

    wrap.addEventListener("mouseenter", function () { lens.style.display = "block"; });
    wrap.addEventListener("mousemove", move);
    wrap.addEventListener("mouseleave", function () { lens.style.display = "none"; });
  });
});
