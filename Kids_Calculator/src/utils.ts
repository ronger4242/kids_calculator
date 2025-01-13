
export function needsParentheses(x: string): boolean {
  if (x.length < 2) {
    return false;
  }
  if (x[0] === '(' && x[x.length - 1] === ')') {
    return false;
  }
  return !isSimpleNumeric(x);
}

export function isSimpleNumeric(x: string): boolean {
  for (const c of x) {
    if (c === '.') {
      continue;
    }
    if (c >= '0' && c <= '9') {
      continue;
    }
    return false;
  }
  return true;
}
