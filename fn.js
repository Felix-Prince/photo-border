"use strict";
// exports.__esModule = true;
// exports.number2fraction = void 0;
var decimalPattern = /^\d+\.\d+$/;
/**
 * convert decimal number to fraction
 */
function number2fraction(n, mixedFraction) {
    if (mixedFraction === void 0) { mixedFraction = false; }
    if (!decimalPattern.test(n.toString())) {
        return n.toString();
    }
    var strNum = n.toString();
    var afterDecimal = strNum.length - 2;
    var denominator = Math.pow(10, afterDecimal);
    var numerator = n * denominator;
    var divisor = gcd(numerator, denominator);
    if (mixedFraction) {
        var wholeNumberRaw = numerator - (numerator % denominator);
        var wholeNumber = wholeNumberRaw / denominator;
        var newNumerator = numerator - wholeNumberRaw;
        if (wholeNumber) {
            return "".concat(wholeNumber, " ").concat(newNumerator / divisor, "/").concat(denominator / divisor);
        }
    }
    return "".concat(numerator / divisor, "/").concat(denominator / divisor);
}
// exports.number2fraction = number2fraction;
/**
 * find greatest common divider between x & y
 */
function gcd(x, y) {
    if (!y) {
        return x;
    }
    return gcd(y, x % y);
}


window.number2fraction = number2fraction