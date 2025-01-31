<template>
  <div id="user-register">
    <h2 class="title">Welcome to CloudPicture</h2>
    <a-form
      :rules="rules"
      :model="formState"
      name="normal_register"
      class="register-form"
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
        >
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="checkPassword">
        <a-input-password
          v-model:value="formState.checkPassword"
          placeholder="Please input your confirm password"
        >
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-button
          :disabled="disabled"
          type="primary"
          html-type="submit"
          class="register-form-button"
        >
          Log in
        </a-button>
      </a-form-item>
      <a-form-item>
        <div class="tips">
          <div>
            Have account?
            <RouterLink to="/user/login">Login</RouterLink>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { UserControllerApi, type UserRegisterRequest } from '@/api/api'
import type { Rule } from 'ant-design-vue/es/form'
import router from '@/router'
import { message } from 'ant-design-vue'

const userController = new UserControllerApi()
const formState = reactive<UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
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
  checkPassword: [
    { required: true, message: 'Please input your password!', trigger: 'change' },
    { min: 8, message: 'Confirm password must be at least 8 characters', trigger: 'blur' },
  ],
}
const handleSubmit = (request: UserRegisterRequest) => {
  if (request.userPassword !== request.checkPassword) {
    message.error('Password and confirm password do not match')
    return
  }
  userController.userRegister(request).then((res) => {
    if (res) {
      message.success('register Success')
      router.push({ path: '/', replace: true })
      return
    }
    message.error('Register Failed')
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
#user-register {
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

.register-form-button {
  width: 100%;
}
#components-form-demo-normal-register .register-form {
  max-width: 300px;
}
#components-form-demo-normal-register .register-form-forgot {
  float: right;
}
#components-form-demo-normal-register .register-form-button {
  width: 100%;
}
</style>
