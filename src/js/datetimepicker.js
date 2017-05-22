
const datetimepicker = ((element) => {

  // Constants
  const DAY_OF_WEEKS = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];
  const DATE = Symbol(); // KEY to bind Date object to date element

  // Class Definition
  class DateTimePicker {
    constructor(element) {
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
    _setListeners() {
      this._element.addEventListener('click', e => {
        console.log("element clicked");
        if (this._isDisplayed === false) {
          console.log("will call show");
          this._show();
        } else {
          console.log("will call hide");
          this._hide();
        }
        e.stopPropagation();  //TODO: Check more
      });

      //TODO: Check more
      document.addEventListener('click', e => {
        console.log("document clicked");
        if (e.currentTarget !== this._element && this._isDisplayed) {
          console.log("will call hide");
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

    _update() {
      this._element.removeChild(this._calendarRootElm);
      this._calendarRootElm = this._getWidgetFragment();
      this._element.appendChild(this._calendarRootElm);
    }

    _showTimeSelector() {
      this._element.removeChild(this._calendarRootElm);
      this._calendarRootElm = this._getTimeSelectorView();
      this._element.appendChild(this._calendarRootElm);
    }

    // top level of calendar view
    _getWidgetFragment() {
      let calendarRootElm = document.createElement('div');
      calendarRootElm.classList.toggle('dropdown-menu');
      calendarRootElm.appendChild(this._getMonthSelectorElm());
      let table = document.createElement('table');
      table.classList.toggle('calendar-table');
      table.appendChild(this._getCalenderHeaderElm());
      table.appendChild(this._getCalendarBodyElm());
      calendarRootElm.appendChild(table);
      calendarRootElm.appendChild(this._getTimeSelectButton());
      return calendarRootElm;
    }

    //TODO:
    _getCalenderHeaderElm() {
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
      thead.appendChild(dayOfWeeksTr);

      // header fragment
      let headerFragment = document.createDocumentFragment();
      headerFragment.appendChild(thead);
      return headerFragment;
    }

    _getMonthSelectorElm() {
      // Previous month
      let prev = document.createElement('span');
      prev.classList.toggle('prev');
      prev.addEventListener('click', e => {
        this._selectedDate = new Date(this._selectedDate.getFullYear(), this._selectedDate.getMonth() - 1, this._selectedDate.getDate(), this._selectedDate.getHours(), this._selectedDate.getMinutes());
        this._update();
        e.stopPropagation();
      })
      prev.appendChild(document.createTextNode("<"));

      // This month
      let month = document.createElement('span');
      month.classList.toggle('month');
      month.appendChild(document.createTextNode(new Intl.DateTimeFormat(this._locale, {month:'long', year: 'numeric'}).format(this._selectedDate)));
      
      // Next month
      let next = document.createElement('span');
      next.classList.toggle('next');
      next.addEventListener('click', e => {
        this._selectedDate = new Date(this._selectedDate.getFullYear(), this._selectedDate.getMonth() + 1, this._selectedDate.getDate(), this._selectedDate.getHours(), this._selectedDate.getMinutes());
        this._update();
        e.stopPropagation();
      })
      next.appendChild(document.createTextNode(">"));

      // Block
      let selectMonthTr = document.createElement('div');
      selectMonthTr.classList.toggle('select-month-area');
      selectMonthTr.appendChild(prev);
      selectMonthTr.appendChild(month);
      selectMonthTr.appendChild(next);
      return selectMonthTr;
    }

    _getCalendarBodyElm() {
      let datesArray = this._getCalendarDatesOf(this._selectedDate);
      let calendarBody = document.createElement('tbody');
      for (let i = 0; i < datesArray.length / 7; i++) {
        let weekTr = document.createElement('tr');
        for (let j = 1; j <= 7 && i*7+j < datesArray.length; j++) {
          let weekTd = document.createElement('td');
          weekTd.classList.toggle('day');
          weekTd[DATE] = new Date(
            this._selectedDate.getFullYear(),
            this._selectedDate.getMonth(),
            datesArray[i*7+j]
          );
          weekTd.addEventListener('click', e => {
            let input = this._element.getElementsByTagName('input');
            if (input.length != 0) {
              this._selectedDate.setDate(e.currentTarget[DATE].getDate());
              input[0].value = this._selectedDate;
            } else {
              console.error("Could not find any input element under the specified element to picker.");
            }
            e.stopPropagation();
          });
          weekTd.appendChild(document.createTextNode(datesArray[i*7+j]));
          weekTr.appendChild(weekTd);
        }
        calendarBody.appendChild(weekTr);
      }
      return calendarBody;
    }

    _getTimeSelectButton() {
      let btn = document.createElement('button');
      btn.appendChild(document.createTextNode("Select Time"));
      btn.classList.toggle('time-select-btn');
      btn.addEventListener('click', e => {
        this._showTimeSelector();
        e.stopPropagation();
      });
      return btn;
    }

    // top level of time selector view
    _getTimeSelectorView() {
      let calendarRootElm = document.createElement('div');
      calendarRootElm.classList.toggle('dropdown-menu');
      calendarRootElm.appendChild(this._getDateSelectButton());
      calendarRootElm.appendChild(this._getTimeSelectorViewMain());
      return calendarRootElm;
    }

    _getDateSelectButton() {
      let btn = document.createElement('button');
      btn.appendChild(document.createTextNode("Select Date"));
      btn.classList.toggle('date-select-btn');
      btn.addEventListener('click', e => {
        this._update();
        e.stopPropagation();
      });
      return btn;
    }

    _getTimeSelectorViewMain() {
      let table = document.createElement('table');
      let makeRow = (obj) => {
        //Hour
        let td_hour = document.createElement('td');
        td_hour.appendChild(document.createTextNode(obj['str_hour']));
        if (obj['id_hour']) { td_hour.id = obj['id_hour']; }
        td_hour.classList.toggle('time-select-td');
        if (obj['onclick_hour']) { td_hour.addEventListener('click', obj['onclick_hour']);}
        //Separator
        let td_sep = document.createElement('td');
        td_sep.appendChild(document.createTextNode(obj['str_sep']));
        td_sep.classList.toggle('time-select-td');
        let td_min = document.createElement('td');
        //Minute
        td_min.appendChild(document.createTextNode(obj['str_min']));
        if (obj['id_min']) { td_min.id = obj['id_min']; }
        td_min.classList.toggle('time-select-td');
        if (obj['onclick_min']) { td_min.addEventListener('click', obj['onclick_min']);}
        //Append ALL
        let tr = document.createElement('tr');
        tr.appendChild(td_hour);
        tr.appendChild(td_sep);
        tr.appendChild(td_min);
        return tr;
      }

      let tr1 = makeRow({str_hour: '↑', str_sep: " ", str_min: "↑", onclick_hour: e => {
        let hour = Number(document.getElementById('id-time-select-hour').textContent)
        hour = (hour+1)%24;
        document.getElementById('id-time-select-hour').textContent = ("00" + hour).substr(-2);
        let input = this._element.getElementsByTagName('input');
        if (input.length != 0) {
          this._selectedDate.setHours(hour);
          input[0].value = this._selectedDate;
        } else {
          console.error("Could not find any input element under the specified element to picker.");
        }
        e.stopPropagation();
      }, onclick_min: e => {
        let min = Number(document.getElementById('id-time-select-min').textContent);
        min = (min+1)%60;
        document.getElementById('id-time-select-min').textContent = ("00" + min).substr(-2);
        let input = this._element.getElementsByTagName('input');
        if (input.length != 0) {
          this._selectedDate.setMinutes(min);
          input[0].value = this._selectedDate;
        } else {
          console.error("Could not find any input element under the specified element to picker.");
        }
        e.stopPropagation();
      }});

      let tr2 = makeRow({str_hour: ("00" + this._selectedDate.getHours()).substr(-2), str_sep: ":", str_min: ("00" + this._selectedDate.getMinutes()).substr(-2), id_hour: 'id-time-select-hour', id_min: 'id-time-select-min'});
      
      let tr3 = makeRow({str_hour: '↓', str_sep: " ", str_min: "↓", onclick_hour: e => {
        let hour = Number(document.getElementById('id-time-select-hour').textContent)
        hour = hour-1 < 0 ? 23 : hour-1;
        document.getElementById('id-time-select-hour').textContent = ("00" + hour).substr(-2);
        let input = this._element.getElementsByTagName('input');
        if (input.length != 0) {
          this._selectedDate.setHours(hour);
          input[0].value = this._selectedDate;
        } else {
          console.error("Could not find any input element under the specified element to picker.");
        }
        e.stopPropagation();
      }, onclick_min: e => {
        let min = Number(document.getElementById('id-time-select-min').textContent);
        min = min-1 < 0 ? 59: min-1;
        document.getElementById('id-time-select-min').textContent = ("00" + min).substr(-2);
        let input = this._element.getElementsByTagName('input');
        if (input.length != 0) {
          this._selectedDate.setMinutes(min);
          input[0].value = this._selectedDate;
        } else {
          console.error("Could not find any input element under the specified element to picker.");
        }
        e.stopPropagation();
      }});
  
      table.appendChild(tr1);
      table.appendChild(tr2);
      table.appendChild(tr3);
      table.classList.toggle('time-select-table');
      return table;
    }

    //===
    // Date utils
    _getCalendarDatesOf(targetDate) {
      var dayOfFirst = (new Date(targetDate.getFullYear(), targetDate.getMonth())).getDay();
      var lastDateOfThisMonth = (new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)).getDate();
      let n = dayOfFirst + lastDateOfThisMonth > 35 ? 42 : 35;
      var arr = new Array(n);
      for (var i = 1; i <= n; i++) {
        if (i <= dayOfFirst) { // last month
          arr[i] = "";
        } else if (i > dayOfFirst + lastDateOfThisMonth) { // next month
          arr[i] = "";
        } else {
          arr[i] = i - dayOfFirst;
        }
      }
      return arr;
    }
  }

  // Construct object
  new DateTimePicker(element);
});
