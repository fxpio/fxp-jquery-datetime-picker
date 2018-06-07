/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import moment from 'moment';
import {momentLocaleData} from "./locale";
import $ from 'jquery';

/**
 * Generate the week days.
 *
 * @param {DatetimePicker} self
 */
export function generateWeekdays(self) {
    let lang = momentLocaleData(moment, self.options.locale),
        wekkdaysMin = '_weekdaysMin',
        week = '_week',
        days = lang[wekkdaysMin].slice(),
        startDay = momentLocaleData(moment, self.options.locale)[week].dow,
        endDays = days.splice(0, startDay),
        $days = $('.dtp-body-header-days', self.$picker),
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
export function generateCalendar(self, name, date) {
    let today,
        startDay,
        currentDay,
        $calendar,
        $week,
        number,
        dayClass,
        $day,
        i,
        j;

    today = moment();
    today.localeData(self.options.locale);
    startDay = date.clone().startOf('month');
    currentDay = startDay.clone();
    $calendar = $('<div class="dtp-body-calendar" data-calendar-name="' + name + '"></div>');

    if (1 === currentDay.clone().startOf('week').date()) {
        startDay.add(-7, 'days');
        currentDay.add(-7, 'days');
    }

    currentDay.startOf('week');
    currentDay.hours(date.hours());
    currentDay.minutes(date.minutes());
    currentDay.seconds(date.seconds());

    for (i = 0; i < 6; i += 1) {
        $week = $('<div class="dtp-body-calendar-week"></div>');

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

            $day = $('<div class="' + dayClass + '"><div class="dtp-body-calendar-day-value" data-date-value="' + currentDay.format(self.options.format) + '">' + number + '</div></div>');

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
export function generateCalendars(self, date) {
    let $calendars,
        $calendarCurrent,
        $calendarPreviousMonth,
        $calendarNextMonth,
        $calendarPreviousYear,
        $calendarNextYear;

    $calendars = $('<div class="dtp-body-calendar-all"></div>');

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
