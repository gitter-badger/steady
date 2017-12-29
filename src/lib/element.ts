import {_0, _1, cosh, div, mul, neg, Phasor, rect, sinh} from 'lib/phasor';
import {connect, eye, Quadripole, quadripole, rotation, translation} from 'lib/quadripole';
import {Unit} from 'lib/unit';

export const enum Kind {
  connector = 'connector',
  ground = 'ground',
  knee = 'knee',
  vsrc = 'vsrc',
  isrc = 'isrc',
  impedance = 'impedance',
  admittance = 'admittance',
  line = 'line',
  xformer = 'xformer',
  series = 'series',
  shunt = 'shunt',
}

type Connector = {
  readonly kind: Kind.connector,
  readonly next: undefined,
  readonly unit: undefined,
  readonly value: undefined,
  readonly model: Quadripole,
  readonly height: 0,
};

type Ground = {
  readonly kind: Kind.ground,
  readonly next: Element,
  readonly unit: undefined,
  readonly value: undefined,
  readonly model: Quadripole,
  readonly height: number,
};

type Knee = {
  readonly kind: Kind.knee,
  readonly next: Element,
  readonly unit: undefined,
  readonly value: undefined,
  readonly model: Quadripole,
  readonly height: number,
};

type VSrc = {
  readonly kind: Kind.vsrc,
  readonly next: Element,
  readonly unit: Unit.volt,
  readonly value: Phasor,
  readonly model: Quadripole,
  readonly height: number,
};

type ISrc = {
  readonly kind: Kind.isrc,
  readonly next: Element,
  readonly unit: Unit.ampere,
  readonly value: Phasor,
  readonly model: Quadripole,
  readonly height: number,
};

type Impedance = {
  readonly kind: Kind.impedance,
  readonly next: Element,
  readonly unit: Unit.ohm,
  readonly value: Phasor,
  readonly model: Quadripole,
  readonly height: number,
};

type Admittance = {
  readonly kind: Kind.admittance,
  readonly next: Element,
  readonly unit: Unit.ohm,
  readonly value: Phasor,
  readonly model: Quadripole,
  readonly height: number,
};

type Line = {
  readonly kind: Kind.line,
  readonly next: Element,
  readonly unit: {y: Unit.constant, z: Unit.ohm},
  readonly value: {y: Phasor, z: Phasor},
  readonly model: Quadripole,
  readonly height: number,
};

type XFormer = {
  readonly kind: Kind.xformer,
  readonly next: Element,
  readonly unit: Unit.ratio,
  readonly value: number,
  readonly model: Quadripole,
  readonly height: number,
};

type Series = {
  readonly kind: Kind.series,
  readonly next: Element,
  readonly unit: undefined,
  readonly value: undefined,
  readonly model: Quadripole,
  readonly height: number,
};

type Shunt = {
  readonly kind: Kind.shunt,
  readonly next: Element,
  readonly unit: undefined,
  readonly value: Series,
  readonly model: Quadripole,
  readonly height: number,
};

type Elements = {
  [Kind.connector]: Connector;
  [Kind.ground]: Ground;
  [Kind.knee]: Knee;
  [Kind.vsrc]: VSrc;
  [Kind.isrc]: ISrc;
  [Kind.impedance]: Impedance;
  [Kind.admittance]: Admittance;
  [Kind.line]: Line;
  [Kind.xformer]: XFormer;
  [Kind.series]: Series;
  [Kind.shunt]: Shunt;
};

export type Element = Elements[keyof Elements];

const collapse = (element: Element): Quadripole => element.kind !== Kind.connector
  ? connect(element.model, collapse(element.next))
  : element.model
;

export const connector = (next = undefined, value = undefined): Connector => ({
  kind: Kind.connector,
  next,
  unit: undefined,
  value,
  model: quadripole(),
  height: 0,
});

const termination = connector();

export const ground = (next: Ground['next'] = termination, value = undefined): Ground => ({
  kind: Kind.ground,
  next,
  unit: undefined,
  value,
  model: quadripole(),
  height: next.height,
});

export const knee = (next: Knee['next'] = termination, value = undefined): Knee => ({
  kind: Kind.knee,
  next,
  unit: undefined,
  value,
  model: quadripole(),
  height: next.height,
});

export const vsrc = (next: VSrc['next'] = termination, value = _0): VSrc => ({
  kind: Kind.vsrc,
  next,
  unit: Unit.volt,
  value,
  model: quadripole(eye, [value, _0]),
  height: next.height,
});

export const isrc = (next: ISrc['next'] = termination, value = _0): ISrc => ({
  kind: Kind.isrc,
  next,
  unit: Unit.ampere,
  value,
  model: quadripole(eye, [_0, value]),
  height: next.height,
});

export const impedance = (next: Impedance['next'] = termination, value = _0): Impedance => ({
  kind: Kind.impedance,
  next,
  unit: Unit.ohm,
  value,
  model: quadripole([[_1, neg(value)], [_0, _1]]),
  height: next.height,
});

export const admittance = (next: Admittance['next'] = termination, value = rect(Infinity)): Admittance => ({
  kind: Kind.admittance,
  next,
  unit: Unit.ohm,
  value,
  model: quadripole([[_1, _0], [div(rect(-1), value), _1]]),
  height: next.height,
});

export const line = (next: Line['next'] = termination, {y, z} = {y: _0, z: _1}): Line => ({
  kind: Kind.line,
  next,
  unit: {y: Unit.constant, z: Unit.ohm},
  value: {y, z},
  model: quadripole([[cosh(y), mul(neg(z), sinh(y))], [div(sinh(y), neg(z)), cosh(y)]]),
  height: next.height,
});

export const xformer = (next: XFormer['next'] = termination, value = 1): XFormer => ({
  kind: Kind.xformer,
  next,
  unit: Unit.ratio,
  value,
  model: quadripole([[rect(1 / value), _0], [_0, rect(value)]]),
  height: next.height,
});

export const series = (next: Series['next'] = ground(), value = undefined): Series => ({
  kind: Kind.series,
  next,
  unit: undefined,
  value,
  model: collapse(next),
  height: next.height,
});

export const shunt = (next: Shunt['next'] = termination, value = series(knee())): Shunt => ({
  kind: Kind.shunt,
  next,
  unit: undefined,
  value,
  model: collapse(
    isrc(
      admittance(connector(), div(neg(rotation(value.model)[1][0]), rotation(value.model)[1][1])),
      div(translation(value.model)[1], rotation(value.model)[1][1]),
    ),
  ),
  height: next.height + value.height + 1,
});

type Params = {
  [K in keyof Elements]: {
    readonly kind: Elements[K]['kind'],
    readonly next: Elements[K]['next'],
    readonly value: Elements[K]['value'],
  }
};

const create = (params: Params[keyof Params]): Element => {
  switch (params.kind) {
    case Kind.connector:
      return connector();
    case Kind.ground:
      return ground(params.next);
    case Kind.knee:
      return knee(params.next);
    case Kind.vsrc:
      return vsrc(params.next, params.value);
    case Kind.isrc:
      return isrc(params.next, params.value);
    case Kind.impedance:
      return impedance(params.next, params.value);
    case Kind.admittance:
      return admittance(params.next, params.value);
    case Kind.line:
      return line(params.next, params.value);
    case Kind.xformer:
      return xformer(params.next, params.value);
    case Kind.series:
      return series(params.next);
    case Kind.shunt:
      return shunt(params.next, params.value);
  }
};

export const make = <K extends Kind>(kind: K, next?: Params[K]['next'], value?: Params[K]['value']): Elements[K] =>
  create({kind, next, value} as Params[K]); // tslint:disable-line:no-object-literal-type-assertion
