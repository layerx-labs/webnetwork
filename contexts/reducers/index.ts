import {changeCurrentBounty} from "contexts/reducers/change-current-bounty";
import {changeCurrentUser} from "contexts/reducers/change-current-user";
import {changeLoad} from "contexts/reducers/change-load";
import {changeServiceProp} from "contexts/reducers/change-service";
import {changeSettings,} from "contexts/reducers/change-settings";
import {addReducer} from "contexts/reducers/main";
import {changeShowProp} from "contexts/reducers/update-show-prop";

let loaded = false;

export default function loadApplicationStateReducers() {
  if (loaded)
    return;

  [
    changeLoad,
    changeCurrentUser,
    changeShowProp,
    changeServiceProp,
    changeCurrentBounty,
    changeSettings
  ].forEach(addReducer);

  loaded = true;
}
