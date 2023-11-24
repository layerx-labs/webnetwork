import {changeLoad} from "contexts/reducers/change-load";
import {addReducer} from "contexts/reducers/main";
import {changeShowProp} from "contexts/reducers/update-show-prop";

let loaded = false;

export default function loadApplicationStateReducers() {
  if (loaded)
    return;

  [
    changeLoad,
  ].forEach(addReducer);

  loaded = true;
}
