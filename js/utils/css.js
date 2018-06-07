/*
 * This file is part of the Fxp package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global CSSMatrix*/
/*global WebKitCSSMatrix*/
/*global MSCSSMatrix*/

/**
 * Get the transform matrix of target.
 *
 * @param {jQuery} $target
 *
 * @returns {CSSMatrix|WebKitCSSMatrix|MSCSSMatrix|object}
 */
export function getTransformMatrix($target) {
    let transform = {e: 0, f: 0},
        reMatrix,
        match;

    if ($target.css('transform')) {
        if ('function' === typeof CSSMatrix) {
            transform = new CSSMatrix($target.css('transform'));

        } else if ('function' === typeof WebKitCSSMatrix) {
            transform = new WebKitCSSMatrix($target.css('transform'));

        } else if ('function' === typeof MSCSSMatrix) {
            transform = new MSCSSMatrix($target.css('transform'));

        } else {
            reMatrix = /matrix\(\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/;
            match = $target.css('transform').match(reMatrix);

            if (match) {
                transform.e = parseInt(match[1], 10);
                transform.f = parseInt(match[2], 10);
            }
        }
    }

    return transform;
}

/**
 * Get the zindex of element.
 *
 * @param {jQuery} $element The jquery element
 *
 * @return {Number}
 */
export function getZindex($element) {
    let zindex = parseInt($element.css('z-index'), 0);

    if (isNaN(zindex)) {
        zindex = 0;
    }

    return zindex;
}

/**
 * Find the parent zindex.
 *
 * @param {jQuery} $element The jquery element
 *
 * @return {Number}
 */
export function findParentZindex($element) {
    let zindex = getZindex($element),
        $parents = $element.parents(),
        value,
        i;

    for (i = 0; i < $parents.length; i += 1) {
        value = parseInt($parents.eq(i).css('z-index'), 0);

        if (!isNaN(value)) {
            zindex = Math.max(zindex, value);
        }
    }

    return zindex;
}
