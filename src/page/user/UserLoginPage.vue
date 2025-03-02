<template>
  <div id="user-login">
    <h2 class="title">Welcome to CloudPicture</h2>
    <a-form
      :rules="rules"
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="handleSubmit"
      @finishFailed="onFinishFailed"
    >
      <a-form-item name="userAccount">
        <a-input v-model:value="formState.userAccount" placeholder="Please input your account">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="userPassword">
        <a-input-password
          v-model:value="formState.userPassword"
          placeholder="Please input your password"
          autocomplete="true"
        >
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <div class="tips">
          <div>
            No account?
            <RouterLink to="/user/register">register now!</RouterLink>
          </div>
          <a class="login-form-forgot" href="">Forgot password</a>
        </div>
      </a-form-item>

      <a-form-item>
        <a-button :disabled="disabled" type="primary" html-type="submit" class="login-form-button">
          Log in
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { type LoginUserVo, type UserLoginRequest } from '@/api/api'
import type { Rule } from 'ant-design-vue/es/form'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import router from '@/router'
import { message } from 'ant-design-vue'
import { userController } from '@/api/apiFactory'

const loginUserStore = useLoginUserStore()
const formState = reactive<UserLoginRequest>({
  userAccount: '',
  userPassword: '',
})
const rules: Record<string, Rule[]> = {
  userAccount: [
    { required: true, message: 'Please input your account!' },
    { min: 6, message: 'Account must be at least 6 characters', trigger: 'blur' },
  ],
  userPassword: [
    { required: true, message: 'Please input your password!', trigger: 'change' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' },
  ],
}
const handleSubmit = (values: UserLoginRequest) => {
  userController.userLogin(values).then((res) => {
    if (res) {
      loginUserStore.setLoginUser(res as LoginUserVo)
      message.success('Login Success')
      router.push({ path: '/', replace: true })
    }
  })
}

const onFinishFailed = (errorInfo: never) => {
  console.log('Failed:', errorInfo)
}
const disabled = computed(() => {
  return !(formState.userAccount && formState.userPassword)
})
</script>

<style scoped>
#user-login {
  width: 22.5rem;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 1rem;
}

.tips {
  color: #bbb;
  text-align: right;
  font-size: 0.9rem;
}

.login-form-button {
  width: 100%;
}
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
