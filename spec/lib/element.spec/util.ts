import closeTo from 'jest/closeTo';

import {Kind, make} from 'lib/element';
import {Phasor, polar} from 'lib/phasor';

expect.extend(closeTo);

export const phasors: Phasor[] = [].concat.apply(
  [],
  [1E-3, 1, 1E3].map((mag) =>
    Array(8).fill(Math.PI / 4).map((p, k) => polar(mag, p * k)),
  ),
);

export const parametric = [
  Kind.vsrc,
  Kind.isrc,
  Kind.impedance,
  Kind.admittance,
  Kind.xformer,
].map(make);

export const elements = parametric.concat([
  Kind.connector,
  Kind.ground,
  Kind.line,
  Kind.series,
  Kind.shunt,
].map(make));
