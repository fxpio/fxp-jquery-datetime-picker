var FxpDatetimePicker = (function (exports, $$1, moment) {
  'use strict';

  $$1 = $$1 && $$1.hasOwnProperty('default') ? $$1['default'] : $$1;
  moment = moment && moment.hasOwnProperty('default') ? moment['default'] : moment;

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

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

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function set(target, property, value, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.set) {
      set = Reflect.set;
    } else {
      set = function set(target, property, value, receiver) {
        var base = _superPropBase(target, property);

        var desc;

        if (base) {
          desc = Object.getOwnPropertyDescriptor(base, property);

          if (desc.set) {
            desc.set.call(receiver, value);
            return true;
          } else if (!desc.writable) {
            return false;
          }
        }

        desc = Object.getOwnPropertyDescriptor(receiver, property);

        if (desc) {
          if (!desc.writable) {
            return false;
          }

          desc.value = value;
          Object.defineProperty(receiver, property, desc);
        } else {
          _defineProperty(receiver, property, value);
        }

        return true;
      };
    }

    return set(target, property, value, receiver);
  }

  function _set(target, property, value, receiver, isStrict) {
    var s = set(target, property, value, receiver || target);

    if (!s && isStrict) {
      throw new Error('failed to set property');
    }

    return value;
  }

  /**
   * Define the class as Jquery plugin.
   *
   * @param {String}      pluginName  The name of jquery plugin defined in $.fn
   * @param {String}      dataName    The key name of jquery data
   * @param {function}    ClassName   The class name
   * @param {boolean}     [shorthand] Check if the shorthand of jquery plugin must be added
   * @param {String|null} dataApiAttr The DOM data attribute selector name to init the jquery plugin with Data API, NULL to disable
   * @param {String}      removeName  The method name to remove the plugin data
   */

  function pluginify (pluginName, dataName, ClassName) {
    var shorthand = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var dataApiAttr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var removeName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'destroy';
    var old = $$1.fn[pluginName];

    $$1.fn[pluginName] = function () {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var resFunc, resList;
      resList = this.each(function (i, element) {
        var $this = $$1(element),
            data = $this.data(dataName);

        if (!data) {
          data = new ClassName(element, _typeof(options) === 'object' ? options : {});
          $this.data(dataName, data);
        }

        if (typeof options === 'string' && data) {
          if (data[options]) {
            resFunc = data[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          } else if (data.constructor[options]) {
            resFunc = data.constructor[options].apply(data, args);
            resFunc = resFunc !== data ? resFunc : undefined;
          }

          if (options === removeName) {
            $this.removeData(dataName);
          }
        }
      });
      return 1 === resList.length && undefined !== resFunc ? resFunc : resList;
    };

    $$1.fn[pluginName].Constructor = ClassName; // Shorthand

    if (shorthand) {
      $$1[pluginName] = function (options) {
        return $$1({})[pluginName](options);
      };
    } // No conflict


    $$1.fn[pluginName].noConflict = function () {
      return $$1.fn[pluginName] = old;
    }; // Data API


    if (null !== dataApiAttr) {
      $$1(window).on('load', function () {
        $$1(dataApiAttr).each(function () {
          var $this = $$1(this);
          $$1.fn[pluginName].call($this, $this.data());
        });
      });
    }
  }

  var DEFAULT_OPTIONS = {};
  /**
   * Base class for plugin.
   */

  var BasePlugin =
  /*#__PURE__*/
  function () {
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function BasePlugin(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, BasePlugin);

      this.guid = $$1.guid;
      this.options = $$1.extend(true, {}, this.constructor.defaultOptions, options);
      this.$element = $$1(element);
    }
    /**
     * Destroy the instance.
     */


    _createClass(BasePlugin, [{
      key: "destroy",
      value: function destroy() {
        var self = this;
        Object.keys(self).forEach(function (key) {
          delete self[key];
        });
      }
      /**
       * Set the default options.
       * The new values are merged with the existing values.
       *
       * @param {object} options
       */

    }], [{
      key: "defaultOptions",
      set: function set(options) {
        DEFAULT_OPTIONS[this.name] = $$1.extend(true, {}, DEFAULT_OPTIONS[this.name], options);
      }
      /**
       * Get the default options.
       *
       * @return {object}
       */
      ,
      get: function get() {
        if (undefined === DEFAULT_OPTIONS[this.name]) {
          DEFAULT_OPTIONS[this.name] = {};
        }

        return DEFAULT_OPTIONS[this.name];
      }
    }]);

    return BasePlugin;
  }();

  var LOCALES = {};
  var globalLocale;
  /**
   * Base class for i18n plugin.
   */

  var BaseI18nPlugin =
  /*#__PURE__*/
  function (_BasePlugin) {
    _inherits(BaseI18nPlugin, _BasePlugin);

    function BaseI18nPlugin() {
      _classCallCheck(this, BaseI18nPlugin);

      return _possibleConstructorReturn(this, _getPrototypeOf(BaseI18nPlugin).apply(this, arguments));
    }

    _createClass(BaseI18nPlugin, [{
      key: "locale",

      /**
       * Get the language configuration.
       *
       * @param {string} [locale] The ISO code of language
       *
       * @returns {object} The language configuration
       */
      value: function locale(_locale) {
        return this.constructor.locales[this.getLocale(_locale)];
      }
      /**
       * Get the valid available locale.
       *
       * @param {string} [locale] The ISO code of language
       *
       * @returns {object} The language configuration
       */

    }, {
      key: "getLocale",
      value: function getLocale(locale) {
        locale = locale ? locale : this.options.locale;

        if (this.constructor.locales[locale]) {
          return locale;
        }

        if (!locale) {
          if (undefined === globalLocale) {
            var metaLang = document.querySelector('head > meta[http-equiv="Content-Language"]');
            globalLocale = metaLang && metaLang.content ? metaLang.content : null;
          }

          if (undefined === globalLocale) {
            var lang = document.querySelector('html').lang;
            globalLocale = lang ? lang : null;
          }

          locale = globalLocale;
        }

        if (typeof locale === 'string') {
          locale = locale.toLowerCase().replace('-', '_');

          if (locale.indexOf('_') >= 0 && undefined === this.constructor.locales[locale]) {
            locale = locale.substr(0, locale.indexOf('_'));
          }
        }

        if (undefined === this.constructor.locales[locale]) {
          var localeKeys = Object.keys(this.constructor.locales);
          locale = localeKeys.length > 0 ? localeKeys[0] : 'en';
        }

        this.options.locale = locale;
        return locale;
      }
      /**
       * Get the map of locales.
       * The map consists of the key containing the ISO code of the language
       * and an object containing the translations for each ISO code.
       *
       * Example:
       * {
       *     'en': {
       *         'foo.bar': 'My message'
       *     }
       * }
       *
       * @param {object} translations The translations map defined in a language ISO code key
       */

    }], [{
      key: "locales",
      set: function set$$1(translations) {
        var keys, i, val; // Force the initialisation of i18n options

        this.defaultOptions = {};

        if (_typeof(translations) === 'object') {
          keys = Object.keys(translations);

          for (i = 0; i < keys.length; ++i) {
            val = translations[keys[i]];

            if (_typeof(val) === 'object') {
              if (undefined === LOCALES[this.name]) {
                LOCALES[this.name] = {};
              }

              LOCALES[this.name][keys[i]] = val;
            }
          }
        }
      }
      /**
       * Get the map of locales.
       * The map consists of the key containing the ISO code of the language
       * and an object containing the translations for each ISO code.
       *
       * @returns {object}
       */
      ,
      get: function get$$1() {
        if (undefined === LOCALES[this.name]) {
          LOCALES[this.name] = {};
        }

        return LOCALES[this.name];
      }
      /**
       * @inheritDoc
       */

    }, {
      key: "defaultOptions",
      get: function get$$1() {
        return _get(_getPrototypeOf(BaseI18nPlugin), "defaultOptions", this);
      }
      /**
       * @inheritDoc
       */
      ,
      set: function set$$1(options) {
        if (undefined === options.locale) {
          options.locale = null;
        }

        _set(_getPrototypeOf(BaseI18nPlugin), "defaultOptions", options, this, true);
      }
    }]);

    return BaseI18nPlugin;
  }(BasePlugin);

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */

  /**
   * Get the width of native scrollbar.
   *
   * @returns {Number}
   */
  function getNativeScrollWidth() {
    var sbDiv = document.createElement("div"),
        size;
    sbDiv.style.width = '100px';
    sbDiv.style.height = '100px';
    sbDiv.style.overflow = 'scroll';
    sbDiv.style.position = 'absolute';
    sbDiv.style.top = '-9999px';
    document.body.appendChild(sbDiv);
    size = sbDiv.offsetWidth - sbDiv.clientWidth;
    document.body.removeChild(sbDiv);
    return size;
  }
  /**
   * Check if is a mobile device.
   *
   * @returns {boolean}
   */

  function mobileCheck() {
    return 0 === getNativeScrollWidth();
  }

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */
  /**
   * Binding actions of keyboard.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {DatetimePicker} Event.data The datetime picker instance
   */

  function keyboardAction(event) {
    if (!(event instanceof jQuery.Event)) {
      return;
    }

    var self = event.data;

    if (event.keyCode === 9) {
      // tab
      self.toggle(event);
    } else if (self.isOpen()) {
      // on opened picker
      if (event.keyCode === 27) {
        // escape
        self.close();
      } else if (event.keyCode === 13) {
        // enter
        self.defineValue();
        event.preventDefault();
        event.stopPropagation();
      } else {
        // refresh value
        self.refreshValue();
      }
    } else {
      // on closed picked
      if (event.keyCode === 40) {
        self.open();
      }
    }
  }
  /**
   * Close the sidebar since external action.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {DatetimePicker} Event.data The datetime picker instance
   */

  function closeExternal(event) {
    var self = event.data,
        $target = $$1(event.currentTarget.activeElement);

    if ($target.hasClass(self.options.classOpen) || $$1(event.target).hasClass(self.options.classWrapper) || $$1(event.target).parents('.' + self.options.classWrapper).length > 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    self.close();
  }
  /**
   * Action on input focus move.
   *
   * @param {jQuery.Event|Event} event
   */

  function onInputFocusMove(event) {
    event.data.$element.data('st-inputFocusDragged', true);
  }
  /**
   * Action on input focus event.
   *
   * @param {jQuery.Event|Event} event
   */

  function onInputFocusAction(event) {
    var self = event.data;

    if (undefined === self.$element.data('st-inputFocusDragged')) {
      self.toggle();
    }

    self.$element.removeData('st-inputFocusDragged');
  }
  /**
   * Prevents the default event.
   *
   * @param {jQuery.Event|Event} event
   */

  function blockEvent(event) {
    event.preventDefault();
  }
  /**
   * Prevents the scroll event.
   *
   * @param {jQuery.Event|Event} event
   *
   * @returns {boolean}
   *
   * @typedef {DatetimePicker} Event.data The datetime picker instance
   */

  function preventScroll(event) {
    var self = event.data,
        state = true,
        scrollTop = self.$picker.get(0).scrollTop,
        scrollHeight = self.$picker.get(0).scrollHeight,
        height = self.$picker.height(),
        delta = event.type === 'DOMMouseScroll' ? event.originalEvent.detail * -40 : event.originalEvent.wheelDelta,
        up = delta > 0;

    if (!up && -delta > scrollHeight - height - scrollTop) {
      self.$picker.scrollTop(scrollHeight);
      event.stopPropagation();
      event.preventDefault();
      state = false;
    } else if (up && delta > scrollTop) {
      self.$picker.scrollTop(0);
      event.stopPropagation();
      event.preventDefault();
      state = false;
    }

    return state;
  }
  /**
   * Action on scroll event.
   *
   * @param {DatetimePicker} self  The datetime picker instance
   * @param {string}         type  The timer type (hour, minute, second)
   */

  function selectTimeAction(self, type) {
    $$1('.dtp-body-time-wrapper', self.$picker).removeClass('time-hours-selected').removeClass('time-minutes-selected').removeClass('time-seconds-selected').addClass('time-' + type + 's-selected');
    self.refreshTimePicker();
  }
  /**
   * Action on scroll event.
   *
   * @param {DatetimePicker}     self  The datetime picker instance
   * @param {jQuery.Event|Event} event
   * @param {string}             type  The timer type (hour, minute, second)
   */

  function scrollAction(self, event, type) {
    var delta = event.type === 'DOMMouseScroll' ? event.originalEvent.detail * -40 : event.originalEvent.wheelDelta;

    if (delta > 0) {
      switch (type) {
        case 'hour':
          self.previousHour();
          break;

        case 'minute':
          self.previousMinute();
          break;

        case 'second':
          self.previousSecond();
          break;

        default:
          break;
      }
    } else {
      switch (type) {
        case 'hour':
          self.nextHour();
          break;

        case 'minute':
          self.nextMinute();
          break;

        case 'second':
          self.nextSecond();
          break;

        default:
          break;
      }
    }

    event.stopPropagation();
    event.preventDefault();
  }
  /**
   * Action on scroll event for year picker.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {DatetimePicker} Event.data The datetime picker instance
   */

  function scrollYear(event) {
    scrollAction(event.data, event, 'year');
  }
  /**
   * Action on scroll event for month picker.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {DatetimePicker} Event.data The datetime picker instance
   */

  function scrollMonth(event) {
    scrollAction(event.data, event, 'month');
  }
  /**
   * Action on scroll event for hour picker.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {DatetimePicker} Event.data The datetime picker instance
   */

  function scrollHour(event) {
    scrollAction(event.data, event, 'hour');
  }
  /**
   * Action on scroll event for minute picker.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {DatetimePicker} Event.data The datetime picker instance
   */

  function scrollMinute(event) {
    scrollAction(event.data, event, 'minute');
  }
  /**
   * Action on scroll event for second picker.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {DatetimePicker} Event.data The datetime picker instance
   */

  function scrollSecond(event) {
    scrollAction(event.data, event, 'second');
  }
  /**
   * Action on scroll event for meridiem picker.
   *
   * @param {jQuery.Event|Event} event
   *
   * @typedef {DatetimePicker} Event.data The datetime picker instance
   */

  function scrollMeridiem(event) {
    event.data.toggleMeridiem();
    event.stopPropagation();
    event.preventDefault();
  }

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */

  /*global CSSMatrix*/

  /*global WebKitCSSMatrix*/

  /*global MSCSSMatrix*/

  /**
   * Get the transform matrix of target.
   *
   * @param {jQuery} $target
   *
   * @returns {CSSMatrix|WebKitCSSMatrix|MSCSSMatrix|object}
   */
  function getTransformMatrix($target) {
    var transform = {
      e: 0,
      f: 0
    },
        reMatrix,
        match;

    if ($target.css('transform')) {
      if ('function' === typeof CSSMatrix) {
        transform = new CSSMatrix($target.css('transform'));
      } else if ('function' === typeof WebKitCSSMatrix) {
        transform = new WebKitCSSMatrix($target.css('transform'));
      } else if ('function' === typeof MSCSSMatrix) {
        transform = new MSCSSMatrix($target.css('transform'));
      } else {
        reMatrix = /matrix\(\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/;
        match = $target.css('transform').match(reMatrix);

        if (match) {
          transform.e = parseInt(match[1], 10);
          transform.f = parseInt(match[2], 10);
        }
      }
    }

    return transform;
  }
  /**
   * Get the zindex of element.
   *
   * @param {jQuery} $element The jquery element
   *
   * @return {Number}
   */

  function getZindex($element) {
    var zindex = parseInt($element.css('z-index'), 0);

    if (isNaN(zindex)) {
      zindex = 0;
    }

    return zindex;
  }
  /**
   * Find the parent zindex.
   *
   * @param {jQuery} $element The jquery element
   *
   * @return {Number}
   */

  function findParentZindex($element) {
    var zindex = getZindex($element),
        $parents = $element.parents(),
        value,
        i;

    for (i = 0; i < $parents.length; i += 1) {
      value = parseInt($parents.eq(i).css('z-index'), 0);

      if (!isNaN(value)) {
        zindex = Math.max(zindex, value);
      }
    }

    return zindex;
  }

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */
  /**
   * Get the language configuration of moment.
   *
   * @param {moment} date     The moment instance
   * @param {string} [locale] The ISO code of language
   *
   * @returns {object} The language configuration of moment
   */

  function momentLocaleData(date, locale) {
    var config = date.localeData(locale);

    if (null === config) {
      config = date.localeData();
    }

    return config;
  }

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */
  /**
   * Generate the week days.
   *
   * @param {DatetimePicker} self
   */

  function generateWeekdays(self) {
    var lang = momentLocaleData(moment, self.getLocale()),
        wekkdaysMin = '_weekdaysMin',
        week = '_week',
        days = lang[wekkdaysMin].slice(),
        startDay = momentLocaleData(moment, self.getLocale())[week].dow,
        endDays = days.splice(0, startDay),
        $days = $$1('.dtp-body-header-days', self.$picker),
        i;
    days = days.concat(endDays);
    $days.empty();

    for (i = 0; i < days.length; i += 1) {
      $days.append('<div class="dtp-body-header-day" data-day-id="' + i + '">' + days[i] + '</div>');
    }
  }
  /**
   * Generate the calendar picker.
   *
   * @param {DatetimePicker} self
   * @param {string}         name
   * @param {moment}         date
   *
   * @return jQuery The calendar element
   */

  function generateCalendar(self, name, date) {
    var today, startDay, currentDay, $calendar, $week, number, dayClass, $day, i, j;
    today = moment();
    today.localeData(self.getLocale());
    startDay = date.clone().startOf('month');
    currentDay = startDay.clone();
    $calendar = $$1('<div class="dtp-body-calendar" data-calendar-name="' + name + '"></div>');

    if (1 === currentDay.clone().startOf('week').date()) {
      startDay.add(-7, 'days');
      currentDay.add(-7, 'days');
    }

    currentDay.startOf('week');
    currentDay.hours(date.hours());
    currentDay.minutes(date.minutes());
    currentDay.seconds(date.seconds());

    for (i = 0; i < 6; i += 1) {
      $week = $$1('<div class="dtp-body-calendar-week"></div>');

      for (j = 0; j < 7; j += 1) {
        number = currentDay.date();
        dayClass = 'dtp-body-calendar-day';

        if (currentDay.year() === date.year() && currentDay.month() === date.month()) {
          if (number === date.date()) {
            dayClass += ' dtp-day-selected';
          }

          if (number === today.date() && date.month() === today.month() && date.year() === today.year()) {
            dayClass += ' dtp-day-today';
          }
        } else {
          dayClass += ' dtp-day-out';
        }

        $day = $$1('<div class="' + dayClass + '"><div class="dtp-body-calendar-day-value" data-date-value="' + currentDay.format(self.options.format) + '">' + number + '</div></div>');
        $week.append($day);
        currentDay.add(1, 'days');
      }

      $calendar.append($week);
    }

    return $calendar;
  }
  /**
   * Generate the calendar pickers (current, previous month, next month,
   * previous year and next year).
   *
   * @param {DatetimePicker} self
   * @param {moment}         date
   *
   * @returns {object} The list of calendar
   */

  function generateCalendars(self, date) {
    var $calendars, $calendarCurrent, $calendarPreviousMonth, $calendarNextMonth, $calendarPreviousYear, $calendarNextYear;
    $calendars = $$1('<div class="dtp-body-calendar-all"></div>');
    $calendarCurrent = generateCalendar(self, 'current', date);
    $calendars.append($calendarCurrent);
    $calendarPreviousMonth = generateCalendar(self, 'previous-month', date.clone().add(-1, 'month'));
    $calendarPreviousMonth.css('-webkit-transform', 'translate3d(-100%, 0px, 0px)');
    $calendarPreviousMonth.css('transform', 'translate3d(-100%, 0px, 0px)');
    $calendars.append($calendarPreviousMonth);
    $calendarNextMonth = generateCalendar(self, 'next-month', date.clone().add(1, 'month'));
    $calendarNextMonth.css('-webkit-transform', 'translate3d(100%, 0px, 0px)');
    $calendarNextMonth.css('transform', 'translate3d(100%, 0px, 0px)');
    $calendars.append($calendarNextMonth);
    $calendarPreviousYear = generateCalendar(self, 'previous-year', date.clone().add(-1, 'year'));
    $calendarPreviousYear.css('-webkit-transform', 'translate3d(0px, -100%, 0px)');
    $calendarPreviousYear.css('transform', 'translate3d(0px, -100%, 0px)');
    $calendars.append($calendarPreviousYear);
    $calendarNextYear = generateCalendar(self, 'next-year', date.clone().add(1, 'year'));
    $calendarNextYear.css('-webkit-transform', 'translate3d(0px, 100%, 0px)');
    $calendarNextYear.css('transform', 'translate3d(0px, 100%, 0px)');
    $calendars.append($calendarNextYear);
    return $calendars;
  }

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */
  /**
   * Formats the knob value.
   *
   * @param {number} min           The min value
   * @param {number} max           The max value
   * @param {number} step          The step
   * @param {number} value         The value
   * @param {number} previousValue The previous value
   *
   * @returns {number} The formatted value
   */

  function knobChangeValue(min, max, step, value, previousValue) {
    var maxValue = max + 1,
        maxWithStep = maxValue - step,
        modulo = value % step;
    value -= value % step;

    if (modulo >= step / 2) {
      value += step;
    }

    if (previousValue === maxValue) {
      previousValue = min;
    }

    if (value === maxValue) {
      value = min;
    }

    if (previousValue === maxWithStep && value === min) {
      // next meridiem
      value += maxValue;
    } else if (value === maxWithStep && previousValue === min) {
      // previous meridiem
      value -= maxValue;
    }

    return value;
  }
  /**
   * Generate the timer picker.
   *
   * @param {DatetimePicker} self
   */

  function generateTimer(self) {
    var knobConfig, knobSize, $wrapper, $display, $displayMeridiem, $hours, $minutes, $seconds, knobChangeHour, knobChangeMinute, knobChangeSecond;
    $wrapper = $$1('.dtp-body-time-wrapper', self.$picker);
    $display = $$1('.dtp-body-time-display', $wrapper);
    $displayMeridiem = $$1('.dtp-body-time-display-meridiem', $wrapper);
    $hours = $$1('.dtp-body-time-content-value-hours', $wrapper);
    $minutes = $$1('.dtp-body-time-content-value-minutes', $wrapper);
    $seconds = $$1('.dtp-body-time-content-value-seconds', $wrapper);
    knobSize = $wrapper.innerHeight() - parseInt($wrapper.css('padding-top'), 10) - parseInt($wrapper.css('padding-bottom'), 10);

    if (self.options.withMinutes) {
      $wrapper.addClass('time-has-minutes');
    }

    if (self.options.withSeconds) {
      $wrapper.addClass('time-has-seconds');
    }

    $wrapper.addClass('time-has-meridiem');

    if (!$wrapper.hasClass('time-hours-selected') && !$wrapper.hasClass('time-minutes-selected') && !$wrapper.hasClass('time-seconds-selected')) {
      $wrapper.addClass('time-hours-selected');
    }

    knobConfig = {
      'displayInput': false,
      'displayPrevious': true,
      'cursor': 1,
      'lineCap': 'round',
      'width': knobSize,
      'height': knobSize,
      'thickness': 0.2
    };

    knobChangeHour = function knobChangeHour(value) {
      var opts = self.options;
      value = knobChangeValue(opts.hourMin, opts.hourMax, opts.hourStep, value, parseInt($hours.val(), 10)); // convert to 24h

      if (self.currentDate.hour() >= 12) {
        value += 12;
      }

      self.setHour(value);
    };

    knobChangeMinute = function knobChangeMinute(value) {
      var opts = self.options;
      value = knobChangeValue(opts.minuteMin, opts.minuteMax, opts.minuteStep, value, parseInt($minutes.val(), 10));
      self.setMinute(value);
    };

    knobChangeSecond = function knobChangeSecond(value) {
      var opts = self.options;
      value = knobChangeValue(opts.secondMin, opts.secondMax, opts.secondStep, value, parseInt($seconds.val(), 10));
      self.setSecond(value);
    }; // hours


    $hours.knob($$1.extend(true, knobConfig, {
      'min': self.options.hourMin,
      'max': self.options.hourMax + 1,
      'step': self.options.hourStep,
      'change': function change(value) {
        knobChangeHour(value);
      },
      'release': function release(value) {
        if (!self.onDragKnob) {
          knobChangeHour(value);
        }
      }
    })); // minutes

    $minutes.knob($$1.extend(true, knobConfig, {
      'min': self.options.minuteMin,
      'max': self.options.minuteMax + 1,
      'step': self.options.minuteStep,
      'change': function change(value) {
        knobChangeMinute(value);
      },
      'release': function release(value) {
        if (!self.onDragKnob) {
          knobChangeMinute(value);
        }
      }
    })); // seconds

    $seconds.knob($$1.extend(true, knobConfig, {
      'min': self.options.secondMin,
      'max': self.options.secondMax + 1,
      'step': self.options.secondStep,
      'change': function change(value) {
        knobChangeSecond(value);
      },
      'release': function release(value) {
        if (!self.onDragKnob) {
          knobChangeSecond(value);
        }
      }
    })); // time and meridiem display position

    $display.css('top', 0).css('left', 0);
    $displayMeridiem.css('top', 0).css('left', 0);
  }

  /*
   * This file is part of the Fxp package.
   *
   * (c) François Pluchino <francois.pluchino@gmail.com>
   *
   * For the full copyright and license information, please view the LICENSE
   * file that was distributed with this source code.
   */
  /**
   * Action on drag end transition of calendar picker.
   *
   * @param {Event} event The hammer event
   *
   * @typedef {DatetimePicker} Event.data.self The datetime picker instance
   * @typedef {string}         Event.data.type The calendar type
   */

  function dragEndCalendarTransition(event) {
    var self = event.data.self,
        type = event.data.type,
        $calendarAll = $('.dtp-body-calendar-all', self.$picker);
    $calendarAll.off('transitionend webkitTransitionEnd oTransitionEnd');
    $calendarAll.css('-webkit-transition', 'none');
    $calendarAll.css('transition', 'none');
    $calendarAll.css('-webkit-transform', '');
    $calendarAll.css('transform', '');

    switch (type) {
      case 'nextYear':
        self.nextYear(event);
        break;

      case 'previousYear':
        self.previousYear(event);
        break;

      case 'nextMonth':
        self.nextMonth(event);
        break;

      case 'previousMonth':
        self.previousMonth(event);
        break;

      default:
        break;
    }
  }
  /**
   * Init the calendar hammer instance.
   *
   * @param {DatetimePicker} self The datetime picker instance
   */

  function initCalendarSwipe(self) {
    if (!Hammer) {
      return;
    }

    var hammerCalendar = 'hammerCalendar';
    self[hammerCalendar] = new Hammer($('.dtp-body-calendar-wrapper', self.$picker).get(0));
    self[hammerCalendar].get('pan').set({
      direction: Hammer.DIRECTION_ALL
    });
    self[hammerCalendar].get('swipe').set({
      enable: false
    });
    self[hammerCalendar].on('tap', $.proxy(function (event) {
      var value = $(event.target).attr('data-date-value');

      if (value) {
        this.setDatetime(value.valueOf());
      }
    }, self)).on('panmove', $.proxy(function (event) {
      event.preventDefault();
      var $calendarAll = $('.dtp-body-calendar-all', this.$picker),
          $calendar = $('.dtp-body-calendar[data-calendar-name=current]', $calendarAll),
          width = $calendar.outerWidth(),
          height = $calendar.outerHeight(),
          horizontal = 0,
          vertical = 0;

      if (undefined === this.panMoveDirection) {
        this.panMoveDirection = event.direction;
      }

      switch (this.panMoveDirection) {
        case Hammer.DIRECTION_HORIZONTAL:
        case Hammer.DIRECTION_LEFT:
        case Hammer.DIRECTION_RIGHT:
          horizontal = Math.round(event.deltaX);
          break;

        case Hammer.DIRECTION_VERTICAL:
        case Hammer.DIRECTION_UP:
        case Hammer.DIRECTION_DOWN:
          vertical = Math.round(event.deltaY);
          break;

        default:
          break;
      }

      if (Math.abs(horizontal) > $calendar.outerWidth()) {
        horizontal = horizontal < 0 ? -width : width;
      }

      if (Math.abs(vertical) > $calendar.outerHeight()) {
        vertical = vertical < 0 ? -height : height;
      }

      $calendarAll.css('-webkit-transition', 'none');
      $calendarAll.css('transition', 'none');
      $calendarAll.css('-webkit-transform', 'translate3d(' + horizontal + 'px, ' + vertical + 'px, 0px)');
      $calendarAll.css('transform', 'translate3d(' + horizontal + 'px, ' + vertical + 'px, 0px)');
    }, self)).on('panend', $.proxy(function () {
      var $calendarAll = $('.dtp-body-calendar-all', this.$picker),
          $calendar = $('.dtp-body-calendar[data-calendar-name=current]', $calendarAll),
          transform = getTransformMatrix($calendarAll),
          horizontal = transform.e,
          vertical = transform.f,
          type = null;
      delete this.panMoveDirection;

      if (0 !== horizontal && Math.abs(horizontal) >= Math.min($calendar.outerWidth() / 3, this.options.dragDistance)) {
        if (horizontal < 0) {
          type = 'nextMonth';
          horizontal = -Math.round($calendar.outerWidth());
        } else {
          type = 'previousMonth';
          horizontal = Math.round($calendar.outerWidth());
        }
      } else if (0 !== vertical && Math.abs(vertical) >= Math.min($calendar.outerHeight() / 3, this.options.dragDistance)) {
        if (vertical < 0) {
          type = 'nextYear';
          vertical = -Math.round($calendar.outerHeight());
        } else {
          type = 'previousYear';
          vertical = Math.round($calendar.outerHeight());
        }
      } else {
        $calendarAll.css('-webkit-transition', '');
        $calendarAll.css('transition', '');
        $calendarAll.css('-webkit-transform', '');
        $calendarAll.css('transform', '');
        return;
      }

      $calendarAll.on('transitionend webkitTransitionEnd oTransitionEnd', null, {
        'type': type,
        'self': this
      }, dragEndCalendarTransition);
      $calendarAll.css('-webkit-transition', '');
      $calendarAll.css('transition', '');
      $calendarAll.css('-webkit-transform', 'translate3d(' + horizontal + 'px, ' + vertical + 'px, 0px)');
      $calendarAll.css('transform', 'translate3d(' + horizontal + 'px, ' + vertical + 'px, 0px)');
    }, self));
  }
  /**
   * Destroy the calendar hammer instance.
   *
   * @param {DatetimePicker} self The datetime picker instance
   */

  function destroyCalendarSwipe(self) {
    if (!Hammer) {
      return;
    }

    var hammerCalendar = 'hammerCalendar';
    delete self[hammerCalendar];
  }

  /**
   * DatetimePicker class.
   */

  var DatetimePicker =
  /*#__PURE__*/
  function (_BaseI18nPlugin) {
    _inherits(DatetimePicker, _BaseI18nPlugin);

    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    function DatetimePicker(element) {
      var _this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, DatetimePicker);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DatetimePicker).call(this, element, options));
      _this.eventType = 'click';
      _this.focusEventType = 'click.fxp.datetimepicker';
      _this.currentDate = null;
      _this.$picker = null;
      _this.$mask = null;

      if (mobileCheck()) {
        _this.eventType = 'touchstart';
        _this.focusEventType = 'touchend.fxp.datetimepicker';
      }

      if (null !== _this.options.buttonId) {
        $$1('#' + _this.options.buttonId).on('click' + '.fxp.datetimepicker', $$1.proxy(_this.toggle, _assertThisInitialized(_this)));
      }

      if (_this.options.openFocus) {
        if (mobileCheck()) {
          _this.$element.on('touchmove', null, _assertThisInitialized(_this), onInputFocusMove);
        }

        _this.$element.on(_this.focusEventType, null, _assertThisInitialized(_this), onInputFocusAction);
      }

      _this.$element.on('keyup.fxp.datetimepicker', null, _assertThisInitialized(_this), keyboardAction);

      _this.$element.attr('data-datetime-picker', 'true');

      _this.$element.attr('autocomplete', 'off');

      return _this;
    }
    /**
     * Enables the picker.
     */


    _createClass(DatetimePicker, [{
      key: "enabled",
      value: function enabled() {
        this.$element.attr('disabled', 'disabled');
      }
      /**
       * Disables the picker.
       */

    }, {
      key: "disabled",
      value: function disabled() {
        this.$element.removeAttr('disabled');
      }
      /**
       * Check is the picker is disabled.
       *
       * @returns {boolean}
       */

    }, {
      key: "isDisabled",
      value: function isDisabled() {
        return undefined !== this.$element.attr('disabled');
      }
      /**
       * Check if the picker is opened.
       *
       * @returns {boolean}
       */

    }, {
      key: "isOpen",
      value: function isOpen() {
        return this.$element.hasClass(this.options.classOpen);
      }
      /**
       * Toggle the picker (open or close).
       */

    }, {
      key: "toggle",
      value: function toggle(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (this.isOpen() && (!event || this.$element.get(0) !== event.target)) {
          this.close();
        } else {
          this.open();
        }
      }
      /**
       * Opens the picker.
       */

    }, {
      key: "open",
      value: function open() {
        if (this.isOpen() || this.isDisabled()) {
          return;
        }

        var localeData = this.locale(),
            value,
            tabSelected,
            format,
            zindex; // closes all other pickers

        $$1('[data-datetime-picker=true]').datetimePicker('close');
        tabSelected = this.options.datePicker ? 'date' : 'time';

        if (this.options.datePicker && this.options.timePickerFirst) {
          tabSelected = 'time';
        }

        this.$mask = $$1('<div class="' + this.options.classWrapper + '-mask"></div>');
        this.$picker = $$1(['<div class="' + this.options.classWrapper + '" data-target="' + this.$element.attr('id') + '" data-tab-selected="' + tabSelected + '" data-date-picker="' + this.options.datePicker + '" data-time-picker="' + this.options.timePicker + '">', '<div class="' + this.options.classHeaderPicker + '">', '<span class="' + this.options.classHeaderPicker + '-title"></span>', '<div class="' + this.options.classHeaderPicker + '-tabs">', '<ul class="' + this.options.classHeaderPicker + '-nav-tabs">', '<li data-role="tab" class="' + this.options.classHeaderPicker + '-nav-tab dtp-tab-date">', '<span class="dtp-show-tab">' + localeData.date + '</span>', '</li>', '<li data-role="tab" class="' + this.options.classHeaderPicker + '-nav-tab dtp-tab-time">', '<span class="dtp-show-tab">' + localeData.time + '</span>', '</li>', '</ul>', '</div>', '</div>', '<div class="' + this.options.classBodyPicker + '">', '<div class="dtp-body-date">', '<div class="dtp-body-header">', '<div class="dtp-body-header-choice dtp-choice-month">', '<div class="dtp-body-header-choice-content">', '<span class="dtp-choice-btn dtp-choice-month-btn-prev"></span>', '<div class="dtp-choice-value">', '<select class="dtp-choice-value-select dtp-choice-month-value">', '</select>', '</div>', '<span class="dtp-choice-btn dtp-choice-month-btn-next"></span>', '</div>', '</div>', '<div class="dtp-body-header-choice dtp-choice-year">', '<div class="dtp-body-header-choice-content">', '<span class="dtp-choice-btn dtp-choice-year-btn-prev"></span>', '<div class="dtp-choice-value">', '<select class="dtp-choice-value-select dtp-choice-year-value">', '</select>', '</div>', '<span class="dtp-choice-btn dtp-choice-year-btn-next"></span>', '</div>', '</div>', '</div>', '<div class="dtp-body-header dtp-body-header-days">', '</div>', '<div class="dtp-body-calendar-wrapper">', '</div>', '</div>', '<div class="dtp-body-time">', '<div class="dtp-body-time-wrapper time-has-hours">', '<div class="dtp-body-time-display">', '<span class="dtp-body-time-display-hours"></span>', '<span class="dtp-body-time-display-hours-split">' + localeData.hours + '</span>', '<span class="dtp-body-time-display-minutes"></span>', '<span class="dtp-body-time-display-minutes-split">' + localeData.minutes + '</span>', '<span class="dtp-body-time-display-seconds"></span>', '<span class="dtp-body-time-display-seconds-split">' + localeData.seconds + '</span>', '</div>', '<div class="dtp-body-time-display-meridiem">', '<span class="dtp-body-time-display-meridiem-btn"></span>', '</div>', '<div class="dtp-body-time-content">', '<div class="dtp-body-time-content-hours">', '<input type="text" class="dtp-body-time-content-value-hours">', '</div>', '<div class="dtp-body-time-content-minutes">', '<input type="text" class="dtp-body-time-content-value-minutes">', '</div>', '<div class="dtp-body-time-content-seconds">', '<input type="text" class="dtp-body-time-content-value-seconds">', '</div>', '</div>', '</div>', '</div>', '</div>', '<div class="' + this.options.classFooterPicker + '">', '<span class="' + this.options.classFooterPicker + '-btn dtp-btn-cancel"><span>' + localeData.cancel + '</span></span>', '<span class="' + this.options.classFooterPicker + '-btn dtp-btn-clear"><span>' + localeData.clear + '</span></span>', '<span class="' + this.options.classFooterPicker + '-btn dtp-btn-define"><span>' + localeData.define + '</span></span>', '</div>', '</div>'].join(''));
        $$1('body').append(this.$mask).append(this.$picker);
        value = this.getValue();
        format = this.options.format;
        zindex = Math.max(findParentZindex(this.$element), 0);
        this.$picker.css('z-index', getZindex(this.$picker) + zindex);
        this.$mask.css('z-index', getZindex(this.$mask) + zindex);

        if ('' === value) {
          this.currentDate = moment();
        } else {
          this.currentDate = moment(value, format);
        }

        this.currentDate.localeData(this.getLocale());
        generateWeekdays(this);
        generateTimer(this);
        this.refreshValue();
        this.$element.addClass(this.options.classOpen);
        this.$picker.on('touchmove', blockEvent);
        this.$picker.on('DOMMouseScroll mousewheel', null, this, preventScroll);
        this.$picker.on(this.eventType, 'span.' + this.options.classHeaderPicker + '-title', $$1.proxy(this.setToday, this));
        this.$picker.on(this.eventType, '.dtp-btn-cancel', $$1.proxy(this.cancel, this));
        this.$picker.on(this.eventType, '.dtp-btn-clear', $$1.proxy(this.clearValue, this));
        this.$picker.on(this.eventType, '.dtp-btn-define', $$1.proxy(this.defineValue, this));
        this.$picker.on(this.eventType, '.dtp-tab-date > span.dtp-show-tab', $$1.proxy(this.showDate, this));
        this.$picker.on(this.eventType, '.dtp-tab-time > span.dtp-show-tab', $$1.proxy(this.showTime, this));
        this.$picker.on('change', 'select.dtp-choice-year-value', $$1.proxy(this.setYear, this));
        this.$picker.on(this.eventType, 'span.dtp-choice-year-btn-prev', $$1.proxy(this.previousYear, this));
        this.$picker.on(this.eventType, 'span.dtp-choice-year-btn-next', $$1.proxy(this.nextYear, this));
        this.$picker.on('change', 'select.dtp-choice-month-value', $$1.proxy(this.setMonth, this));
        this.$picker.on(this.eventType, 'span.dtp-choice-month-btn-prev', $$1.proxy(this.previousMonth, this));
        this.$picker.on(this.eventType, 'span.dtp-choice-month-btn-next', $$1.proxy(this.nextMonth, this));
        this.$picker.on(this.eventType, '.dtp-body-calendar-day > a', $$1.proxy(this.setDatetime, this));
        this.$picker.on(this.eventType, '.dtp-body-time-display-hours', $$1.proxy(this.selectHour, this));
        this.$picker.on(this.eventType, '.dtp-body-time-display-minutes', $$1.proxy(this.selectMinute, this));
        this.$picker.on(this.eventType, '.dtp-body-time-display-seconds', $$1.proxy(this.selectSecond, this));
        this.$picker.on(this.eventType, '.dtp-body-time-display-meridiem-btn', $$1.proxy(this.selectMeridiem, this));
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-header-choice.dtp-choice-year', this, scrollYear);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-header-choice.dtp-choice-month', this, scrollMonth);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-calendar-wrapper', this, scrollMonth);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-time-display-hours', this, scrollHour);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-time-display-minutes', this, scrollMinute);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-time-display-seconds', this, scrollSecond);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-time-display-meridiem-btn', this, scrollMeridiem);
        $$1(document).on(this.eventType + '.fxp.datetimepicker' + this.guid, null, this, closeExternal);
        $$1(window).on('resize.fxp.datetimepicker' + this.guid, null, this, $$1.proxy(this.position, this));
        $$1(window).on('keyup.fxp.datetimepicker' + this.guid, null, this, keyboardAction);
        $$1(window).on('scroll.fxp.datetimepicker' + this.guid, null, this, closeExternal);
        initCalendarSwipe(this);
        this.position();

        if (tabSelected === 'time') {
          this.refreshTimePicker(true);
        }

        this.position();
      }
      /**
       * Closes the picker.
       */

    }, {
      key: "close",
      value: function close() {
        if (!this.isOpen() || null === this.$picker) {
          return;
        }

        this.currentDate = null;
        this.$picker.off('touchmove', blockEvent);
        this.$picker.off('DOMMouseScroll mousewheel', preventScroll);
        this.$picker.off(this.eventType, 'span.' + this.options.classHeaderPicker + '-title', $$1.proxy(this.setToday, this));
        this.$picker.off(this.eventType, '.dtp-btn-cancel', $$1.proxy(this.cancel, this));
        this.$picker.off(this.eventType, '.dtp-btn-clear', $$1.proxy(this.clearValue, this));
        this.$picker.off(this.eventType, '.dtp-btn-define', $$1.proxy(this.defineValue, this));
        this.$picker.off(this.eventType, '.dtp-tab-date > span.dtp-show-tab', $$1.proxy(this.showDate, this));
        this.$picker.off(this.eventType, '.dtp-tab-time > span.dtp-show-tab', $$1.proxy(this.showTime, this));
        this.$picker.off('change', 'select.dtp-choice-year-value', $$1.proxy(this.setYear, this));
        this.$picker.off(this.eventType, 'span.dtp-choice-year-btn-prev', $$1.proxy(this.previousYear, this));
        this.$picker.off(this.eventType, 'span.dtp-choice-year-btn-next', $$1.proxy(this.nextYear, this));
        this.$picker.off('change', 'select.dtp-choice-month-value', $$1.proxy(this.setMonth, this));
        this.$picker.off(this.eventType, 'span.dtp-choice-month-btn-prev', $$1.proxy(this.previousMonth, this));
        this.$picker.off(this.eventType, 'span.dtp-choice-month-btn-next', $$1.proxy(this.nextMonth, this));
        this.$picker.off(this.eventType, '.dtp-body-calendar-day > a', $$1.proxy(this.setDatetime, this));
        this.$picker.off(this.eventType, '.dtp-body-time-display-hours', $$1.proxy(this.selectHour, this));
        this.$picker.off(this.eventType, '.dtp-body-time-display-minutes', $$1.proxy(this.selectMinute, this));
        this.$picker.off(this.eventType, '.dtp-body-time-display-seconds', $$1.proxy(this.selectSecond, this));
        this.$picker.off(this.eventType, '.dtp-body-time-display-meridiem-btn', $$1.proxy(this.selectMeridiem, this));
        this.$picker.off('DOMMouseScroll mousewheel', '.dtp-body-header-choice.dtp-choice-year', scrollYear);
        this.$picker.off('DOMMouseScroll mousewheel', '.dtp-body-header-choice.dtp-choice-month', scrollMonth);
        this.$picker.off('DOMMouseScroll mousewheel', '.dtp-body-calendar-wrapper', scrollMonth);
        this.$picker.off('DOMMouseScroll mousewheel', '.dtp-body-time-display-hours', scrollHour);
        this.$picker.off('DOMMouseScroll mousewheel', '.dtp-body-time-display-minutes', scrollMinute);
        this.$picker.off('DOMMouseScroll mousewheel', '.dtp-body-time-display-seconds', scrollSecond);
        this.$picker.off('DOMMouseScroll mousewheel', '.dtp-body-time-display-meridiem-btn', scrollMeridiem);
        this.$picker.remove();
        this.$mask.remove();
        this.$picker = null;
        this.$mask = null;
        destroyCalendarSwipe(this);
        this.$element.removeClass(this.options.classOpen);
        $$1(document).off(this.eventType + '.fxp.datetimepicker' + this.guid, closeExternal);
        $$1(window).off('resize.fxp.datetimepicker' + this.guid, $$1.proxy(this.position, this));
        $$1(window).off('keyup.fxp.datetimepicker' + this.guid, keyboardAction);
        $$1(window).off('scroll.fxp.datetimepicker' + this.guid, closeExternal);
      }
      /**
       * Refreshs the picker position.
       */

    }, {
      key: "position",
      value: function position() {
        if (null === this.$picker) {
          return;
        }

        var top = this.$element.offset().top + this.$element.outerHeight(),
            $window = $$1(window).eq(0),
            wTop = $window.scrollTop();
        this.$picker.css('left', this.$element.offset().left);

        if (this.$picker.outerHeight() + top - wTop > $window.height()) {
          top = this.$element.offset().top - this.$picker.outerHeight();
        }

        if (top - wTop < 0) {
          top = this.$element.offset().top + this.$element.outerHeight();

          if (top + this.$picker.outerHeight() > $$1(window).height()) {
            top += $$1(window).height() - (top + this.$picker.outerHeight() - wTop);
          }
        }

        this.$picker.css('top', top);
      }
      /**
       * Set value.
       *
       * @param {string|moment} date The full datetime value formatted with the default
       *                             option format.
       */

    }, {
      key: "setValue",
      value: function setValue(date) {
        if (typeof date === 'string') {
          /* @type {moment} */
          date = moment(date, this.options.format);
          date.localeData(this.getLocale());
        }

        if (null !== date) {
          date = date.format(this.options.format);
        }

        this.$element.val(date);
        this.$element.trigger('change');
      }
      /**
       * Get value.
       *
       * @returns {string} The full datetime value formatted with the default option
       *                   format.
       */

    }, {
      key: "getValue",
      value: function getValue() {
        return this.$element.val();
      }
      /**
       * Refresh the temporary value defined in picker (note element).
       */

    }, {
      key: "refreshValue",
      value: function refreshValue() {
        if (null === this.currentDate) {
          return;
        }

        var value = this.getValue(),
            format = this.options.format;

        if ('' === value) {
          this.currentDate = moment();
        } else {
          this.currentDate = moment(value, format);
        }

        this.currentDate.localeData(this.getLocale());
        this.refreshPicker();
      }
      /**
       * Refreshs the date and time picker blocks with the value defined in the
       * element.
       */

    }, {
      key: "refreshPicker",
      value: function refreshPicker() {
        this.refreshDatePicker();
        this.refreshTimePicker();
      }
      /**
       * Refreshs the date picker blocks with the value defined in the element.
       */

    }, {
      key: "refreshDatePicker",
      value: function refreshDatePicker() {
        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        var $header = this.$picker.children('.' + this.options.classHeaderPicker).eq(0),
            $title = $header.children('.' + this.options.classHeaderPicker + '-title').eq(0),
            $body = this.$picker.children('.' + this.options.classBodyPicker).eq(0),
            $months,
            monthList,
            monthsShort = '_monthsShort',
            selectedMonth,
            selectedYear,
            $years,
            startYear,
            endYear,
            $calendarWrapper,
            i,
            j; // title

        $title.text(this.currentDate.format(this.options.format)); // months list

        $months = $$1('.dtp-choice-month-value', $body);
        monthList = moment.localeData()[monthsShort];
        $months.empty();

        for (i = 0; i < monthList.length; i += 1) {
          selectedMonth = i === this.currentDate.month() ? ' selected="selected"' : '';
          $months.append('<option value="' + i + '"' + selectedMonth + '>' + monthList[i] + '</option>');
        } // years list


        $years = $$1('.dtp-choice-year-value', $body);
        startYear = this.currentDate.clone();
        endYear = this.currentDate.clone();
        $years.empty();
        startYear = startYear.add(-10, 'year').year();
        endYear = endYear.add(10, 'year').year();

        for (j = startYear; j <= endYear; j += 1) {
          selectedYear = j === this.currentDate.year() ? ' selected="selected"' : '';
          $years.append('<option value="' + j + '"' + selectedYear + '>' + j + '</option>');
        } // calendar


        $calendarWrapper = $$1('.dtp-body-calendar-wrapper', $body);
        $calendarWrapper.empty();
        $calendarWrapper.append(generateCalendars(this, this.currentDate));
      }
      /**
       * Refreshs the time picker blocks with the value defined in the element.
       *
       * @typedef {boolean} DatetimePicker.onDragKnob Check if the time picker is in drag action
       *
       * @param {Boolean} [force] Force the refresh of time
       */

    }, {
      key: "refreshTimePicker",
      value: function refreshTimePicker(force) {
        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        var colorRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
            format = this.options.format,
            hourFormat = format.indexOf('HH') >= 0 ? 'HH' : 'H',
            minuteFormat = format.indexOf('mm') >= 0 ? 'mm' : 'm',
            secondFormat = format.indexOf('ss') >= 0 ? 'ss' : 's',
            $header = this.$picker.children('.' + this.options.classHeaderPicker).eq(0),
            $title = $header.children('.' + this.options.classHeaderPicker + '-title').eq(0),
            $wrapper = $$1('.dtp-body-time-wrapper', this.$picker),
            $display = $$1('.dtp-body-time-display', $wrapper),
            $displayHours = $$1('.dtp-body-time-display-hours', $display),
            $displayMinutes = $$1('.dtp-body-time-display-minutes', $display),
            $displaySeconds = $$1('.dtp-body-time-display-seconds', $display),
            $displayMeridiem = $$1('.dtp-body-time-display-meridiem-btn', $wrapper),
            $contentHours = $$1('.dtp-body-time-content-value-hours', $wrapper),
            $contentMinutes = $$1('.dtp-body-time-content-value-minutes', $wrapper),
            $contentSeconds = $$1('.dtp-body-time-content-value-seconds', $wrapper),
            $pickerHeader,
            centerPositionTop,
            centerPositionLeft,
            bg,
            hex = function hex(x) {
          return ("0" + parseInt(x, 10).toString(16)).slice(-2);
        };

        hourFormat = format.indexOf('hh') >= 0 ? 'hh' : hourFormat;
        hourFormat = format.indexOf('h') >= 0 ? 'h' : hourFormat;
        $title.text(this.currentDate.format(this.options.format));
        $displayHours.text(this.currentDate.format(hourFormat));
        $displayMinutes.text(this.currentDate.format(minuteFormat));
        $displaySeconds.text(this.currentDate.format(secondFormat));
        $displayMeridiem.text(moment.localeData().meridiem(this.currentDate.hour(), this.currentDate.minute(), false));
        $contentHours.val(this.currentDate.hour() % 12);
        $contentMinutes.val(this.currentDate.minute());
        $contentSeconds.val(this.currentDate.second());
        this.onDragKnob = true;
        $contentHours.trigger('change');
        $contentMinutes.trigger('change');
        $contentSeconds.trigger('change');
        delete this.onDragKnob;

        if ($wrapper.hasClass('time-hours-selected')) {
          bg = $displayHours.css('background-color').match(colorRegex);
          $contentHours.trigger('configure', {
            "fgColor": "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3])
          });
        }

        if ($wrapper.hasClass('time-minutes-selected')) {
          bg = $displayMinutes.css('background-color').match(colorRegex);
          $contentMinutes.trigger('configure', {
            "fgColor": "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3])
          });
        }

        if ($wrapper.hasClass('time-seconds-selected')) {
          bg = $displaySeconds.css('background-color').match(colorRegex);
          $contentSeconds.trigger('configure', {
            "fgColor": "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3])
          });
        } // time and meridiem display position


        if (force || parseInt($display.css('top'), 10) === 0 && $wrapper.outerWidth() > 0) {
          $pickerHeader = $$1('.datetime-picker-header', this.$picker);
          centerPositionTop = Math.round($pickerHeader.outerHeight() + $wrapper.outerHeight() / 2);
          centerPositionLeft = Math.round($wrapper.outerWidth() / 2);
          $display.css('top', Math.round(centerPositionTop - $display.outerHeight() / 2)).css('left', Math.round(centerPositionLeft - $display.outerWidth() / 2));
          $displayMeridiem.parent().css('top', Math.round(centerPositionTop + $display.outerHeight() - $displayMeridiem.outerHeight() / 2)).css('left', Math.round(centerPositionLeft - $displayMeridiem.outerWidth() / 2));
        }
      }
      /**
       * Close the picker without changes the value of the element.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "cancel",
      value: function cancel(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        this.close();
      }
      /**
       * Removes value of the element.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "clearValue",
      value: function clearValue(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        this.setValue(null);
        this.close();
      }
      /**
       * Close the picker with changes the value of the element.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "defineValue",
      value: function defineValue(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (null === this.currentDate || null === this.$picker || !this.currentDate.isValid()) {
          return;
        }

        this.setValue(this.currentDate);
        this.close();
      }
      /**
       * Show the date picker tab.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "showDate",
      value: function showDate(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!this.options.datePicker || null === this.currentDate || null === this.$picker || 'date' === this.$picker.attr('data-tab-selected')) {
          return;
        }

        this.$picker.attr('data-tab-selected', 'date');
        this.refreshDatePicker();
        this.position();
      }
      /**
       * Show the time picker tab.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "showTime",
      value: function showTime(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!this.options.timePicker || null === this.$picker || 'time' === this.$picker.attr('data-tab-selected')) {
          return;
        }

        this.$picker.attr('data-tab-selected', 'time');
        this.refreshTimePicker(true);
        this.position();
      }
      /**
       * Select the hour in the time picker tab.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "selectHour",
      value: function selectHour(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!this.options.timePicker || null === this.$picker || 'time' !== this.$picker.attr('data-tab-selected')) {
          return;
        }

        if ($$1('.dtp-body-time-wrapper', this.$picker).hasClass('time-hours-selected')) {
          this.toggleMeridiem();
        } else {
          selectTimeAction(this, 'hour');
        }
      }
      /**
       * Select the minute in the time picker tab.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "selectMinute",
      value: function selectMinute(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!this.options.timePicker || null === this.$picker || 'time' !== this.$picker.attr('data-tab-selected')) {
          return;
        }

        selectTimeAction(this, 'minute');
      }
      /**
       * Select the second in the time picker tab.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "selectSecond",
      value: function selectSecond(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!this.options.timePicker || null === this.$picker || 'time' !== this.$picker.attr('data-tab-selected')) {
          return;
        }

        selectTimeAction(this, 'second');
      }
      /**
       * Select the meridiem in the time picker tab.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "selectMeridiem",
      value: function selectMeridiem(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!this.options.timePicker || null === this.$picker || 'time' !== this.$picker.attr('data-tab-selected')) {
          return;
        }

        this.toggleMeridiem();
      }
      /**
       * Set the full datetime value in temporary picker value.
       *
       * @param {string|jQuery.Event|Event} datetime The full datetime value formatted with the default
       *                                             option format.
       */

    }, {
      key: "setDatetime",
      value: function setDatetime(datetime) {
        if (datetime instanceof jQuery.Event) {
          datetime.preventDefault();
          datetime.stopPropagation();
          datetime = $$1(datetime.target).attr('data-date-value');
        }

        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        if (typeof datetime === 'string') {
          datetime = moment(datetime, this.options.format);
        }

        this.currentDate = datetime;
        this.currentDate.localeData(this.getLocale());
        this.refreshPicker();
      }
      /**
       * Set the full today datetime value in temporary picker value.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "setToday",
      value: function setToday(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        this.setDatetime(moment());
      }
      /**
       * Set the year in temporary picker value.
       *
       * @param {number|jQuery.Event|Event} year
       */

    }, {
      key: "setYear",
      value: function setYear(year) {
        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        if (year instanceof jQuery.Event) {
          year = $$1(year.target).val();
        }

        this.currentDate.year(year);
        this.refreshDatePicker();
      }
      /**
       * Set the previous year in temporary picker value.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "previousYear",
      value: function previousYear(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.add(-1, 'year');
        this.refreshDatePicker();
      }
      /**
       * Set the next year in temporary picker value.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "nextYear",
      value: function nextYear(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.add(1, 'year');
        this.refreshDatePicker();
      }
      /**
       * Set the month in temporary picker value.
       *
       * @param {number|jQuery.Event|Event} month
       */

    }, {
      key: "setMonth",
      value: function setMonth(month) {
        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        if (month instanceof jQuery.Event) {
          month = $$1(month.target).val();
        }

        this.currentDate.month(parseInt(month, 10));
        this.refreshDatePicker();
      }
      /**
       * Set the previous month in temporary picker value.
       *
       * @param {jQuery.Event|Event} event
       */

    }, {
      key: "previousMonth",
      value: function previousMonth(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.add(-1, 'month');
        this.refreshDatePicker();
      }
      /**
       * Set the next month in temporary picker value.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "nextMonth",
      value: function nextMonth(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.add(1, 'month');
        this.refreshDatePicker();
      }
      /**
       * Set the hour in temporary picker value.
       *
       * @param {number} hour
       */

    }, {
      key: "setHour",
      value: function setHour(hour) {
        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.hour(hour);
        this.refreshTimePicker();
      }
      /**
       * Set the previous hour in temporary picker value.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "previousHour",
      value: function previousHour(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.add(-this.options.hourStep, 'hour');
        this.refreshTimePicker();
      }
      /**
       * Set the next hour in temporary picker value.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "nextHour",
      value: function nextHour(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.add(this.options.hourStep, 'hour');
        this.refreshTimePicker();
      }
      /**
       * Set the minute in temporary picker value.
       *
       * @param {number} minute
       */

    }, {
      key: "setMinute",
      value: function setMinute(minute) {
        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.minute(minute);
        this.refreshTimePicker();
      }
      /**
       * Set the previous minute in temporary picker value.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "previousMinute",
      value: function previousMinute(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!this.options.withMinutes || null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.add(-this.options.minuteStep, 'minute');
        this.refreshTimePicker();
      }
      /**
       * Set the next minute in temporary picker value.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "nextMinute",
      value: function nextMinute(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!this.options.withMinutes || null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.add(this.options.minuteStep, 'minute');
        this.refreshTimePicker();
      }
      /**
       * Set the second in temporary picker value.
       *
       * @param {number} second
       */

    }, {
      key: "setSecond",
      value: function setSecond(second) {
        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.second(second);
        this.refreshTimePicker();
      }
      /**
       * Set the previous second in temporary picker value.
       *
       * @param  {jQuery.Event} [event]
       */

    }, {
      key: "previousSecond",
      value: function previousSecond(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!this.options.withSeconds || null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.add(-this.options.secondStep, 'second');
        this.refreshTimePicker();
      }
      /**
       * Set the next second in temporary picker value.
       *
       * @param {jQuery.Event|Event} [event]
       */

    }, {
      key: "nextSecond",
      value: function nextSecond(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!this.options.withSeconds || null === this.currentDate || null === this.$picker) {
          return;
        }

        this.currentDate.add(this.options.secondStep, 'second');
        this.refreshTimePicker();
      }
      /**
       * Set the meridiem in temporary picker value.
       *
       * @param {string} meridiem The meridiem am/pm
       */

    }, {
      key: "setMeridiem",
      value: function setMeridiem(meridiem) {
        if (null === this.currentDate || null === this.$picker) {
          return;
        }

        meridiem = meridiem.toLowerCase();

        if (this.currentDate.hours() >= 12 && 'am' === meridiem) {
          this.currentDate.add(-12, 'hour');
        } else if (this.currentDate.hours() < 12 && 'pm' === meridiem) {
          this.currentDate.add(12, 'hour');
        } else {
          return;
        }

        this.refreshTimePicker();
      }
      /**
       * Toggles the meridiem in temporary picker value.
       */

    }, {
      key: "toggleMeridiem",
      value: function toggleMeridiem() {
        if (null === this.currentDate) {
          return;
        }

        if (this.currentDate.hours() >= 12) {
          this.setMeridiem('am');
        } else {
          this.setMeridiem('pm');
        }
      }
      /**
       * Destroy the instance.
       */

    }, {
      key: "destroy",
      value: function destroy() {
        this.close();

        if (null !== this.options.buttonId) {
          $$1('#' + this.options.buttonId).off('click' + '.fxp.datetimepicker', $$1.proxy(this.toggle, this));
        }

        if (this.options.openFocus) {
          if (mobileCheck()) {
            this.$element.off('touchmove', onInputFocusMove);
          }

          this.$element.off(this.focusEventType, onInputFocusAction);
        }

        _get(_getPrototypeOf(DatetimePicker.prototype), "destroy", this).call(this);
      }
    }]);

    return DatetimePicker;
  }(BaseI18nPlugin);
  DatetimePicker.defaultOptions = {
    classWrapper: 'datetime-picker-wrapper',
    classOpen: 'datetime-picker-open',
    classHeaderPicker: 'datetime-picker-header',
    classBodyPicker: 'datetime-picker-body',
    classFooterPicker: 'datetime-picker-footer',
    classDatePicker: 'datetime-picker-date',
    classTimePicker: 'datetime-picker-time',
    format: '',
    datePicker: true,
    timePicker: true,
    timePickerFirst: false,
    withMinutes: true,
    withSeconds: false,
    buttonId: null,
    openFocus: true,
    dragDistance: 70,
    inertiaVelocity: 0.07,
    hourMin: 0,
    hourMax: 11,
    hourStep: 1,
    minuteMin: 0,
    minuteMax: 59,
    minuteStep: 1,
    secondMin: 0,
    secondMax: 59,
    secondStep: 1
  };
  /**
   * Default locale.
   */

  DatetimePicker.locales = {
    en: {
      date: 'Date',
      time: 'Time',
      hours: 'h',
      minutes: 'm',
      seconds: 's',
      cancel: 'Cancel',
      clear: 'Clear',
      define: 'Define'
    }
  };
  pluginify('datetimePicker', 'fxp.datetimepicker', DatetimePicker, true, '[data-datetime-picker="true"]');

  exports.default = DatetimePicker;

  return exports;

}({}, jQuery, moment));
