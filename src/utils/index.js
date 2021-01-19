export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

// 随机创建用户id
export function createUid(){
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3)
  return idStr
}


