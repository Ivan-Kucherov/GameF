<template>
  <n-form style="
    margin-left: auto;
    margin-right: auto;
    width: 80%;             
    top: 50%;
    max-height: 80vh;
    max-width: 80vw;                     
" ref="formRef" :model="model" :rules="rules">
    <n-form-item style="--n-label-text-color:#00f9ec;" path="username" label="Имя">
      <n-input v-model:value="model.username" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item style="--n-label-text-color:#00f9ec;" path="password" label="Пароль">
      <n-input
        v-model:value="model.password"
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
             Вход
          </n-button>
        </div>
      </n-col>
    </n-row>
  </n-form>

 <!-- <pre>{{ JSON.stringify(model, null, 2) }}
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
import router from '../router/index'
import { useGlobalStore } from '../stores/GlobalStore'
import {ReqestMessage} from '../Errors'

interface ModelType {
  username: string | null
  password: string | null
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
      password: null
    })
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
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],

      password: [
        {
          required: true,
          
          validator (rule: FormItemRule, value: string) {
          if (!/^.{8,16}$$/.test(value)) {
            return new Error('Длина от 8 до 16 символов')
          }
          return true;
          }
          ,
          trigger: ['input', 'blur']
        }
      ],
    }
    function handleValidateButtonClick (e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate(
          (errors: Array<FormValidationError> | undefined) => {
            if (!errors) {
              axios.defaults.headers.common['Authorization'] = null;
              axios({
                    method: 'post',
                    url: "/game/login/",
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
      rules,
      handleValidateButtonClick,
      site
    }
  },
  data() {

    return {

    }
  },methods: {
  }

  ,created(){
    const site_= useGlobalStore()
    const site = computed(()=>site_.site)
    return {site}
  }

})


</script>