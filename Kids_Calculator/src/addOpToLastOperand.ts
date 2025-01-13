import {isSimpleNumeric, needsParentheses} from './utils';

export function addOpToLastOperand(expression: string, op: (x: string) => string, addParam: boolean | undefined): string {
  // Remove spaces for easier parsing
  const sanitized = expression.replace(/\s+/g, '');
  // write a function to find the last operand
  // if the string ends with ')', find the matching '('
  // and then go backward to include Math.xxxx.
  // if the string ends with a number, keep go back until it is not a number.
  if (sanitized.length === 0) {
    return sanitized;
  }

  const { index, last } = extractLastOperand(sanitized);
  const firstPart = sanitized.slice(0, index);
  if (addParam) {
    return firstPart + op(`(${last})`);
  } else if (addParam === undefined) {
    return firstPart + op(needsParentheses(last) ? `(${last})` : last);
  } else {
    return firstPart + op(last);
  }
}

export function extractLastSpecialOp(sanitized: string, i: number, specialOp: string): { index: number, last: string } | undefined {
  if (i + 1 >= specialOp.length && sanitized.substring(i+1 - specialOp.length, i + 1) === specialOp) {
    return {
      index: i + 1 - specialOp.length,
      last: sanitized.substring(i + 1 - specialOp.length)
    };
  }
  return undefined;
}

// returns two parts.
// index is where the position where the last operand begins.
// last is what the last operand looks like without (). If it needs (), it will be added.
export function extractLastOperand(sanitized: string): { index: number, last: string } {
  const lastChar = sanitized[sanitized.length - 1];
  if (lastChar === ')') {
    let count = 1;
    let i = sanitized.length - 2;
    while (count !== 0) {
      if (sanitized[i] === ')') {
        count++;
      } else if (sanitized[i] === '(') {
        count--;
      }
      i--;
    }

    // We have specialOps(...)
    const specialOps = ['Math.pow', 'Math.sqrt', 'Math.cbrt', '√', '∛', '2^', '3^'];
    for (const specialOp of specialOps) {
      const lastOp = extractLastSpecialOp(sanitized, i, specialOp);
      if (lastOp) {
        return lastOp;
      }
    }

    return {
      index: i + 1,
      // strip out the ().
      last: sanitized.substring(i+2, sanitized.length-1)
    };
  } else if (lastChar === '²' || lastChar === '³') {
    // Go one level back
    const prevOperand = extractLastOperand(sanitized.substring(0, sanitized.length - 1));
    return {
      index: prevOperand.index,
      last: needsParentheses(prevOperand.last) ? `(${prevOperand.last})` + lastChar : prevOperand.last + lastChar
    };
  } else {
    let i = sanitized.length - 1;
    while (i >= 0 && isValidNumeric(sanitized[i])) {
      i--;
    }

    // We have specialOps without ().
    const specialOps = ['√', '∛', '2^', '3^'];
    for (const specialOp of specialOps) {
      const lastOp = extractLastSpecialOp(sanitized, i, specialOp);
      if (lastOp) {
        return lastOp;
      }
    }
    return {
      index: i + 1,
      last: sanitized.substring(i + 1)
    };
  }
}

function isValidNumeric(x: string): boolean {
  if (isSimpleNumeric(x)) {
    return true;
  }
  if (x === '²' || x === '³' || x === '√' || x === '∛' || x === '^') {
    return true;
  }
  return false;
}
