window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const percent =
    (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;

  const progress = document.getElementById("progess");
  if (progress) {
    progress.style.width = percent + "%";
  }
});
