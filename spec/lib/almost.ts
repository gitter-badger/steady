import {Phasor, isPhasor, real, imag} from 'lib/phasor';

declare global {
  export namespace Chai {
    interface Assertion {
      almost(x: number | Phasor, e?: number): void;
    }
  }
}

const pretty = (x: number | Phasor) => (
    isPhasor(x)
  ? `(${real(x)}, ${imag(x)})`
  : JSON.stringify(x)
);

const almost = (x: number | Phasor, y: number | Phasor, e: number): boolean => {
  const f = (t: number, u = 0) => (1 + (t && u && (t * u))) / (Math.hypot(1, t) * Math.hypot(1, u));

  return (
      (typeof x === 'number' && typeof y === 'number')
    ? (x === y) || (Math.abs(x - y) < e) || (Math.abs(x - y) / Math.hypot(x, y)) < e
    : (isPhasor(x) && isPhasor(y))
    ? almost(Math.abs(x.mag), Math.abs(y.mag), e) && (
        almost(f(x.tan, y.tan), 1, e) ||
        almost(f(1 / x.tan, 1 / y.tan), 1, e) || (
          almost(f(x.tan) * x.mag, f(y.tan) * y.mag, e) &&
          almost(f(1 / x.tan) * x.mag, f(1 / y.tan) * y.mag, e)
        )
      )
    : false
  );
};

export default (chai: any) => {
  chai.Assertion.addMethod('almost', function (y: number | Phasor, e = 1E-9) {
    const x: number | Phasor = this._obj;
    this.assert(
      almost(x, y, e),
      `expected ${pretty(x)} to be close to ${pretty(y)} with relative precision of ${e}`,
      `expected ${pretty(x)} to not be close to ${pretty(y)} with relative precision of ${e}`,
      y,
      x
    );
  });
}

