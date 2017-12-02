import {expect, use} from 'chai';
import almost from './almost';

use(almost);

import {
  rect, polar,
  real, imag,
  norm, angle,
  neg, conj,
  add, sub,
  mul, div,
  sinh, cosh,
} from 'lib/phasor';

const samples = [].concat.apply(
  [{mag: 0, ang: 0, real: 0, imag: 0}],
  [1E-6, 1E-3, 1, 1E3, 1E6, Infinity].map((mag) =>
    Array(33).fill(Math.PI / 8).map((p, k) => {
      const ang = p * k - 2 * Math.PI;
      const cos = Math.cos(ang % (Math.PI * 2));
      const sin = Math.sin(ang % (Math.PI * 2));

      const real = cos && (cos * mag);
      const imag = sin && (sin * mag);

      return {mag, ang, real, imag};
    })
  ),
);

const generate = (f: (_: {mag: number, ang: number, real: number, imag: number}) => void) => {
  samples.forEach(f);
};

describe('Phasor', () => {
  it('should have a real part', () => {
    generate(({real: re, imag: im}) => {
      expect(real(rect(re))).to.be.almost(re);
      expect(real(rect(re, im))).to.be.almost(re);
    });
  });

  it('should have an imaginary part', () => {
    generate(({real: re, imag: im}) => {
      expect(imag(rect(re))).to.be.almost(0);
      expect(imag(rect(re, im))).to.be.almost(im);
    });
  });

  it('should have a magnitude', () => {
    generate(({mag, ang}) => {
      const r = Math.abs(mag);
      expect(norm(polar(mag))).to.be.almost(r);
      expect(norm(polar(mag, ang))).to.be.almost(r);
    });
  });

  it('should have an angle', () => {
    generate(({mag, ang}) => {
      const r = mag && Math.atan2(Math.sin(ang), Math.cos(ang));
      expect(angle(polar(mag))).to.be.almost(0);
      expect(angle(polar(mag, ang))).to.be.almost(r);
    });
  });

  it('should have a polar form', () => {
    generate(({mag, ang, real, imag}) => {
      if (isFinite(mag)) {
        const u = polar(mag, ang);
        const r = rect(real, imag);
        expect(u).to.be.almost(r);
      }
    });
  });

  it('should have a complement', () => {
    generate(({mag, ang}) => {
      const u = polar(mag, ang);
      const r = polar(-mag, ang);
      expect(neg(u)).to.be.almost(r);
    });
  });

  it('should have a conjugate', () => {
    generate(({mag, ang}) => {
      const u = polar(mag, ang);
      const r = polar(mag, -ang);
      expect(conj(u)).to.be.almost(r);
    });
  });

  it('should add', () => {
    generate(({real: a, imag: b}) => {
      generate(({real: c, imag: d}) => {
        if(!(a === Infinity && c === -Infinity) && !(a === -Infinity && c === Infinity)
        && !(b === Infinity && d === -Infinity) && !(b === -Infinity && d === Infinity)) {
          const u = rect(a, b);
          const v = rect(c, d);
          const r = rect(a + c, b + d);
          expect(add(u, v)).to.be.almost(r);
        }
      });
    });
  });

  it('should subtract', () => {
    generate(({real: a, imag: b}) => {
      generate(({real: c, imag: d}) => {
        if(!(a === Infinity && c === Infinity) && !(a === -Infinity && c === -Infinity)
        && !(b === Infinity && d === Infinity) && !(b === -Infinity && d === -Infinity)) {
          const u = rect(a, b);
          const v = rect(c, d);
          const r = rect(a - c, b - d);
          expect(sub(u, v)).to.be.almost(r);
        }
      });
    });
  });

  it('should multiply', () => {
    generate(({mag: a, ang: b}) => {
      generate(({mag: c, ang: d}) => {
        if(!(a === Infinity && c === 0) && !(a === -Infinity && c === 0)
        && !(a === 0 && c === Infinity) && !(a === 0 && c === -Infinity)) {
          const u = polar(a, b);
          const v = polar(c, d);
          const r = polar(a * c, b + d);
          expect(mul(u, v)).to.be.almost(r);
        }
      });
    });
  });

  it('should divide', () => {
    generate(({mag: a, ang: b}) => {
      generate(({mag: c, ang: d}) => {
        if(!(a === Infinity && c === Infinity) && !(a === -Infinity && c === -Infinity)
        && !(a === Infinity && c === Infinity) && !(a === -Infinity && c === -Infinity)
        && !(a === 0 && c === 0)) {
          const u = polar(a, b);
          const v = polar(c, d);
          const r = polar(a / c, b - d);
          expect(div(u, v)).to.be.almost(r);
        }
      });
    });
  });

  it('should have a hyperbolic sine', () => {
    generate(({real, imag}) => {
      if (isFinite(imag)) {
        const sini = Math.sin(imag);
        const cosi = Math.cos(imag);
        const u = rect(real, imag);
        const r = rect(cosi && (cosi * Math.sinh(real)), sini && (sini * Math.cosh(real)));
        expect(sinh(u)).to.be.almost(r);
      }
    });
  });

  it('should have a hyperbolic cosine', () => {
    generate(({real, imag}) => {
      if (isFinite(imag)) {
        const sini = Math.sin(imag);
        const cosi = Math.cos(imag);
        const u = rect(real, imag);
        const r = rect(cosi && (cosi * Math.cosh(real)), sini && (sini * Math.sinh(real)));
        expect(cosh(u)).to.be.almost(r);
      }
    });
  });
});
