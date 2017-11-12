import * as classes from 'classnames';
import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

import {ActionFactory, Actions} from 'action';
import {Elements, ElementUnit, ExpandedElement} from 'model';
import {Phasor, rect} from 'phasor';
import {apply, inv} from 'quadripole';
import {State} from 'reducer';
import {Unit} from 'unit';

import Quantity from 'components/quantity';
import Tile from 'components/tile';

type PropsBase = {
  readonly id: number[],
  readonly element: ExpandedElement,
  readonly vi: [Phasor, Phasor],
};

type Props = PropsBase & {
  readonly active: boolean,
  readonly activate: () => void,
};

const mapState = ({schematics: {active}}: State, {id}: PropsBase) => ({
  active: JSON.stringify(active) === JSON.stringify(id),
});

const mapDispatch = (dispatch: Dispatch<any>, props: PropsBase) => ({
  activate: () => {
    dispatch(ActionFactory[Actions.activate](props.id));
  },
});

const Component = connect(mapState, mapDispatch)(
  ({active, activate, element, id, vi}: Props): JSX.Element => {
    const UnhandledElement = (_: never): never => {
      throw new Error('UnhandledElement');
    };

    switch (element.kind) {
      case Elements.knee:
      case Elements.ground:
        return <Tile className={Elements[element.kind]}/>;

      case Elements.connector:
        return <Tile active={active} activate={activate} className={Elements[element.kind]}/>;

      case Elements.vsrc:
      case Elements.isrc:
      case Elements.impedance:
      case Elements.admittance:
      case Elements.xformer:
        return (
          <Tile active={active} activate={activate} className={Elements[element.kind]}>
            <div className='value'>
              <Quantity value={element.value} unit={ElementUnit[element.kind]}/>
            </div>
          </Tile>
        );

      case Elements.xline:
        return (
          <Tile active={active} activate={activate} className={Elements[element.kind]}>
            <div className='value'>
              <div className='d-flex flex-column'>
                <span>Z</span>
                <span>γ</span>
              </div>
              <div className='d-flex flex-column mx-1'>
                <span>=</span>
                <span>=</span>
              </div>
              <div className='d-flex flex-column'>
                <Quantity value={element.value[0]} unit={ElementUnit[element.kind]}/>
                <Quantity value={element.value[1]} unit={Unit.constant}/>
              </div>
            </div>
          </Tile>
        );

      case Elements.series:
        return (
          <Tile>
            {element.elements.map((e: ExpandedElement, k) => {
              const c = <Component id={[...id, k]} element={e} vi={vi} key={k}/>;
              vi = apply(e.model, vi);
              return c;
            })}
          </Tile>
        );

      case Elements.shunt:
        const fill = Array.apply(null, Array(element.height - element.branch.height))
          .map((_: undefined, k: number) => <Tile key={k}/>);

        return (
          <Tile activate={activate}>
            <Tile
              active={active}
              className={classes('d-flex flex-column', Elements[element.kind])}
            >
              {fill}
            </Tile>
            <Component
              id={id}
              element={element.branch}
              vi={apply(inv(element.model), [vi[0], rect(0)])}
            />
          </Tile>
        );

      default:
        return UnhandledElement(element);
    }
  },
);

export default Component;
