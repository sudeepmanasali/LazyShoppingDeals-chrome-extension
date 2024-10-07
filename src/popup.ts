console.log("Popup script loaded");

const popupElement = document.querySelector("h1");
if (popupElement) {
  popupElement.addEventListener("click", () => {
    alert("You clicked the popup!");
  });
}
