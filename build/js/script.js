'use strict';

(function () {

  var body = document.querySelector('body');
  var header = document.querySelector('.header');
  var logo = header.querySelector('.header__logo');
  var openButton = header.querySelector('.header__menu-toggle--open');
  var closeButton = header.querySelector('.header__menu-toggle--close');
  var nav = header.querySelector('.header__main-nav');
  var links = nav.querySelectorAll('.main-nav__link');

  var map = document.querySelector('.map');
  var mapContainer = map.querySelector('.map__container');

  var video = document.querySelector('.video__video');
  var videoImage = document.querySelector('.video__image');
  var videoButton = document.querySelector('.video__play-button');

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

  if (logo) {
    logo.classList.remove('logo--no-js');
  }

  if (nav) {
    nav.classList.remove('main-nav--no-js');
  }

  if (links.length !== 0) {
    for (var i = 0; i < links.length; i++) {
      addLinkHandler(links[i]);
    }
  }

  if (openButton) {
    openButton.classList.remove('header__menu-toggle--no-js');
    openButton.classList.add('header__menu-toggle--active');
    openButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      openMenu();
    });
  }

  if (closeButton) {
    closeButton.classList.remove('header__menu-toggle--no-js');
    closeButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      closeMenu();
    });
  }

  // Запускаем видео

  if (video) {
    videoImage.classList.remove('video__image--no-js');
    videoButton.classList.remove('video__play-button--no-js');

    videoButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      playVideo();
    });

    video.addEventListener('playing', function () {
      playVideo();
    });
  }

  // Функция запуска видео

  var playVideo = function () {
    videoImage.classList.add('video__image--js-play');
    videoButton.classList.add('video__play-button--js-play');
    video.play();
  };

  // Подключаем карту

  if (mapContainer) {
    map.classList.remove('map--no-js');

    ymaps.ready(init);
    function init() {
      var myMap = new ymaps.Map('map', {
        center: [59.938635, 30.323118],
        zoom: 16,
        controls: ['smallMapDefaultSet']
      });
    }
  }

})();
