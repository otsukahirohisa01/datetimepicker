
const datetimepicker = ((element) => {

  // Constants
  const DAY_OF_WEEKS = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];

  // Class Definition
  class DateTimePicker {
    constructor(element) {
      // Private members
      this._element = element;
      this._calendarRootElm = null;
      this._isDisplayed = false;

      // Setup
      this._setListeners();
    }

    // Private Functions
    _setListeners() {
      this._element.addEventListener('click', e => {
        if (this._isDisplayed === false) {
          this._show();
        } else {
          this._hide();
        }
        e.stopPropagation();  //TODO: Check more
      });

      //TODO: Check more
      document.addEventListener('click', e => {
        if (e.currentTarget !== this._element && this._isDisplayed) {
          this._hide();
        }
      });
    }

    _show() {
      this._calendarRootElm = this._getWidgetFragment();
      this._element.appendChild(this._calendarRootElm);
      this._isDisplayed = true;
    }

    _hide() {
      this._element.removeChild(this._calendarRootElm);
      this._calendarRootElm = null;
      this._isDisplayed = false;
    }

    _getWidgetFragment() {
      let calendarRootElm = document.createElement('div');
      calendarRootElm.classList.toggle('dropdown-menu');
      calendarRootElm.appendChild(this._getHeaderFragment());
      return calendarRootElm;
    }

    //TODO:
    _getHeaderFragment() {
      // Select Month header
      let prevTh = document.createElement('th');
      prevTh.appendChild(document.createTextNode("<"));
      let monthTh = document.createElement('th');
      monthTh.appendChild(document.createTextNode("March 2017"));
      let nextTh = document.createElement('th');
      nextTh.appendChild(document.createTextNode(">"));
      let selectMonthTr = document.createElement('tr');
      selectMonthTr.appendChild(prevTh);
      selectMonthTr.appendChild(monthTh);
      selectMonthTr.appendChild(nextTh);
      // Day of weeks header
      let dayOfWeeksTr = document.createElement('tr');
      for (const dayOfWeek of DAY_OF_WEEKS) {
        let dayOfWeekTh = document.createElement('th');
        dayOfWeekTh.classList.toggle('day-of-weeks');
        dayOfWeekTh.appendChild(document.createTextNode(dayOfWeek));
        dayOfWeeksTr.appendChild(dayOfWeekTh);
      }
      // thead
      let thead = document.createElement('thead');
      thead.appendChild(selectMonthTr);
      thead.appendChild(dayOfWeeksTr);

      // table
      let table = document.createElement('table');
      table.appendChild(thead);

      // header fragment
      let headerFragment = document.createDocumentFragment();
      headerFragment.appendChild(table);
      return headerFragment;
    }
  }

  // Construct object
  new DateTimePicker(element);
});
