document.addEventListener("DOMContentLoaded", () => {
  const btnSmall = document.getElementById("font-small");
  const btnNormal = document.getElementById("font-normal");
  const btnLarge = document.getElementById("font-large");
  const root = document.documentElement;

  // Tamanhos fixos
  const sizes = {
    small: "14px",
    normal: "19px",
    large: "24px",
  };

  function setFontSize(size) {
    root.style.fontSize = sizes[size];
    localStorage.setItem("fontSize", size);

    [btnSmall, btnNormal, btnLarge].forEach((btn) =>
      btn.classList.remove("active")
    );
    if (size === "small") btnSmall.classList.add("active");
    else if (size === "normal") btnNormal.classList.add("active");
    else btnLarge.classList.add("active");
  }

  btnSmall.addEventListener("click", () => setFontSize("small"));
  btnNormal.addEventListener("click", () => setFontSize("normal"));
  btnLarge.addEventListener("click", () => setFontSize("large"));

  const savedSize = localStorage.getItem("fontSize") || "normal";
  setFontSize(savedSize);
});
