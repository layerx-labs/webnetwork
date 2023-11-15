import {changeChain} from "contexts/reducers/change-chain";
import {changeCurrentBounty} from "contexts/reducers/change-current-bounty";
import {changeCurrentUser} from "contexts/reducers/change-current-user";
import {changeLoad} from "contexts/reducers/change-load";
import {changeNetwork, changeServiceProp} from "contexts/reducers/change-service";
import {changeSettings,} from "contexts/reducers/change-settings";
import {changeSupportedChains} from "contexts/reducers/change-supported-chains";
import {addReducer} from "contexts/reducers/main";
import {changeShowProp} from "contexts/reducers/update-show-prop";

let loaded = false;

export default function loadApplicationStateReducers() {
  if (loaded)
    return;

  [
    changeLoad,
    changeCurrentUser,
    changeChain,
    changeShowProp,
    changeServiceProp,
    changeNetwork,
    changeCurrentBounty,
    changeSettings,
    changeSupportedChains
  ].forEach(addReducer);

  loaded = true;
}
