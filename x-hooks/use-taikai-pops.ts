import {QueryKeys} from "../helpers/query-keys";
import {getTaikaiPops} from "./api/user/get-taikai-pops";
import useReactQuery from "./use-react-query";

export function useTaikaiPops(address: string) {
  return useReactQuery(QueryKeys.taikaiPops(address),
                       () => getTaikaiPops(address),
                       {enabled: !!address})
}