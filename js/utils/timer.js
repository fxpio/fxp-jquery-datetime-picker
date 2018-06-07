/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import $ from 'jquery';
import 'jquery-knob';

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
export function knobChangeValue(min, max, step, value, previousValue) {
    let maxValue = max + 1,
        maxWithStep = (maxValue - step),
        modulo = value % step;

    value -= value % step;

    if (modulo >= (step / 2)) {
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
export function generateTimer(self) {
    let knobConfig,
        knobSize,
        $wrapper,
        $display,
        $displayMeridiem,
        $hours,
        $minutes,
        $seconds,
        knobChangeHour,
        knobChangeMinute,
        knobChangeSecond;

    $wrapper = $('.dtp-body-time-wrapper', self.$picker);
    $display = $('.dtp-body-time-display', $wrapper);
    $displayMeridiem = $('.dtp-body-time-display-meridiem', $wrapper);
    $hours = $('.dtp-body-time-content-value-hours', $wrapper);
    $minutes = $('.dtp-body-time-content-value-minutes', $wrapper);
    $seconds = $('.dtp-body-time-content-value-seconds', $wrapper);
    knobSize = $wrapper.innerHeight() - parseInt($wrapper.css('padding-top'), 10) - parseInt($wrapper.css('padding-bottom'), 10);

    if (self.options.withMinutes) {
        $wrapper.addClass('time-has-minutes');
    }

    if (self.options.withSeconds) {
        $wrapper.addClass('time-has-seconds');
    }

    $wrapper.addClass('time-has-meridiem');

    if (!$wrapper.hasClass('time-hours-selected') &&
        !$wrapper.hasClass('time-minutes-selected') &&
        !$wrapper.hasClass('time-seconds-selected')) {
        $wrapper.addClass('time-hours-selected');
    }

    knobConfig = {
        'displayInput':    false,
        'displayPrevious': true,
        'cursor':          1,
        'lineCap':         'round',
        'width':           knobSize,
        'height':          knobSize,
        'thickness':       0.2
    };

    knobChangeHour = function (value) {
        let opts = self.options;
        value = knobChangeValue(opts.hourMin, opts.hourMax, opts.hourStep, value, parseInt($hours.val(), 10));

        // convert to 24h
        if (self.currentDate.hour() >= 12) {
            value += 12;
        }

        self.setHour(value);
    };

    knobChangeMinute = function (value) {
        let opts = self.options;
        value = knobChangeValue(opts.minuteMin, opts.minuteMax, opts.minuteStep, value, parseInt($minutes.val(), 10));

        self.setMinute(value);
    };

    knobChangeSecond = function (value) {
        let opts = self.options;
        value = knobChangeValue(opts.secondMin, opts.secondMax, opts.secondStep, value, parseInt($seconds.val(), 10));

        self.setSecond(value);
    };

    // hours
    $hours.knob($.extend(true, knobConfig, {
        'min':     self.options.hourMin,
        'max':     self.options.hourMax + 1,
        'step':    self.options.hourStep,
        'change':  function (value) {
            knobChangeHour(value);
        },
        'release': function (value) {
            if (!self.onDragKnob) {
                knobChangeHour(value);
            }
        }
    }));

    // minutes
    $minutes.knob($.extend(true, knobConfig, {
        'min':     self.options.minuteMin,
        'max':     self.options.minuteMax + 1,
        'step':    self.options.minuteStep,
        'change':  function (value) {
            knobChangeMinute(value);
        },
        'release': function (value) {
            if (!self.onDragKnob) {
                knobChangeMinute(value);
            }
        }
    }));

    // seconds
    $seconds.knob($.extend(true, knobConfig, {
        'min':     self.options.secondMin,
        'max':     self.options.secondMax + 1,
        'step':    self.options.secondStep,
        'change':  function (value) {
            knobChangeSecond(value);
        },
        'release': function (value) {
            if (!self.onDragKnob) {
                knobChangeSecond(value);
            }
        }
    }));

    // time and meridiem display position
    $display.css('top', 0).css('left', 0);
    $displayMeridiem.css('top', 0).css('left', 0);
}
