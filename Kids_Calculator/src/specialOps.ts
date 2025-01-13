export function squareFormula(x: string) {
  return `Math.pow(${x},2)`;
}

export function squareDisplay(x: string) {
  return `${x}²`;
}

export function cubeFormula(x: string) {
  return `Math.pow(${x},3)`;
}

export function cubeDisplay(x: string) {
  return `${x}³`;
}

export function squareRootFormula(x: string) {
  return `Math.sqrt(${x})`;
}

export function squareRootDisplay(x: string) {
  return `√${x}`;
}

export function cubicRootFormula(x: string) {
  return `Math.cbrt(${x})`;
}

export function cubicRootDisplay(x: string) {
  return `∛${x}`;
}

export function oneOverFormula(x: string) {
  return `Math.pow(${x},-1)`;
}

export function oneOverDisplay(x: string) {
  return `1/${x}`;
}

export function power2Formula(x: string) {
  return `Math.pow(2,${x})`;
}

export function power2Display(x: string) {
  return `2^${x}`;
}

export function power3Formula(x: string) {
  return `Math.pow(3,${x})`;
}

export function power3Display(x: string) {
  return `3^${x}`;
}

export const allFormulas = [
  squareFormula,
  squareRootFormula,
  cubicRootFormula,
  cubeFormula,
  oneOverFormula,
  power2Formula,
  power3Formula,
]

export const allDisplays = [
  squareDisplay,
  squareRootDisplay,
  cubicRootDisplay,
  cubeDisplay,
  oneOverDisplay,
  power2Display,
  power3Display,
];
