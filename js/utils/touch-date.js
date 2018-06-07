/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {getTransformMatrix} from "./css";
import 'hammerjs';

/**
 * Action on drag end transition of calendar picker.
 *
 * @param {Event} event The hammer event
 *
 * @typedef {DatetimePicker} Event.data.self The datetime picker instance
 * @typedef {string}         Event.data.type The calendar type
 */
export function dragEndCalendarTransition(event) {
    let self = event.data.self,
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
export function initCalendarSwipe(self) {
    if (!Hammer) {
        return;
    }

    let hammerCalendar = 'hammerCalendar';

    self[hammerCalendar] = new Hammer($('.dtp-body-calendar-wrapper', self.$picker).get(0));
    self[hammerCalendar].get('pan').set({ direction: Hammer.DIRECTION_ALL });
    self[hammerCalendar].get('swipe').set({ enable: false });
    self[hammerCalendar]
        .on('tap', $.proxy(function (event) {
            let value = $(event.target).attr('data-date-value');

            if (value) {
                this.setDatetime(value.valueOf());
            }
        }, self))

        .on('panmove', $.proxy(function (event) {
            event.preventDefault();

            let $calendarAll = $('.dtp-body-calendar-all', this.$picker),
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
        }, self))

        .on('panend', $.proxy(function () {
            let $calendarAll = $('.dtp-body-calendar-all', this.$picker),
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

            $calendarAll.on('transitionend webkitTransitionEnd oTransitionEnd', null, {'type': type, 'self': this}, dragEndCalendarTransition);
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
export function destroyCalendarSwipe(self) {
    if (!Hammer) {
        return;
    }

    let hammerCalendar = 'hammerCalendar';

    delete self[hammerCalendar];
}
