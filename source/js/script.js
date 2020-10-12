'use strict';

(function () {

  var body = document.querySelector('body');
  var header = document.querySelector('.header');
  var logo = header.querySelector('.header__logo');
  var openButton = header.querySelector('.header__menu-toggle--open');
  var closeButton = header.querySelector('.header__menu-toggle--close');
  var nav = header.querySelector('.header__main-nav');
  var links = nav.querySelectorAll('.main-nav__link');

  // Закрываем меню

  var closeMenu = function () {
    if (closeButton.classList.contains('header__menu-toggle--active')) {
      body.classList.remove('body-lock');
      closeButton.classList.remove('header__menu-toggle--active');
      openButton.classList.add('header__menu-toggle--active');
      nav.classList.remove('main-nav--opened');
    }
  };

  // Открываем меню

  var openMenu = function () {
    if (openButton.classList.contains('header__menu-toggle--active')) {
      body.classList.add('body-lock');
      openButton.classList.remove('header__menu-toggle--active');
      closeButton.classList.add('header__menu-toggle--active');
      logo.classList.add('logo--menu-opened');
      nav.classList.add('main-nav--opened');
    }
  };

  // Добавляем обработчик собития на ссылку

  var addLinkHandler = function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  };


  /* Меню */

  openButton.classList.remove('header__menu-toggle--no-js');
  openButton.classList.add('header__menu-toggle--active');
  closeButton.classList.remove('header__menu-toggle--no-js');
  logo.classList.remove('logo--no-js');
  nav.classList.remove('main-nav--no-js');

  links.forEach(function (link) {
    addLinkHandler(link);
  });


  if (openButton) {
    openButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      openMenu();
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      closeMenu();
    });
  }

})();
