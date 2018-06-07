/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import $ from 'jquery';

/**
 * Binding actions of keyboard.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {DatetimePicker} Event.data The datetime picker instance
 */
export function keyboardAction(event) {
    if (!(event instanceof jQuery.Event)) {
        return;
    }

    let self = event.data;

    if (event.keyCode  === 9) {// tab
        self.toggle(event);

    } else if (self.isOpen()) {// on opened picker
        if (event.keyCode === 27) {// escape
            self.close();

        } else if (event.keyCode === 13) {// enter
            self.defineValue();
            event.preventDefault();
            event.stopPropagation();

        } else {// refresh value
            self.refreshValue();
        }

    } else {// on closed picked
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
export function closeExternal(event) {
    let self = event.data,
        $target = $(event.currentTarget.activeElement);

    if ($target.hasClass(self.options.classOpen) || $(event.target).hasClass(self.options.classWrapper) || $(event.target).parents('.' + self.options.classWrapper).length > 0) {
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
export function onInputFocusMove(event) {
    event.data.$element.data('st-inputFocusDragged', true);
}

/**
 * Action on input focus event.
 *
 * @param {jQuery.Event|Event} event
 */
export function onInputFocusAction(event) {
    let self = event.data;

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
export function blockEvent(event) {
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
export function preventScroll(event) {
    let self = event.data,
        state = true,
        scrollTop = self.$picker.get(0).scrollTop,
        scrollHeight = self.$picker.get(0).scrollHeight,
        height = self.$picker.height(),
        delta = (event.type === 'DOMMouseScroll' ?
            event.originalEvent.detail * -40 :
            event.originalEvent.wheelDelta),
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
export function selectTimeAction(self, type) {
    $('.dtp-body-time-wrapper', self.$picker)
        .removeClass('time-hours-selected')
        .removeClass('time-minutes-selected')
        .removeClass('time-seconds-selected')
        .addClass('time-' + type + 's-selected');

    self.refreshTimePicker();
}

/**
 * Action on scroll event.
 *
 * @param {DatetimePicker}     self  The datetime picker instance
 * @param {jQuery.Event|Event} event
 * @param {string}             type  The timer type (hour, minute, second)
 */
export function scrollAction(self, event, type) {
    let delta = (event.type === 'DOMMouseScroll' ?
        event.originalEvent.detail * -40 :
        event.originalEvent.wheelDelta);

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
export function scrollYear(event) {
    scrollAction(event.data, event, 'year');
}

/**
 * Action on scroll event for month picker.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {DatetimePicker} Event.data The datetime picker instance
 */
export function scrollMonth(event) {
    scrollAction(event.data, event, 'month');
}

/**
 * Action on scroll event for hour picker.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {DatetimePicker} Event.data The datetime picker instance
 */
export function scrollHour(event) {
    scrollAction(event.data, event, 'hour');
}

/**
 * Action on scroll event for minute picker.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {DatetimePicker} Event.data The datetime picker instance
 */
export function scrollMinute(event) {
    scrollAction(event.data, event, 'minute');
}

/**
 * Action on scroll event for second picker.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {DatetimePicker} Event.data The datetime picker instance
 */
export function scrollSecond(event) {
    scrollAction(event.data, event, 'second');
}

/**
 * Action on scroll event for meridiem picker.
 *
 * @param {jQuery.Event|Event} event
 *
 * @typedef {DatetimePicker} Event.data The datetime picker instance
 */
export function scrollMeridiem(event) {
    event.data.toggleMeridiem();
    event.stopPropagation();
    event.preventDefault();
}
