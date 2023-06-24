import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  let infoRea = reactive({});
  let tokenRef = ref('');

  let isLogin = computed(() => {
    return !!tokenRef.value;
  });

  let setInfo = ({ token, info }) => {
    infoRea = info;
    tokenRef.value = token;
  }
  let clearInfo = () => {
    infoRea = reactive({});
    tokenRef.value = '';
  }

  return {
    infoRea,
    tokenRef,
    isLogin,
    setInfo,
    clearInfo
  }
});
