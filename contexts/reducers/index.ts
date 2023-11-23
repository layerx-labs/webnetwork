import {changeCurrentBounty} from "contexts/reducers/change-current-bounty";
import {changeLoad} from "contexts/reducers/change-load";
import {changeSettings,} from "contexts/reducers/change-settings";
import {addReducer} from "contexts/reducers/main";
import {changeShowProp} from "contexts/reducers/update-show-prop";

let loaded = false;

export default function loadApplicationStateReducers() {
  if (loaded)
    return;

  [
    changeLoad,
    changeShowProp,
    changeCurrentBounty,
    changeSettings
  ].forEach(addReducer);

  loaded = true;
}
