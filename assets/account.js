// Same-origin API when deployed behind the backend reverse proxy.
// GitHub Pages remains a local-only demo until an API deployment is configured.
const apiBase=window.READ60_API_BASE ?? (location.hostname.endsWith('github.io')?null:'/api');
let currentUser=null,csrfToken='';
async function api(path,{method='GET',body,form=false}={}){
 if(!apiBase)throw Error('Вход появится после подключения сервера. Пока доска сохраняется в браузере.');
 if(method!=='GET'&&!csrfToken){const response=await fetch(apiBase+'/auth/csrf',{credentials:'include'});if(!response.ok)throw Error('Сервер недоступен');csrfToken=(await response.json()).token;}
 const response=await fetch(apiBase+path,{method,credentials:'include',headers:{...(method!=='GET'?{'X-CSRF-TOKEN':csrfToken}:{}),...(body?{'Content-Type':form?'application/x-www-form-urlencoded':'application/json'}:{})},body:body?(form?new URLSearchParams(body):JSON.stringify(body)):undefined});
 if(!response.ok){if(response.status===403)csrfToken='';throw Error(response.status===401?'Войди в аккаунт или проверь email и пароль.':response.status===429?'Слишком много попыток. Подожди минуту.':response.status===409?'Этот email уже зарегистрирован.':response.status===400?'Проверь поля формы. Пароль — от 12 символов, не более 72 байт.':'Не удалось сохранить изменения. Попробуй ещё раз.');}
 const text=await response.text();return text?JSON.parse(text):null;
}
