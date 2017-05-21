function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var datetimepicker = function datetimepicker(element) {

  // Constants
  var DAY_OF_WEEKS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DATE = Symbol(); // KEY to bind Date object to date element

  // Class Definition

  var DateTimePicker = function () {
    function DateTimePicker(element) {
      _classCallCheck(this, DateTimePicker);

      // Private members
      this._element = element;
      this._calendarRootElm = null;
      this._calendarTimeSelectorRootElm = null;
      this._isDisplayed = false;
      this._selectedDate = new Date();
      this._locale = "en-US";
      // Setup
      this._setListeners();
    }

    // Private Functions


    DateTimePicker.prototype._setListeners = function _setListeners() {
      var _this = this;

      this._element.addEventListener('click', function (e) {
        console.log("element clicked");
        if (_this._isDisplayed === false) {
          console.log("will call show");
          _this._show();
        } else {
          console.log("will call hide");
          _this._hide();
        }
        e.stopPropagation(); //TODO: Check more
      });

      //TODO: Check more
      document.addEventListener('click', function (e) {
        console.log("document clicked");
        if (e.currentTarget !== _this._element && _this._isDisplayed) {
          console.log("will call hide");
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

    DateTimePicker.prototype._update = function _update() {
      this._element.removeChild(this._calendarRootElm);
      this._calendarRootElm = this._getWidgetFragment();
      this._element.appendChild(this._calendarRootElm);
    };

    DateTimePicker.prototype._showTimeSelector = function _showTimeSelector() {
      this._element.removeChild(this._calendarRootElm);
      this._calendarRootElm = this._getTimeSelectorView();
      this._element.appendChild(this._calendarRootElm);
    };

    // top level of calendar view


    DateTimePicker.prototype._getWidgetFragment = function _getWidgetFragment() {
      var calendarRootElm = document.createElement('div');
      calendarRootElm.classList.toggle('dropdown-menu');
      calendarRootElm.appendChild(this._getMonthSelectorElm());
      var table = document.createElement('table');
      table.classList.toggle('calendar-table');
      table.appendChild(this._getCalenderHeaderElm());
      table.appendChild(this._getCalendarBodyElm());
      calendarRootElm.appendChild(table);
      calendarRootElm.appendChild(this._getTimeSelectButton());
      return calendarRootElm;
    };

    //TODO:


    DateTimePicker.prototype._getCalenderHeaderElm = function _getCalenderHeaderElm() {
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
      thead.appendChild(dayOfWeeksTr);

      // header fragment
      var headerFragment = document.createDocumentFragment();
      headerFragment.appendChild(thead);
      return headerFragment;
    };

    DateTimePicker.prototype._getMonthSelectorElm = function _getMonthSelectorElm() {
      var _this2 = this;

      // Previous month
      var prev = document.createElement('span');
      prev.classList.toggle('prev');
      prev.addEventListener('click', function (e) {
        _this2._selectedDate = new Date(_this2._selectedDate.getFullYear(), _this2._selectedDate.getMonth() - 1, _this2._selectedDate.getDate());
        _this2._update();
        e.stopPropagation();
      });
      prev.appendChild(document.createTextNode("<"));

      // This month
      var month = document.createElement('span');
      month.classList.toggle('month');
      month.appendChild(document.createTextNode(new Intl.DateTimeFormat(this._locale, { month: 'long', year: 'numeric' }).format(this._selectedDate)));

      // Next month
      var next = document.createElement('span');
      next.classList.toggle('next');
      next.addEventListener('click', function (e) {
        _this2._selectedDate = new Date(_this2._selectedDate.getFullYear(), _this2._selectedDate.getMonth() + 1, _this2._selectedDate.getDate());
        _this2._update();
        e.stopPropagation();
      });
      next.appendChild(document.createTextNode(">"));

      // Block
      var selectMonthTr = document.createElement('div');
      selectMonthTr.classList.toggle('select-month-area');
      selectMonthTr.appendChild(prev);
      selectMonthTr.appendChild(month);
      selectMonthTr.appendChild(next);
      return selectMonthTr;
    };

    DateTimePicker.prototype._getCalendarBodyElm = function _getCalendarBodyElm() {
      var _this3 = this;

      var datesArray = this._getCalendarDatesOf(this._selectedDate);
      var calendarBody = document.createElement('tbody');
      for (var i = 0; i < datesArray.length / 7; i++) {
        var weekTr = document.createElement('tr');
        for (var j = 1; j <= 7 && i * 7 + j < datesArray.length; j++) {
          var weekTd = document.createElement('td');
          weekTd.classList.toggle('day');
          weekTd[DATE] = new Date(this._selectedDate.getFullYear(), this._selectedDate.getMonth(), datesArray[i * 7 + j]);
          weekTd.addEventListener('click', function (e) {
            var input = _this3._element.getElementsByTagName('input');
            if (input.length != 0) {
              input[0].value = e.currentTarget[DATE];
            } else {
              console.error("Could not find any input element under the specified element to picker.");
            }
            e.stopPropagation();
          });
          weekTd.appendChild(document.createTextNode(datesArray[i * 7 + j]));
          weekTr.appendChild(weekTd);
        }
        calendarBody.appendChild(weekTr);
      }
      return calendarBody;
    };

    DateTimePicker.prototype._getTimeSelectButton = function _getTimeSelectButton() {
      var _this4 = this;

      var btn = document.createElement('button');
      btn.appendChild(document.createTextNode("Select Time"));
      btn.classList.toggle('time-select-btn');
      btn.addEventListener('click', function (e) {
        _this4._showTimeSelector();
        e.stopPropagation();
      });
      return btn;
    };

    // top level of time selector view


    DateTimePicker.prototype._getTimeSelectorView = function _getTimeSelectorView() {
      var calendarRootElm = document.createElement('div');
      calendarRootElm.classList.toggle('dropdown-menu');
      calendarRootElm.appendChild(this._getDateSelectButton());
      return calendarRootElm;
    };

    DateTimePicker.prototype._getDateSelectButton = function _getDateSelectButton() {
      var _this5 = this;

      var btn = document.createElement('button');
      btn.appendChild(document.createTextNode("Select Date"));
      btn.classList.toggle('date-select-btn');
      btn.addEventListener('click', function (e) {
        _this5._update();
        e.stopPropagation();
      });
      return btn;
    };

    DateTimePicker.prototype._getTimeSelectorViewMain = function _getTimeSelectorViewMain() {};

    //===
    // Date utils


    DateTimePicker.prototype._getCalendarDatesOf = function _getCalendarDatesOf(targetDate) {
      var dayOfFirst = new Date(targetDate.getFullYear(), targetDate.getMonth()).getDay();
      var lastDateOfThisMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
      var n = dayOfFirst + lastDateOfThisMonth > 35 ? 42 : 35;
      var arr = new Array(n);
      for (var i = 1; i <= n; i++) {
        if (i <= dayOfFirst) {
          // last month
          arr[i] = "";
        } else if (i > dayOfFirst + lastDateOfThisMonth) {
          // next month
          arr[i] = "";
        } else {
          arr[i] = i - dayOfFirst;
        }
      }
      return arr;
    };

    return DateTimePicker;
  }();

  // Construct object


  new DateTimePicker(element);
};

//# sourceMappingURL=datetimepicker.js.map