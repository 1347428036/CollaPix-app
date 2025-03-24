<template>
  <div id="user-register">
    <h2 class="title">{{$t("registerTitle")}}</h2>
    <a-form
      :rules="rules"
      :model="formState"
      name="normal_register"
      class="register-form"
      @finish="handleSubmit"
      @finishFailed="onFinishFailed"
    >
      <a-form-item name="userAccount">
        <a-input v-model:value="formState.userAccount" :placeholder="$t('registerAccountPlaceholder')">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="userPassword">
        <a-input-password
          v-model:value="formState.userPassword"
          :placeholder="$t('registerPasswordPlaceholder')"
        >
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="checkPassword">
        <a-input-password
          v-model:value="formState.checkPassword"
          :placeholder="$t('confirmPasswordPlaceholder')"
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
          {{$t("registerButtonText")}}
        </a-button>
      </a-form-item>
      <a-form-item>
        <div class="tips">
          <div>
            {{$t('haveAccount')}}
            <RouterLink to="/user/login">{{$t('login')}}</RouterLink>
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
import { useI18n } from 'vue-i18n'

const {t} = useI18n()
const userController = new UserControllerApi()
const formState = reactive<UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})
const rules: Record<string, Rule[]> = {
  userAccount: [
    { required: true, message: t('userAccountRequired'), trigger: 'blur' },
    { min: 6, message: t('userAccountMinLength'), trigger: 'blur' },
  ],
  userPassword: [
    { required: true, message: t('userPasswordRequired'), trigger: 'change' },
    { min: 8, message: t('userPasswordMinLength'), trigger: 'blur' },
  ],
  checkPassword: [
    { required: true, message: t('userPasswordRequired'), trigger: 'change' },
    { min: 8, message: t('userPasswordMinLength'), trigger: 'blur' },
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
      router.push({ path: '/user/login', replace: true })
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
