<template>
  <n-form style="
    margin-left: auto;
    margin-right: auto;
    width: 80%;             
    top: 50%;
    max-height: 80vh;
    max-width: 80vw;                      
"
  ref="formRef" :model="model" :rules="rules">
    <n-form-item style="--n-label-text-color:#00f9ec;" path="username" label="Имя">
      <n-input v-model:value="model.username" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item style="--n-label-text-color:#00f9ec;" path="email" label="Email">
      <n-input
        v-model:value="model.email"
        type="email"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item style="--n-label-text-color:#00f9ec;" path="password" label="Пароль">
      <n-input
        v-model:value="model.password"
        type="password"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-form-item
      ref="rPasswordFormItemRef"
      first
      path="password2"
      label="Повтор пароля"
      style="--n-label-text-color:#00f9ec;"
    >
      <n-input
        v-model:value="model.password2"
        :disabled="!model.password"
        type="password"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-row :gutter="[0, 24]">
      <n-col :span="24">
        <div style="display: flex; justify-content: flex-end">
          <n-button
            :disabled="model.username === null"
            round
            type="primary"
            @click="handleValidateButtonClick"
          >
            Регистрация
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>

<!-- <pre>{{ JSON.stringify(model, null, 2) }}
    {{result}}
</pre>
-->
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import {
  FormInst,
  FormItemInst,
  FormItemRule,
  FormValidationError,
  useMessage,
  FormRules
} from 'naive-ui'
import configs from '../../config.json'
import axios from 'axios'
import { useGlobalStore } from '../stores/GlobalStore'
import router from '../router'
import {ReqestMessage} from '../Errors'


interface ModelType {
  username: string | null
  email: string | null
  password: string | null
  password2: string | null
}

export default defineComponent({
  setup () {
    const formRef = ref<FormInst | null>(null)
    const rPasswordFormItemRef = ref<FormItemInst | null>(null)
    const message = useMessage()
    const site_= useGlobalStore()
    const site = computed(()=>site_.site)
    const modelRef = ref<ModelType>({
      username: null,
      email: null,
      password: null,
      password2: null
    })
    let result=ref(JSON.stringify(modelRef.value, null, 2))
    function validatePasswordStartWith (
      rule: FormItemRule,
      value: string
    ): boolean {
      return (
        !!modelRef.value.password &&
        modelRef.value.password.startsWith(value) &&
        modelRef.value.password.length >= value.length
      )
    }
    function validatePasswordSame (rule: FormItemRule, value: string): boolean {
      return value === modelRef.value.password
    }
    const rules: FormRules = {
      username: [
        {
          required: true,
          validator (rule: FormItemRule, value: string) {
            if (!value) {
              return new Error('Необходимо ввести имя')
            } else if (!
            /^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$/
            .test(value)) {
              return new Error('Используются недопустимые символы')
            } else if (value.length > 16) {
              return new Error('Имя не может быть длиннее 16 символов')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
      email:[
        {
            required: true,
            validator (rule: FormItemRule, value: string) {
            if (!
            /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/
            .test(value)) {
              return new Error('Ошибка в email')
            }
            return true
          },
          trigger: 'input'
        }
      ],

      password: [
        {
          required: true,
          
          validator (rule: FormItemRule, value: string) {
          if (!/^.{8,16}$$/.test(value)) {
            return new Error('Длина от 8 до 16 символов')
          }
          else if (!/^(?=.*[A-Z])(?=.*[a-z])([^]){8,16}$/
            .test(value)) {
              return new Error('Необходимы символы разного регистра')
            }
          else if (!/(?=.*\d)/.test(value)) {
            return new Error('Необходимы цифры')
          }
          else if (!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])([^\s]){8,16}$/.test(value)) {
          return new Error('Недопустимый пароль')
          }
          return true;
          }
          ,
          trigger: ['input', 'blur']
        }
      ],
      password2: [
        {
          required: true,
          message: 'Необходим повторный ввод пароля',
          trigger: ['input', 'blur']
        },
        {
          validator: validatePasswordStartWith,
          message: 'Пароли не совпадают',
          trigger: 'input'
        },
        {
          validator: validatePasswordSame,
          message: 'Пароли не совпадают',
          trigger: ['blur', 'password-input']
        }
      ]
    }
    function handleValidateButtonClick (e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate(
          (errors: Array<FormValidationError> | undefined) => {
            if (!errors) {
              axios({
                    method: 'post',
                    url: "/game/register/",
                    data: JSON.stringify(modelRef.value, null, 2),
                  }).then(response => {const result = JSON.stringify(response.data, null, 2);
                  localStorage.tokens = result
                  axios.defaults.headers.common['Authorization'] = "Bearer "+ response.data.access;
                  site_.SetUsername(modelRef.value.username);
                  //console.log(site.value)
                  //location.reload();
                  router.push('/')
                  }
                
              )
              .catch(function (error) {
                console.log(error)
                ReqestMessage(message,error);
              });
            } else {
              console.log(errors)
              message.error('Ошибка при заполнении')
            }
          }
        )
      }
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      result: result,
      rules,
      handleValidateButtonClick
    }
  }
})
</script>