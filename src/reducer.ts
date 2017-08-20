import {Reducer} from 'redux';

import {Action} from 'action';
import {Model, Models} from 'model';

export type State = {
  readonly schematics: Model,
  readonly active: number[],
};

const init: State = {
  schematics: {
    kind: Models.SERIES,

    components: [
      {kind: Models.GROUND},
      {kind: Models.PLACEHOLDER},
    ],
  },

  active: [1],
};

export const reducer: Reducer<State> = (state = init, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};
