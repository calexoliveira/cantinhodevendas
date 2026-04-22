const hamburgerButton = document.querySelector("#hamburgerButton");
const closeButton = document.querySelector("#closeButton");

const mobileMenu = document.querySelector("#mobileMenu");

hamburgerButton.addEventListener("click", function () {
  mobileMenu.classList.add("flex");
  alert("teste");
});

closeButton.addEventListener("click", function () {
  mobileMenu.classList.remove("flex");
  alert("teste");
});
