import * as React from 'react';

import parametric, {Props as PropsBase} from 'container/parametric';

import Status from 'component/status';
import Tile from 'component/tile';
import Value from 'component/value';

import {XFormer} from 'lib/element';
import {Unit} from 'lib/unit';

const frame = '\
M3002.4851 2334.0115H1835.4843v-333c-212.995-48.1035-212.995-279.0731.01-222 \
206.995 55.4641 206.995 166.4641 0 111-213.005-57.0745-213.005-390.0718-.01-333 \
207.005 55.4668 207.005 166.4668 0 111-212.995-57.0718-212.995-390.0745.01-333 \
206.995 55.4641 206.995 166.4668-.01 111-212.995-57.0718-212.995-383.8399.01-333 \
206.995 55.4641 206.995 171.7216 0 \
111-213.005-57.0745-213.005-280.07466-.01-223V668.01146l1167.0008-1M1568.4893 \
2000.0115v-1000M.00427339 2334H1167.005v-333c212.995-48.1035 \
212.995-279.0731-.01-222-206.995 55.4641-206.995 166.4641 0 111 213.005-57.0745 \
213.005-390.0718.01-333-207.005 55.4668-207.005 166.4668 0 111 212.995-57.0718 \
212.995-390.0745-.01-333-206.995 55.4641-206.995 166.4668.01 111 212.995-57.0718 \
212.995-383.8399-.01-333-206.995 55.4641-206.995 171.7216 0 111 213.005-57.0745 \
213.005-280.07462.01-223V668L.00427339 667M1434 2000V1000';

const icon = (
  <svg viewBox={'0 0 3000 3000'}>
    <path d={frame}/>
  </svg>
);

export const Icon = () => icon;

type Props = PropsBase<XFormer>;

export default parametric<XFormer>(
  ({vi: [v, i], element, active, activate, remove, update}: Props) => (
    <Tile active={active} activate={activate} remove={remove} className={element.kind}>
      <Icon/>
      <Value value={element.value} description={'transformer ratio'} unit={Unit.ratio} onChange={update}/>
      <Status value={v} unit={Unit.volt}/>
      <Status value={i} unit={Unit.ampere}/>
    </Tile>
  ),
);
