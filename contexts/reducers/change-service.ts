import {SimpleAction} from "contexts/reducers/reducer";

import {
  ServiceState,
  State
} from "interfaces/application-state";
import {AppStateReduceId} from "interfaces/enums/app-state-reduce-id";

export class ChangeServiceProp<T = ServiceState | Partial<ServiceState>, A = keyof ServiceState>
  extends SimpleAction<T, A> {

  constructor(id  = AppStateReduceId.Service) {
    super(id, 'Service');
  }

  reducer(state: State, payload, subAction): State {
    return super.reducer(state, Object.assign(state.Service || {}, {[subAction]: payload}) as any); // eslint-disable-line
  }
}

export const changeServiceProp = new ChangeServiceProp();
