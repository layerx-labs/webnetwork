import {changeCurrentBounty} from "contexts/reducers/change-current-bounty";
import {changeLoad} from "contexts/reducers/change-load";
import {addReducer} from "contexts/reducers/main";
import {changeShowProp} from "contexts/reducers/update-show-prop";

let loaded = false;

export default function loadApplicationStateReducers() {
  if (loaded)
    return;

  [
    changeLoad,
    changeShowProp,
    changeCurrentBounty
  ].forEach(addReducer);

  loaded = true;
}
