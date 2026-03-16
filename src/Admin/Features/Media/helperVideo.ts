export const booleanState = (st: boolean|string ):string=>{
    if(st===true ||st==='true'){
      return 'Activo'
    }else if(st===false ||st==='false'){
      return 'Bloqueado'
    }else{return 'Bloqueado'}
}