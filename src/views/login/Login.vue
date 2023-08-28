<script setup>
import { onMounted, ref, toRaw } from 'vue';
import { ElMessage } from 'element-plus';
import useStore from 'store'
import { useRoute, useRouter } from 'vue-router';
import { userLogin } from 'api/user.js';

const usernameInput = ref(null);
const passwordInput = ref(null);
onMounted(() => {
  usernameInput.value.focus()
});

const route = useRoute();
const router = useRouter();
let redirect = route.query.redirect ?? '/';

let usernameRef = ref('');
let passwordRef = ref('');
let loadingRef = ref(false)

let login = () => {
  loadingRef.value = true
  if (!!!usernameRef.value) {
    loadingRef.value = false
    usernameInput.value.focus()
    return ElMessage.warning("请输入用户名");
  }
  if (!!!passwordRef.value) {
    loadingRef.value = false
    passwordInput.value.focus()
    return ElMessage.warning("请输入密码");
  }
  userLogin(usernameRef.value, passwordRef.value).then(res => {
    useStore().user.setInfo(res.data);
    router.replace(redirect);
  }).finally(() => {
    loadingRef.value = false
  });
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="header">
        <p>雅链后台管理系统</p>
      </div>
      <div class="contain">
        <el-input ref="usernameInput" placeholder="请输入用户名" v-model.trim="usernameRef" clearable
                  @keyup.enter="login"></el-input>
        <el-input ref="passwordInput" placeholder="请输入密码" v-model.trim="passwordRef" show-password clearable
                  @keyup.enter="login"></el-input>
      </div>
      <div class="footer">
        <el-button v-no-more-click="{interval:10}" v-loading="loadingRef" type="primary" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100%;
  background-color: #eee;

  > .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 360px;
    height: 360px;
    background-color: #fff;
    border-radius: 8px;

    > .header {
      margin-bottom: 1rem;
      font-size: 24px;
    }

    > .contain {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1rem 0;
      width: calc(100% - 1rem * 2);

      .el-input {
        border-bottom: 1px solid var(--el-border-color);
      }

      :deep(.el-input__wrapper) {
        box-shadow: none !important;
      }
    }

    > .footer {
      align-self: self-end;
      margin-right: 1rem;
    }
  }
}
</style>