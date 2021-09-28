
function send(url) {
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function(){
    // 通信成功时，状态值为4
    if (xhr.readyState === 4){
        if (xhr.status === 200){
            console.log(xhr.responseText)
            window.utools.showNotification("发送成功")
        } else {
            console.log(xhr.statusText);
        }
    }
    };

    xhr.onerror = function (e) {
        console.log(xhr.statusText);
    };

    xhr.open('GET', url, true);
    xhr.send(null);
}


function getKey() {
    let keys = window.utools.db.allDocs();
    if (keys.length === 0) {
        window.utools.showMessageBox({
            type: 'warning',
            buttons: ['我知道了'],
            title: '警告',
            message: '还没有设置 key',
            defaultId: 0
          })
    } else{
        return keys[0].value;
    }
}

window.exports = {
    "send": { // 注意：键对应的是 plugin.json 中的 features.code
       mode: "none",  // 用于无需 UI 显示，执行一些简单的代码
       args: {
          // 进入插件时调用
          enter: (action) => {
            // action = { code, type, payload }
             window.utools.hideMainWindow()
             let key = getKey();
             let content = action.payload;
             send(key + content)
            window.utools.outPlugin();
          }
       } 
    },
    "setKey": { // 注意：键对应的是 plugin.json 中的 features.code
        mode: "none",  // 用于无需 UI 显示，执行一些简单的代码
        args: {
            // 进入插件时调用
            enter: (action) => {
                // action = { code, type, payload }
                window.utools.hideMainWindow()
                window.utools.dbStorage.setItem("key", action.payload)
                window.utools.outPlugin();
            }
        } 
     },
     "delKey": {
         mode: "none",
         args: {
             enter: (action) => {
                window.utools.dbStorage.removeItem("key")
             }
         }
     }
 }