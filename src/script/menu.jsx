const hamburgerButton = document.querySelector('#hamburgerButton');
const closeButton = document.querySelector('#closeButton');
const mobileMenu = document.querySelector('#mobileMenu');

if (hamburgerButton && mobileMenu) {
  hamburgerButton.addEventListener('click', function () {
    mobileMenu.classList.add('flex');
  });
}

if (closeButton && mobileMenu) {
  closeButton.addEventListener('click', function () {
    mobileMenu.classList.remove('flex');
  });
}
