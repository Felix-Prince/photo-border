function decimalToFraction(decimal) {
    if (decimal % 1 === 0) {
        return `${decimal}/1`; // 如果是整数，直接返回分母为1的分数
    }

    const gcd = (a, b) => {
        if (!b) return a;
        return gcd(b, a % b);
    };

    const len = decimal.toString().length - 2;
    const denominator = Math.pow(10, len);
    const numerator = decimal * denominator;

    const commonDivisor = gcd(numerator, denominator);

    const simplifiedNumerator = numerator / commonDivisor;
    const simplifiedDenominator = denominator / commonDivisor;

    return `${simplifiedNumerator}/${simplifiedDenominator}`;
}

// 示例使用
const decimal = 0.75;
const fraction = decimalToFraction(decimal);
console.log(`${decimal} 转换为分数是 ${fraction}`);


window.decimalToFraction = decimalToFraction