'use strict';

(function () {

  /*!
  * focus-trap 6.1.3
  * @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
  */
  'use strict';

  Object.defineProperty(exports, '__esModule', { value: true });

  var tabbable = require('tabbable');

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var activeFocusDelay;

  var activeFocusTraps = function () {
    var trapQueue = [];
    return {
      activateTrap: function activateTrap(trap) {
        if (trapQueue.length > 0) {
          var activeTrap = trapQueue[trapQueue.length - 1];

          if (activeTrap !== trap) {
            activeTrap.pause();
          }
        }

        var trapIndex = trapQueue.indexOf(trap);

        if (trapIndex === -1) {
          trapQueue.push(trap);
        } else {
          // move this existing trap to the front of the queue
          trapQueue.splice(trapIndex, 1);
          trapQueue.push(trap);
        }
      },
      deactivateTrap: function deactivateTrap(trap) {
        var trapIndex = trapQueue.indexOf(trap);

        if (trapIndex !== -1) {
          trapQueue.splice(trapIndex, 1);
        }

        if (trapQueue.length > 0) {
          trapQueue[trapQueue.length - 1].unpause();
        }
      }
    };
  }();

  function createFocusTrap(element, userOptions) {
    var doc = document;
    var container = typeof element === 'string' ? doc.querySelector(element) : element;

    var config = _objectSpread2({
      returnFocusOnDeactivate: true,
      escapeDeactivates: true,
      delayInitialFocus: true
    }, userOptions);

    var state = {
      firstTabbableNode: null,
      lastTabbableNode: null,
      nodeFocusedBeforeActivation: null,
      mostRecentlyFocusedNode: null,
      active: false,
      paused: false
    };
    var trap = {
      activate: activate,
      deactivate: deactivate,
      pause: pause,
      unpause: unpause
    };
    return trap;

    function activate(activateOptions) {
      if (state.active) return;
      updateTabbableNodes();
      state.active = true;
      state.paused = false;
      state.nodeFocusedBeforeActivation = doc.activeElement;
      var onActivate = activateOptions && activateOptions.onActivate ? activateOptions.onActivate : config.onActivate;

      if (onActivate) {
        onActivate();
      }

      addListeners();
      return trap;
    }

    function deactivate(deactivateOptions) {
      if (!state.active) return;
      clearTimeout(activeFocusDelay);
      removeListeners();
      state.active = false;
      state.paused = false;
      activeFocusTraps.deactivateTrap(trap);
      var onDeactivate = deactivateOptions && deactivateOptions.onDeactivate !== undefined ? deactivateOptions.onDeactivate : config.onDeactivate;

      if (onDeactivate) {
        onDeactivate();
      }

      var returnFocus = deactivateOptions && deactivateOptions.returnFocus !== undefined ? deactivateOptions.returnFocus : config.returnFocusOnDeactivate;

      if (returnFocus) {
        delay(function () {
          tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
        });
      }

      return trap;
    }

    function pause() {
      if (state.paused || !state.active) return;
      state.paused = true;
      removeListeners();
    }

    function unpause() {
      if (!state.paused || !state.active) return;
      state.paused = false;
      updateTabbableNodes();
      addListeners();
    }

    function addListeners() {
      if (!state.active) return; // There can be only one listening focus trap at a time

      activeFocusTraps.activateTrap(trap); // Delay ensures that the focused element doesn't capture the event
      // that caused the focus trap activation.

      activeFocusDelay = config.delayInitialFocus ? delay(function () {
        tryFocus(getInitialFocusNode());
      }) : tryFocus(getInitialFocusNode());
      doc.addEventListener('focusin', checkFocusIn, true);
      doc.addEventListener('mousedown', checkPointerDown, {
        capture: true,
        passive: false
      });
      doc.addEventListener('touchstart', checkPointerDown, {
        capture: true,
        passive: false
      });
      doc.addEventListener('click', checkClick, {
        capture: true,
        passive: false
      });
      doc.addEventListener('keydown', checkKey, {
        capture: true,
        passive: false
      });
      return trap;
    }

    function removeListeners() {
      if (!state.active) return;
      doc.removeEventListener('focusin', checkFocusIn, true);
      doc.removeEventListener('mousedown', checkPointerDown, true);
      doc.removeEventListener('touchstart', checkPointerDown, true);
      doc.removeEventListener('click', checkClick, true);
      doc.removeEventListener('keydown', checkKey, true);
      return trap;
    }

    function getNodeForOption(optionName) {
      var optionValue = config[optionName];
      var node = optionValue;

      if (!optionValue) {
        return null;
      }

      if (typeof optionValue === 'string') {
        node = doc.querySelector(optionValue);

        if (!node) {
          throw new Error('`' + optionName + '` refers to no known node');
        }
      }

      if (typeof optionValue === 'function') {
        node = optionValue();

        if (!node) {
          throw new Error('`' + optionName + '` did not return a node');
        }
      }

      return node;
    }

    function getInitialFocusNode() {
      var node;

      if (getNodeForOption('initialFocus') !== null) {
        node = getNodeForOption('initialFocus');
      } else if (container.contains(doc.activeElement)) {
        node = doc.activeElement;
      } else {
        node = state.firstTabbableNode || getNodeForOption('fallbackFocus');
      }

      if (!node) {
        throw new Error('Your focus-trap needs to have at least one focusable element');
      }

      return node;
    }

    function getReturnFocusNode(previousActiveElement) {
      var node = getNodeForOption('setReturnFocus');
      return node ? node : previousActiveElement;
    } // This needs to be done on mousedown and touchstart instead of click
    // so that it precedes the focus event.


    function checkPointerDown(e) {
      if (container.contains(e.target)) {
        // allow the click since it ocurred inside the trap
        return;
      }

      if (config.clickOutsideDeactivates) {
        // immediately deactivate the trap
        deactivate({
          // if, on deactivation, we should return focus to the node originally-focused
          //  when the trap was activated (or the configured `setReturnFocus` node),
          //  then assume it's also OK to return focus to the outside node that was
          //  just clicked, causing deactivation, as long as that node is focusable;
          //  if it isn't focusable, then return focus to the original node focused
          //  on activation (or the configured `setReturnFocus` node)
          // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
          //  which will result in the outside click setting focus to the node
          //  that was clicked, whether it's focusable or not; by setting
          //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
          //  on activation (or the configured `setReturnFocus` node)
          returnFocus: config.returnFocusOnDeactivate && !tabbable.isFocusable(e.target)
        });
        return;
      } // This is needed for mobile devices.
      // (If we'll only let `click` events through,
      // then on mobile they will be blocked anyways if `touchstart` is blocked.)


      if (config.allowOutsideClick && (typeof config.allowOutsideClick === 'boolean' ? config.allowOutsideClick : config.allowOutsideClick(e))) {
        // allow the click outside the trap to take place
        return;
      } // otherwise, prevent the click


      e.preventDefault();
    } // In case focus escapes the trap for some strange reason, pull it back in.


    function checkFocusIn(e) {
      // In Firefox when you Tab out of an iframe the Document is briefly focused.
      if (container.contains(e.target) || e.target instanceof Document) {
        return;
      }

      e.stopImmediatePropagation();
      tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
    }

    function checkKey(e) {
      if (config.escapeDeactivates !== false && isEscapeEvent(e)) {
        e.preventDefault();
        deactivate();
        return;
      }

      if (isTabEvent(e)) {
        checkTab(e);
        return;
      }
    } // Hijack Tab events on the first and last focusable nodes of the trap,
    // in order to prevent focus from escaping. If it escapes for even a
    // moment it can end up scrolling the page and causing confusion so we
    // kind of need to capture the action at the keydown phase.


    function checkTab(e) {
      updateTabbableNodes();

      if (e.shiftKey && e.target === state.firstTabbableNode) {
        e.preventDefault();
        tryFocus(state.lastTabbableNode);
        return;
      }

      if (!e.shiftKey && e.target === state.lastTabbableNode) {
        e.preventDefault();
        tryFocus(state.firstTabbableNode);
        return;
      }
    }

    function checkClick(e) {
      if (config.clickOutsideDeactivates) return;
      if (container.contains(e.target)) return;

      if (config.allowOutsideClick && (typeof config.allowOutsideClick === 'boolean' ? config.allowOutsideClick : config.allowOutsideClick(e))) {
        return;
      }

      e.preventDefault();
      e.stopImmediatePropagation();
    }

    function updateTabbableNodes() {
      var tabbableNodes = tabbable.tabbable(container);
      state.firstTabbableNode = tabbableNodes[0] || getInitialFocusNode();
      state.lastTabbableNode = tabbableNodes[tabbableNodes.length - 1] || getInitialFocusNode();
    }

    function tryFocus(node) {
      if (node === doc.activeElement) return;

      if (!node || !node.focus) {
        tryFocus(getInitialFocusNode());
        return;
      }

      node.focus({
        preventScroll: !!config.preventScroll
      });
      state.mostRecentlyFocusedNode = node;

      if (isSelectableInput(node)) {
        node.select();
      }
    }
  }

  function isSelectableInput(node) {
    return node.tagName && node.tagName.toLowerCase() === 'input' && typeof node.select === 'function';
  }

  function isEscapeEvent(e) {
    return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
  }

  function isTabEvent(e) {
    return e.key === 'Tab' || e.keyCode === 9;
  }

  function delay(fn) {
    return setTimeout(fn, 0);
  }

  window.createFocusTrap = createFocusTrap;

})();
