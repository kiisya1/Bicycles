'use strict';

(function () {

  var header = document.querySelector('.header');
  var logo = header.querySelector('.header__logo');
  var openButton = header.querySelector('.header__menu-toggle--open');
  var closeButton = header.querySelector('.header__menu-toggle--close');
  var nav = header.querySelector('.header__main-nav');

  /* Меню */

  openButton.classList.remove('header__menu-toggle--no-js');
  openButton.classList.add('header__menu-toggle--active');
  closeButton.classList.remove('header__menu-toggle--no-js');
  logo.classList.remove('logo--no-js');
  nav.classList.remove('main-nav--no-js');


  if (openButton) {
    openButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      if (openButton.classList.contains('header__menu-toggle--active')) {
        openButton.classList.remove('header__menu-toggle--active');
        closeButton.classList.add('header__menu-toggle--active');
        logo.classList.add('logo--menu-opened');
        nav.classList.add('main-nav--opened');
      }
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      if (closeButton.classList.contains('header__menu-toggle--active')) {
        closeButton.classList.remove('header__menu-toggle--active');
        openButton.classList.add('header__menu-toggle--active');
        nav.classList.remove('main-nav--opened');
      }
    });
  }

})();
