import { getType } from "typesafe-actions";
import { DiscountBucketCode } from "../../../../../../definitions/cgn/merchants/DiscountBucketCode";
import { Action } from "../../../../../store/actions/types";
import { GlobalState } from "../../../../../store/reducers/types";
import { NetworkError } from "../../../../../utils/errors";
import {
  remoteError,
  remoteLoading,
  remoteReady,
  remoteUndefined,
  RemoteValue
} from "../../../bpd/model/RemoteValue";
import { cgnCodeFromBucket } from "../actions/bucket";

export type CgnBucketState = {
  data: RemoteValue<DiscountBucketCode, NetworkError>;
};

const INITIAL_STATE: CgnBucketState = {
  data: remoteUndefined
};

const reducer = (
  state: CgnBucketState = INITIAL_STATE,
  action: Action
): CgnBucketState => {
  switch (action.type) {
    case getType(cgnCodeFromBucket.request):
      return {
        ...state,
        data: remoteLoading
      };
    case getType(cgnCodeFromBucket.success):
      return {
        ...state,
        data: remoteReady(action.payload)
      };
    case getType(cgnCodeFromBucket.failure):
      return {
        ...state,
        data: remoteError(action.payload)
      };
  }
  return state;
};

export default reducer;

export const cgnBucketSelector = (state: GlobalState): CgnBucketState["data"] =>
  state.bonus.cgn.bucket.data;
