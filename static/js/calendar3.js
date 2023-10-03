!function() {

  var today = dayjs();

  function Calendar(selector, events) {
    console.log("function Calendar");
    this.el = document.querySelector(selector);
    this.events = events;
    this.current = dayjs().date(1);
    this.draw();
    var current = document.querySelector('.today');
    if(current) {
      var self = this;
      window.setTimeout(function() {
        self.openDay(current);
      }, 500);
    }
  }

  Calendar.prototype.draw = function() {
    //Create Header
    this.drawHeader();

    //Draw Month
    this.drawMonth();

    this.drawLegend();
  }

  Calendar.prototype.drawHeader = function() {
    console.log("function Calendar prototype drawHeader");
    var self = this;
    if(!this.header) {
      //Create the header elements
      this.header = createElement('div', 'header');
      this.header.className = 'header';

      this.title = createElement('h2');

      var right = createElement('div', 'right');
      right.addEventListener('click', function() { self.nextMonth(); });

      var left = createElement('div', 'left');
      left.addEventListener('click', function() { self.prevMonth(); });

      //Append the Elements
      this.header.appendChild(this.title); 
      this.header.appendChild(right);
      this.header.appendChild(left);
      this.el.appendChild(this.header);
	  this.table = createElement('table','','');
	  this.daysLine = createElement('thead','','');
	  this.table.appendChild(this.daysLine);
	  this.drawDaysHead();
      this.el.appendChild(this.table);
    }

    this.title.innerHTML = this.current.format('MMMM YYYY');
  }

  Calendar.prototype.drawDaysHead = function() {
	console.log("function Calendar prototype fillhead")
	var row = createElement('tr', '', '');
	var clone = this.current.clone();
	var dow = clone.day();
	var monday = clone.subtract(dow-1,'day');
	for(var i=0;i<7;i++) {
      var name = createElement('th', 'day-name', monday.add(i,'day').format('ddd'));
      row.appendChild(name);
	}
	this.daysLine.appendChild(row);
  }

  Calendar.prototype.drawMonth = function() {
    console.log("function Calendar prototype drawMonth");
    var self = this;
    
    this.events.forEach(function(ev) {
     ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
    });
    
    if(this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
      this.oldMonth.addEventListener('webkitAnimationEnd', function() {
        self.oldMonth.parentNode.removeChild(self.oldMonth);
        self.month = createElement('tbody', 'month');
        self.backFill();
        self.currentMonth();
        self.forwardFill();
        self.table.appendChild(self.month);
        window.setTimeout(function() {
          self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
        }, 16);
      });
    } else {
        this.month = createElement('tbody', 'month');
        this.table.appendChild(this.month);
        this.backFill();
        this.currentMonth();
        this.forwardFill();
        this.month.className = 'month new';
    }
  }

  Calendar.prototype.backFill = function() {
    console.log("function Calendar prototype backfill");
    var clone = this.current.clone();
	// subtract 1 to let week start on monday
    var dayOfWeek = (clone.day() - 1)%7;

    if(!dayOfWeek) { return; }

    for(var i = dayOfWeek; i > 0 ; i--) {
      this.drawDay(clone.subtract(i,'day'));
    }
  }

  Calendar.prototype.forwardFill = function() {
    console.log("function Calendar prototype forwardFill");
    var clone = this.current.clone().add(1,'month').subtract(1, 'day');
	// subtract 1 to let week start on monday
    var dayOfWeek = (clone.day() - 1)%7 ;

    if(dayOfWeek === 6) { return; }

    for(var i = 1; i <= 6 - dayOfWeek ; i++) {
      this.drawDay(clone.add(i, 'day'));
    }
  }

  Calendar.prototype.currentMonth = function() {
    console.log("function Calendar prototype currentMonth");
    var clone = this.current.clone();

    for(var i = 0; i < clone.daysInMonth(); i++) {
      this.drawDay(clone.add(i,'day'));
    }
  }

  Calendar.prototype.getWeek = function(day) {
	// subract 1 to let week start on monday
    if(!this.week || (day.day()-1)%7 === 0) {
      this.week = createElement('tr', 'week');
      this.month.appendChild(this.week);
    }
  }

  Calendar.prototype.drawDay = function(day) {
    // console.log("function Calendar prototype drawDay");
    var self = this;
    this.getWeek(day);

    //Outer Day
    var outer = createElement('td', this.getDayClass(day));
    outer.addEventListener('click', function() {
      self.openDay(this);
    });

    //Day Name
    // var name = createElement('div', 'day-name', day.format('ddd'));

    //Day Number
    var number = createElement('div', 'day-number', day.format('DD'));


    //Events
    var events = createElement('div', 'day-events');
    // this.drawEvents(day, events);

    // outer.appendChild(name);
    outer.appendChild(number);
    outer.appendChild(events);
    this.week.appendChild(outer);
  }

  Calendar.prototype.drawEvents = function(day, element) {
    console.log("function Calendar prototype drawEvents");
    if(day.month() === this.current.month()) {
      var todaysEvents = this.events.reduce(function(memo, ev) {
        if(ev.date.isSame(day, 'day')) {
          memo.push(ev);
        }
        return memo;
      }, []);

      todaysEvents.forEach(function(ev) {
        var evSpan = createElement('span', ev.color);
        element.appendChild(evSpan);
      });
    }
  }

  Calendar.prototype.getDayClass = function(day) {
    classes = ['day'];
    if(day.month() !== this.current.month()) {
      classes.push('other');
    } else if (today.isSame(day, 'day')) {
      classes.push('today');
    }
    return classes.join(' ');
  }

  Calendar.prototype.openDay = function(el) {
    console.log("function Calendar prototype openDay");
    var details, arrow;
    var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
    var day = this.current.clone().date(dayNumber);

    var currentOpened = document.querySelector('.details');

    //Check to see if there is an open detais box on the current row
    if(currentOpened && currentOpened.parentNode === el.parentNode) {
      details = currentOpened;
      arrow = document.querySelector('.arrow');
    } else {
      //Close the open events on differnt week row
      //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
      if(currentOpened) {
        currentOpened.addEventListener('webkitAnimationEnd', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('oanimationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('msAnimationEnd', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('animationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.className = 'details out';
      }

      //Create the Details Container
      details = createElement('div', 'details in');

      //Create the arrow
      var arrow = createElement('div', 'arrow');

      //Create the event wrapper

      details.appendChild(arrow)
	  var parent = el.parentNode;
	  parent.parentNode.insertBefore(details, parent);
    }

    var todaysEvents = this.events.reduce(function(memo, ev) {
      if(ev.date.isSame(day, 'day')) {
        memo.push(ev);
      }
      return memo;
    }, []);

    this.renderEvents(todaysEvents, details);

    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
  }

  Calendar.prototype.renderEvents = function(events, ele) {
    console.log("function Calendar prototype renderEvents");
    //Remove any events in the current details element
    var currentWrapper = ele.querySelector('.events');
    var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

    events.forEach(function(ev) {
      var div = createElement('div', 'event');
      var square = createElement('div', 'event-category ' + ev.color);
      var span = createElement('span', '', ev.eventName);

      div.appendChild(square);
      div.appendChild(span);
      wrapper.appendChild(div);
    });

    if(!events.length) {
      var div = createElement('div', 'event empty');
      var span = createElement('span', '', 'No Events');

      div.appendChild(span);
      wrapper.appendChild(div);
    }

    if(currentWrapper) {
      currentWrapper.className = 'events out';
      currentWrapper.addEventListener('webkitAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('oanimationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('msAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('animationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
    } else {
      ele.appendChild(wrapper);
    }
  }

  Calendar.prototype.drawLegend = function() {
    console.log("function Calendar prototype drawLegend");
    var legend = createElement('div', 'legend');
    var calendars = this.events.map(function(e) {
      return e.calendar + '|' + e.color;
    }).reduce(function(memo, e) {
      if(memo.indexOf(e) === -1) {
        memo.push(e);
      }
      return memo;
    }, []).forEach(function(e) {
      var parts = e.split('|');
      var entry = createElement('span', 'entry ' +  parts[1], parts[0]);
      legend.appendChild(entry);
    });
    this.el.appendChild(legend);
  }

  Calendar.prototype.nextMonth = function() {
    console.log("function Calendar prototype nextMonth");
    this.current.add('months', 1);
    this.next = true;
    this.draw();
  }

  Calendar.prototype.prevMonth = function() {
    console.log("function Calendar prototype prevMonth");
    this.current.subtract('months', 1);
    this.next = false;
    this.draw();
  }

  window.Calendar = Calendar;

  function createElement(tagName, className, innerText) {
    // console.log("function createElement");
    var ele = document.createElement(tagName);
    if(className) {
      ele.className = className;
    }
    if(innerText) {
      ele.innderText = ele.textContent = innerText;
    }
    return ele;
  }
}();

!function() {
  var data = [
    { eventName: 'Lunch Meeting w/ Mark', calendar: 'Work', color: 'orange' },

    { eventName: 'Game vs Portland', calendar: 'Sports', color: 'blue' },

    { eventName: 'School Play', calendar: 'Kids', color: 'yellow' },

    { eventName: 'Startup Weekend', calendar: 'Other', color: 'green' }
  ];

  

  function addDate(ev) {
    
  }

  var calendar = new Calendar('#calendar', data);

}();

