import { reactive } from "vue";
import { createGlobalState } from "@vueuse/core";
import _ from "lodash";
import { userInfoApi } from "@/services/apis";
import type { BaseUserInfo } from "@/types/user";

interface AppStateInfo {
  userInfo: BaseUserInfo | null;
}

export const useAppStateStore = createGlobalState(() => {
  const { execute: reqUserInfo } = userInfoApi();

  const state: AppStateInfo = reactive<AppStateInfo>({
    userInfo: null
  });

  const cloneState = (): AppStateInfo => {
    const tmp = _.cloneDeep(state);
    return reactive(tmp);
  };

  const updateUserInfo = async (userInfo?: BaseUserInfo) => {
    if (userInfo) {
      state.userInfo = userInfo;
    } else {
      const info = await reqUserInfo();
      if (info.value) {
        state.userInfo = info.value;
      } else {
        throw new Error("Failed to get user information from server!");
      }
    }
  };

  return {
    cloneState,
    updateUserInfo,
    state
  };
});