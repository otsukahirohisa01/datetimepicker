function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var datetimepicker = function datetimepicker(element) {

  // Constants
  var DAY_OF_WEEKS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Class Definition

  var DateTimePicker = function () {
    function DateTimePicker(element) {
      _classCallCheck(this, DateTimePicker);

      // Private members
      this._element = element;
      this._calendarRootElm = null;
      this._isDisplayed = false;

      // Setup
      this._setListeners();
    }

    // Private Functions


    DateTimePicker.prototype._setListeners = function _setListeners() {
      var _this = this;

      this._element.addEventListener('click', function (e) {
        if (_this._isDisplayed === false) {
          _this._show();
        } else {
          _this._hide();
        }
        e.stopPropagation(); //TODO: Check more
      });

      //TODO: Check more
      document.addEventListener('click', function (e) {
        if (e.currentTarget !== _this._element && _this._isDisplayed) {
          _this._hide();
        }
      });
    };

    DateTimePicker.prototype._show = function _show() {
      this._calendarRootElm = this._getWidgetFragment();
      this._element.appendChild(this._calendarRootElm);
      this._isDisplayed = true;
    };

    DateTimePicker.prototype._hide = function _hide() {
      this._element.removeChild(this._calendarRootElm);
      this._calendarRootElm = null;
      this._isDisplayed = false;
    };

    DateTimePicker.prototype._getWidgetFragment = function _getWidgetFragment() {
      var calendarRootElm = document.createElement('div');
      calendarRootElm.classList.toggle('dropdown-menu');
      calendarRootElm.appendChild(this._getHeaderFragment());
      return calendarRootElm;
    };

    //TODO:


    DateTimePicker.prototype._getHeaderFragment = function _getHeaderFragment() {
      // Select Month header
      var prevTh = document.createElement('th');
      prevTh.appendChild(document.createTextNode("<"));
      var monthTh = document.createElement('th');
      monthTh.appendChild(document.createTextNode("March 2017"));
      var nextTh = document.createElement('th');
      nextTh.appendChild(document.createTextNode(">"));
      var selectMonthTr = document.createElement('tr');
      selectMonthTr.appendChild(prevTh);
      selectMonthTr.appendChild(monthTh);
      selectMonthTr.appendChild(nextTh);
      // Day of weeks header
      var dayOfWeeksTr = document.createElement('tr');
      for (var _iterator = DAY_OF_WEEKS, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var dayOfWeek = _ref;

        var dayOfWeekTh = document.createElement('th');
        dayOfWeekTh.classList.toggle('day-of-weeks');
        dayOfWeekTh.appendChild(document.createTextNode(dayOfWeek));
        dayOfWeeksTr.appendChild(dayOfWeekTh);
      }
      // thead
      var thead = document.createElement('thead');
      thead.appendChild(selectMonthTr);
      thead.appendChild(dayOfWeeksTr);

      // table
      var table = document.createElement('table');
      table.appendChild(thead);

      // header fragment
      var headerFragment = document.createDocumentFragment();
      headerFragment.appendChild(table);
      return headerFragment;
    };

    return DateTimePicker;
  }();

  // Construct object


  new DateTimePicker(element);
};

//# sourceMappingURL=datetimepicker.js.map