import {SimpleAction} from "contexts/reducers/reducer";

import {State} from "interfaces/application-state";
import {AppStateReduceId} from "interfaces/enums/app-state-reduce-id";

export interface Spinners {
  proposals: boolean;
  pullRequests: boolean;
  bountyState: boolean;
  balance: boolean;
  wallet: boolean;
  bountyChain: boolean;
  bountyDatabase: boolean;
  matching: boolean;
  connectingGH: boolean;
  switchingChain: boolean;
}

class ChangeSpinners extends SimpleAction<Spinners|Partial<Spinners>> {
  constructor() {
    super(AppStateReduceId.Spinners, 'spinners');
  }

  reducer(state: State, payload): State {
    const transformed = {
      ...state.spinners,
      ...payload,
    }

    return super.reducer(state, transformed);
  }
}

export const changeSpinners = new ChangeSpinners();