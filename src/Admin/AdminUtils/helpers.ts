export const booleanState = (st: string | boolean): string =>{
    if(st===true ||st==='true'){
      return 'Activo'
    }else if(st===false ||st==='false'){
      return 'Bloqueado'
    }else{return 'Bloqueado'}
}
type BannedResponse = {
  styleButton:string
  title: string
}
export const banned = (enabled: boolean):BannedResponse => {
  let styleButton = "btn btn-sm btn-outline-danger ms-3";
  let title = "Esperando...";
  if(enabled === true){
    styleButton= "btn btn-sm btn-outline-danger ms-3",
    title = "Bloquear"
  }else{
    styleButton = "btn btn-sm btn-outline-info ms-3",
    title = "Habilitar"
  }
  return {
    styleButton,
    title
  }
}
export const showButton = (v: string|undefined):boolean => {
  if(!v || v === undefined) return false
  if(v==='ADMIN'){
    return true
  }return false
}
