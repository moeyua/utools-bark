
function send(url) {
    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function(){
    // 通信成功时，状态值为4
    if (xhr.readyState === 4){
        if (xhr.status === 200){
            console.log(xhr.responseText)
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
    console.log(keys);
    if (keys.length === 0) {
        window.utools.showNotification("请先去设置 key");
        return 0;
    } else{
        return keys[0].value;
    }
}

function getKeys() {
    let keys = window.utools.db.allDocs();
    if (keys.length === 0) {
        window.utools.showNotification("请先去设置 key");
    } else{
        let keysList = [];
        for (const key of keys) {
            keysList.push({
                title: key._id,
                description: key.value
            })
        }
        return keysList;
    }
}

window.exports = {
    "send": { // 注意：键对应的是 plugin.json 中的 features.code
       mode: "none",  // 用于无需 UI 显示，执行一些简单的代码
       args: {
          // 进入插件时调用
          enter: (action) => {
            // action = { code, type, payload }
             window.utools.hideMainWindow();
             let key = getKey();
             if (key !== 0) {
                let content = encodeURIComponent(action.payload);
                send(key + content);
                window.utools.showNotification("发送成功");
             }
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
                window.utools.hideMainWindow();
                window.utools.dbStorage.setItem("key", action.payload);
                window.utools.showNotification("key 已设置成功");
                window.utools.outPlugin();
            }
        } 
     },
     "delKey": {
         mode: "none",
         args: {
             enter: (action) => {
                window.utools.hideMainWindow();
                window.utools.dbStorage.removeItem("key");
                window.utools.showNotification("key 成功删除");
                window.utools.outPlugin();
             }
         }
     },
     "showKey": {
         mode: "list",
         args: {
            enter: (action, callbackSetList) => {
               // 如果进入插件就要显示列表数据
               callbackSetList( getKeys() );
            },
        }
     }
 }