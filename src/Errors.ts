import { MessageApi } from "naive-ui"

export function ReqestMessage(message:MessageApi,error:any){
    console.log(error.code)
    if (error.code == 'ERR_NETWORK')
        {message.error('Потеряна связь с сервером')}
    else if (error.response.status == 500)
        {message.error('Ошибка сервера')}
    else if (error.response.status == 409)
        {message.error('Данное имя занято')}
    else 
        {message.error('Неизвестная ошибка')}
}

