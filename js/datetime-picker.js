/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import pluginify from '@fxp/jquery-pluginify';
import BaseI18nPlugin from '@fxp/jquery-pluginify/js/i18n-plugin';
import moment from 'moment';
import $ from "jquery";
import {mobileCheck} from "./utils/window";
import {
    blockEvent, closeExternal,
    keyboardAction,
    onInputFocusAction,
    onInputFocusMove,
    preventScroll, scrollHour, scrollMeridiem, scrollMinute, scrollMonth, scrollSecond,
    scrollYear, selectTimeAction
} from "./utils/actions";
import {findParentZindex, getZindex} from "./utils/css";
import {generateCalendars, generateWeekdays} from "./utils/calendar";
import {generateTimer} from "./utils/timer";
import {destroyCalendarSwipe, initCalendarSwipe} from "./utils/touch-date";

/**
 * DatetimePicker class.
 */
export default class DatetimePicker extends BaseI18nPlugin
{
    /**
     * Constructor.
     *
     * @param {HTMLElement} element The DOM element
     * @param {object}      options The options
     */
    constructor(element, options = {}) {
        super(element, options);

        this.eventType      = 'click';
        this.focusEventType = 'click.fxp.datetimepicker';
        this.currentDate    = null;
        this.$picker        = null;
        this.$mask          = null;

        if (mobileCheck()) {
            this.eventType = 'touchstart';
            this.focusEventType = 'touchend.fxp.datetimepicker';
        }

        if (null !== this.options.buttonId) {
            $('#' + this.options.buttonId).on('click' + '.fxp.datetimepicker', $.proxy(this.toggle, this));
        }

        if (this.options.openFocus) {
            if (mobileCheck()) {
                this.$element.on('touchmove', null, this, onInputFocusMove);
            }

            this.$element.on(this.focusEventType, null, this, onInputFocusAction);
        }

        this.$element.on('keyup.fxp.datetimepicker', null, this, keyboardAction);
        this.$element.attr('data-datetime-picker', 'true');
        this.$element.attr('autocomplete', 'off');
    }

    /**
     * Enables the picker.
     */
    enabled() {
        this.$element.attr('disabled', 'disabled');
    }

    /**
     * Disables the picker.
     */
    disabled() {
        this.$element.removeAttr('disabled');
    }

    /**
     * Check is the picker is disabled.
     *
     * @returns {boolean}
     */
    isDisabled() {
        return undefined !== this.$element.attr('disabled');
    }

    /**
     * Check if the picker is opened.
     *
     * @returns {boolean}
     */
    isOpen() {
        return this.$element.hasClass(this.options.classOpen);
    }

    /**
     * Toggle the picker (open or close).
     */
    toggle(event) {
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
    open() {
        if (this.isOpen() || this.isDisabled()) {
            return;
        }

        let localeData = this.locale(),
            value,
            tabSelected,
            format,
            zindex;

        // closes all other pickers
        $('[data-datetime-picker=true]').datetimePicker('close');

        tabSelected = this.options.datePicker ? 'date' : 'time';

        if (this.options.datePicker && this.options.timePickerFirst) {
            tabSelected = 'time';
        }

        this.$mask = $('<div class="' + this.options.classWrapper + '-mask"></div>');
        this.$picker = $([
            '<div class="' + this.options.classWrapper + '" data-target="' + this.$element.attr('id') + '" data-tab-selected="' + tabSelected + '" data-date-picker="' + this.options.datePicker + '" data-time-picker="' + this.options.timePicker + '">',
                '<div class="' + this.options.classHeaderPicker + '">',
                    '<span class="' + this.options.classHeaderPicker + '-title"></span>',
                    '<div class="' + this.options.classHeaderPicker + '-tabs">',
                        '<ul class="' + this.options.classHeaderPicker + '-nav-tabs">',
                            '<li data-role="tab" class="' + this.options.classHeaderPicker + '-nav-tab dtp-tab-date">',
                                '<span class="dtp-show-tab">' + localeData.date + '</span>',
                            '</li>',
                            '<li data-role="tab" class="' + this.options.classHeaderPicker + '-nav-tab dtp-tab-time">',
                                '<span class="dtp-show-tab">' + localeData.time + '</span>',
                            '</li>',
                        '</ul>',
                    '</div>',
                '</div>',
                '<div class="' + this.options.classBodyPicker + '">',
                    '<div class="dtp-body-date">',
                        '<div class="dtp-body-header">',
                            '<div class="dtp-body-header-choice dtp-choice-month">',
                                '<div class="dtp-body-header-choice-content">',
                                    '<span class="dtp-choice-btn dtp-choice-month-btn-prev"></span>',
                                    '<div class="dtp-choice-value">',
                                        '<select class="dtp-choice-value-select dtp-choice-month-value">',
                                        '</select>',
                                    '</div>',
                                    '<span class="dtp-choice-btn dtp-choice-month-btn-next"></span>',
                                '</div>',
                            '</div>',
                            '<div class="dtp-body-header-choice dtp-choice-year">',
                                '<div class="dtp-body-header-choice-content">',
                                    '<span class="dtp-choice-btn dtp-choice-year-btn-prev"></span>',
                                    '<div class="dtp-choice-value">',
                                        '<select class="dtp-choice-value-select dtp-choice-year-value">',
                                        '</select>',
                                    '</div>',
                                    '<span class="dtp-choice-btn dtp-choice-year-btn-next"></span>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div class="dtp-body-header dtp-body-header-days">',
                        '</div>',
                        '<div class="dtp-body-calendar-wrapper">',
                        '</div>',
                    '</div>',
                    '<div class="dtp-body-time">',
                        '<div class="dtp-body-time-wrapper time-has-hours">',
                            '<div class="dtp-body-time-display">',
                                '<span class="dtp-body-time-display-hours"></span>',
                                '<span class="dtp-body-time-display-hours-split">' + localeData.hours + '</span>',
                                '<span class="dtp-body-time-display-minutes"></span>',
                                '<span class="dtp-body-time-display-minutes-split">' + localeData.minutes + '</span>',
                                '<span class="dtp-body-time-display-seconds"></span>',
                                '<span class="dtp-body-time-display-seconds-split">' + localeData.seconds + '</span>',
                            '</div>',
                            '<div class="dtp-body-time-display-meridiem">',
                                '<span class="dtp-body-time-display-meridiem-btn"></span>',
                            '</div>',
                            '<div class="dtp-body-time-content">',
                                '<div class="dtp-body-time-content-hours">',
                                    '<input type="text" class="dtp-body-time-content-value-hours">',
                                '</div>',
                                '<div class="dtp-body-time-content-minutes">',
                                    '<input type="text" class="dtp-body-time-content-value-minutes">',
                                '</div>',
                                '<div class="dtp-body-time-content-seconds">',
                                    '<input type="text" class="dtp-body-time-content-value-seconds">',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="' + this.options.classFooterPicker + '">',
                    '<span class="' + this.options.classFooterPicker + '-btn dtp-btn-cancel"><span>' + localeData.cancel + '</span></span>',
                    '<span class="' + this.options.classFooterPicker + '-btn dtp-btn-clear"><span>' + localeData.clear + '</span></span>',
                    '<span class="' + this.options.classFooterPicker + '-btn dtp-btn-define"><span>' + localeData.define + '</span></span>',
                '</div>',
            '</div>'
        ].join(''));

        $('body')
            .append(this.$mask)
            .append(this.$picker);

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
        this.$picker.on(this.eventType, 'span.' + this.options.classHeaderPicker + '-title', $.proxy(this.setToday, this));
        this.$picker.on(this.eventType, '.dtp-btn-cancel', $.proxy(this.cancel, this));
        this.$picker.on(this.eventType, '.dtp-btn-clear', $.proxy(this.clearValue, this));
        this.$picker.on(this.eventType, '.dtp-btn-define', $.proxy(this.defineValue, this));
        this.$picker.on(this.eventType, '.dtp-tab-date > span.dtp-show-tab', $.proxy(this.showDate, this));
        this.$picker.on(this.eventType, '.dtp-tab-time > span.dtp-show-tab', $.proxy(this.showTime, this));
        this.$picker.on('change',       'select.dtp-choice-year-value', $.proxy(this.setYear, this));
        this.$picker.on(this.eventType, 'span.dtp-choice-year-btn-prev', $.proxy(this.previousYear, this));
        this.$picker.on(this.eventType, 'span.dtp-choice-year-btn-next', $.proxy(this.nextYear, this));
        this.$picker.on('change',       'select.dtp-choice-month-value', $.proxy(this.setMonth, this));
        this.$picker.on(this.eventType, 'span.dtp-choice-month-btn-prev', $.proxy(this.previousMonth, this));
        this.$picker.on(this.eventType, 'span.dtp-choice-month-btn-next', $.proxy(this.nextMonth, this));
        this.$picker.on(this.eventType, '.dtp-body-calendar-day > a', $.proxy(this.setDatetime, this));
        this.$picker.on(this.eventType, '.dtp-body-time-display-hours', $.proxy(this.selectHour, this));
        this.$picker.on(this.eventType, '.dtp-body-time-display-minutes', $.proxy(this.selectMinute, this));
        this.$picker.on(this.eventType, '.dtp-body-time-display-seconds', $.proxy(this.selectSecond, this));
        this.$picker.on(this.eventType, '.dtp-body-time-display-meridiem-btn', $.proxy(this.selectMeridiem, this));
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-header-choice.dtp-choice-year', this, scrollYear);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-header-choice.dtp-choice-month', this, scrollMonth);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-calendar-wrapper', this, scrollMonth);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-time-display-hours', this, scrollHour);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-time-display-minutes', this, scrollMinute);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-time-display-seconds', this, scrollSecond);
        this.$picker.on('DOMMouseScroll mousewheel', '.dtp-body-time-display-meridiem-btn', this, scrollMeridiem);
        $(document).on(this.eventType + '.fxp.datetimepicker' + this.guid, null, this, closeExternal);
        $(window).on('resize.fxp.datetimepicker' + this.guid, null, this, $.proxy(this.position, this));
        $(window).on('keyup.fxp.datetimepicker' + this.guid, null, this, keyboardAction);
        $(window).on('scroll.fxp.datetimepicker' + this.guid, null, this, closeExternal);

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
    close() {
        if (!this.isOpen() || null === this.$picker) {
            return;
        }

        this.currentDate = null;
        this.$picker.off('touchmove', blockEvent);
        this.$picker.off('DOMMouseScroll mousewheel', preventScroll);
        this.$picker.off(this.eventType, 'span.' + this.options.classHeaderPicker + '-title', $.proxy(this.setToday, this));
        this.$picker.off(this.eventType, '.dtp-btn-cancel', $.proxy(this.cancel, this));
        this.$picker.off(this.eventType, '.dtp-btn-clear', $.proxy(this.clearValue, this));
        this.$picker.off(this.eventType, '.dtp-btn-define', $.proxy(this.defineValue, this));
        this.$picker.off(this.eventType, '.dtp-tab-date > span.dtp-show-tab', $.proxy(this.showDate, this));
        this.$picker.off(this.eventType, '.dtp-tab-time > span.dtp-show-tab', $.proxy(this.showTime, this));
        this.$picker.off('change',       'select.dtp-choice-year-value', $.proxy(this.setYear, this));
        this.$picker.off(this.eventType, 'span.dtp-choice-year-btn-prev', $.proxy(this.previousYear, this));
        this.$picker.off(this.eventType, 'span.dtp-choice-year-btn-next', $.proxy(this.nextYear, this));
        this.$picker.off('change',       'select.dtp-choice-month-value', $.proxy(this.setMonth, this));
        this.$picker.off(this.eventType, 'span.dtp-choice-month-btn-prev', $.proxy(this.previousMonth, this));
        this.$picker.off(this.eventType, 'span.dtp-choice-month-btn-next', $.proxy(this.nextMonth, this));
        this.$picker.off(this.eventType, '.dtp-body-calendar-day > a', $.proxy(this.setDatetime, this));
        this.$picker.off(this.eventType, '.dtp-body-time-display-hours', $.proxy(this.selectHour, this));
        this.$picker.off(this.eventType, '.dtp-body-time-display-minutes', $.proxy(this.selectMinute, this));
        this.$picker.off(this.eventType, '.dtp-body-time-display-seconds', $.proxy(this.selectSecond, this));
        this.$picker.off(this.eventType, '.dtp-body-time-display-meridiem-btn', $.proxy(this.selectMeridiem, this));
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

        $(document).off(this.eventType + '.fxp.datetimepicker' + this.guid, closeExternal);
        $(window).off('resize.fxp.datetimepicker' + this.guid, $.proxy(this.position, this));
        $(window).off('keyup.fxp.datetimepicker' + this.guid, keyboardAction);
        $(window).off('scroll.fxp.datetimepicker' + this.guid, closeExternal);
    }

    /**
     * Refreshs the picker position.
     */
    position() {
        if (null === this.$picker) {
            return;
        }

        let top = this.$element.offset().top + this.$element.outerHeight(),
            $window = $(window).eq(0),
            wTop = $window.scrollTop();

        this.$picker.css('left', this.$element.offset().left);

        if ((this.$picker.outerHeight() + top - wTop) > $window.height()) {
            top = this.$element.offset().top - this.$picker.outerHeight();
        }

        if (top - wTop < 0) {
            top = this.$element.offset().top + this.$element.outerHeight();

            if (top + this.$picker.outerHeight() > $(window).height()) {
                top += $(window).height() - (top + this.$picker.outerHeight() - wTop);
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
    setValue(date) {
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
    getValue() {
        return this.$element.val();
    }

    /**
     * Refresh the temporary value defined in picker (note element).
     */
    refreshValue() {
        if (null === this.currentDate) {
            return;
        }

        let value = this.getValue(),
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
    refreshPicker() {
        this.refreshDatePicker();
        this.refreshTimePicker();
    }

    /**
     * Refreshs the date picker blocks with the value defined in the element.
     */
    refreshDatePicker() {
        if (null === this.currentDate || null === this.$picker) {
            return;
        }

        let $header = this.$picker.children('.' + this.options.classHeaderPicker).eq(0),
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
            j;

        // title
        $title.text(this.currentDate.format(this.options.format));

        // months list
        $months = $('.dtp-choice-month-value', $body);
        monthList = moment.localeData()[monthsShort];
        $months.empty();

        for (i = 0; i < monthList.length; i += 1) {
            selectedMonth = i === this.currentDate.month() ? ' selected="selected"' : '';
            $months.append('<option value="' + i + '"' + selectedMonth + '>' + monthList[i] + '</option>');
        }

        // years list
        $years = $('.dtp-choice-year-value', $body);
        startYear = this.currentDate.clone();
        endYear = this.currentDate.clone();

        $years.empty();
        startYear = startYear.add(-10, 'year').year();
        endYear = endYear.add(10, 'year').year();

        for (j = startYear; j <= endYear; j += 1) {
            selectedYear = (j === this.currentDate.year()) ? ' selected="selected"' : '';
            $years.append('<option value="' + j + '"' + selectedYear + '>' + j + '</option>');
        }

        // calendar
        $calendarWrapper = $('.dtp-body-calendar-wrapper', $body);
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
    refreshTimePicker(force) {
        if (null === this.currentDate || null === this.$picker) {
            return;
        }

        let colorRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/,
            format = this.options.format,
            hourFormat = format.indexOf('HH') >= 0 ? 'HH' : 'H',
            minuteFormat = format.indexOf('mm') >= 0 ? 'mm' : 'm',
            secondFormat = format.indexOf('ss') >= 0 ? 'ss' : 's',
            $header = this.$picker.children('.' + this.options.classHeaderPicker).eq(0),
            $title = $header.children('.' + this.options.classHeaderPicker + '-title').eq(0),
            $wrapper = $('.dtp-body-time-wrapper', this.$picker),
            $display = $('.dtp-body-time-display', $wrapper),
            $displayHours = $('.dtp-body-time-display-hours', $display),
            $displayMinutes = $('.dtp-body-time-display-minutes', $display),
            $displaySeconds = $('.dtp-body-time-display-seconds', $display),
            $displayMeridiem = $('.dtp-body-time-display-meridiem-btn', $wrapper),
            $contentHours = $('.dtp-body-time-content-value-hours', $wrapper),
            $contentMinutes = $('.dtp-body-time-content-value-minutes', $wrapper),
            $contentSeconds = $('.dtp-body-time-content-value-seconds', $wrapper),
            $pickerHeader,
            centerPositionTop,
            centerPositionLeft,
            bg,
            hex = function (x) {
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
        }

        // time and meridiem display position
        if (force || (parseInt($display.css('top'), 10) === 0 && $wrapper.outerWidth() > 0)) {
            $pickerHeader = $('.datetime-picker-header', this.$picker);
            centerPositionTop = Math.round($pickerHeader.outerHeight() + $wrapper.outerHeight() / 2);
            centerPositionLeft = Math.round($wrapper.outerWidth() / 2);

            $display
                .css('top', Math.round(centerPositionTop - $display.outerHeight() / 2))
                .css('left', Math.round(centerPositionLeft - $display.outerWidth() / 2));
            $displayMeridiem.parent()
                .css('top', Math.round(centerPositionTop + $display.outerHeight() - $displayMeridiem.outerHeight() / 2))
                .css('left', Math.round(centerPositionLeft - $displayMeridiem.outerWidth() / 2));
        }
    }

    /**
     * Close the picker without changes the value of the element.
     *
     * @param {jQuery.Event|Event} [event]
     */
    cancel(event) {
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
    clearValue(event) {
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
    defineValue(event) {
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
    showDate(event) {
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
    showTime(event) {
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
    selectHour(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!this.options.timePicker || null === this.$picker || 'time' !== this.$picker.attr('data-tab-selected')) {
            return;
        }

        if ($('.dtp-body-time-wrapper', this.$picker).hasClass('time-hours-selected')) {
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
    selectMinute(event) {
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
    selectSecond(event) {
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
    selectMeridiem(event) {
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
    setDatetime(datetime) {
        if (datetime instanceof jQuery.Event) {
            datetime.preventDefault();
            datetime.stopPropagation();
            datetime = $(datetime.target).attr('data-date-value');
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
    setToday(event) {
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
    setYear(year) {
        if (null === this.currentDate || null === this.$picker) {
            return;
        }

        if (year instanceof jQuery.Event) {
            year = $(year.target).val();
        }

        this.currentDate.year(year);
        this.refreshDatePicker();
    }

    /**
     * Set the previous year in temporary picker value.
     *
     * @param {jQuery.Event|Event} [event]
     */
    previousYear(event) {
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
    nextYear(event) {
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
    setMonth(month) {
        if (null === this.currentDate || null === this.$picker) {
            return;
        }

        if (month instanceof jQuery.Event) {
            month = $(month.target).val();
        }

        this.currentDate.month(parseInt(month, 10));
        this.refreshDatePicker();
    }

    /**
     * Set the previous month in temporary picker value.
     *
     * @param {jQuery.Event|Event} event
     */
    previousMonth(event) {
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
    nextMonth(event) {
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
    setHour(hour) {
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
    previousHour(event) {
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
    nextHour(event) {
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
    setMinute(minute) {
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
    previousMinute(event) {
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
    nextMinute(event) {
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
    setSecond(second) {
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
    previousSecond(event) {
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
    nextSecond(event) {
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
    setMeridiem(meridiem) {
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
    toggleMeridiem() {
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
    destroy() {
        this.close();

        if (null !== this.options.buttonId) {
            $('#' + this.options.buttonId).off('click' + '.fxp.datetimepicker', $.proxy(this.toggle, this));
        }

        if (this.options.openFocus) {
            if (mobileCheck()) {
                this.$element.off('touchmove', onInputFocusMove);
            }

            this.$element.off(this.focusEventType, onInputFocusAction);
        }

        super.destroy();
    }
}

/**
 * Defaults options.
 */
DatetimePicker.defaultOptions = {
    classWrapper:      'datetime-picker-wrapper',
    classOpen:         'datetime-picker-open',
    classHeaderPicker: 'datetime-picker-header',
    classBodyPicker:   'datetime-picker-body',
    classFooterPicker: 'datetime-picker-footer',
    classDatePicker:   'datetime-picker-date',
    classTimePicker:   'datetime-picker-time',
    format:            '',
    datePicker:        true,
    timePicker:        true,
    timePickerFirst:   false,
    withMinutes:       true,
    withSeconds:       false,
    buttonId:          null,
    openFocus:         true,
    dragDistance:      70,
    inertiaVelocity:   0.07,
    hourMin:           0,
    hourMax:           11,
    hourStep:          1,
    minuteMin:         0,
    minuteMax:         59,
    minuteStep:        1,
    secondMin:         0,
    secondMax:         59,
    secondStep:        1
};

/**
 * Default locale.
 */
DatetimePicker.locales = {
    en: {
        date:    'Date',
        time:    'Time',
        hours:   'h',
        minutes: 'm',
        seconds: 's',
        cancel:  'Cancel',
        clear:   'Clear',
        define:  'Define'
    }
};

pluginify('datetimePicker', 'fxp.datetimepicker', DatetimePicker, true, '[data-datetime-picker="true"]');
