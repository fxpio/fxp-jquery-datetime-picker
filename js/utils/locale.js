/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import moment from 'moment';

/**
 * Get the language configuration of moment.
 *
 * @param {moment} date     The moment instance
 * @param {string} [locale] The ISO code of language
 *
 * @returns {object} The language configuration of moment
 */
export function momentLocaleData(date, locale) {
    let config = date.localeData(locale);

    if (null === config) {
        config = date.localeData();
    }

    return config;
}
