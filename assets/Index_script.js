function openPopup(src) {
  const popup = document.getElementById("imagePopup");
  const popupImg = document.getElementById("popupImg");
  popupImg.src = src;
  popup.style.display = "flex";
  setTimeout(() => popup.classList.add("active"), 10); // slight delay for smooth transition
}

function closePopup() {
  const popup = document.getElementById("imagePopup");
  popup.classList.remove("active");
  setTimeout(() => (popup.style.display = "none"), 300);
}

document.getElementById("imagePopup").addEventListener("click", closePopup);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePopup();
});
