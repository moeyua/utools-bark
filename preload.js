
function send(url) {
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function(){
    // 通信成功时，状态值为4
    if (xhr.readyState === 4){
        if (xhr.status === 200){
        console.log(xhr.responseText);
        } else {
        console.error(xhr.statusText);
        }
    }
    };

    xhr.onerror = function (e) {
    console.error(xhr.statusText);
    };

    xhr.open('GET', url, true);
    xhr.send(null);
}

// function setKey(id, key) {
//     utools.dbStorage.setItem(id, key)
// }

// function getKey(id) {
//     return utools.dbStorage.getItem(id)
// }

window.exports = {
    "bark": { // 注意：键对应的是 plugin.json 中的 features.code
       mode: "none",  // 用于无需 UI 显示，执行一些简单的代码
       args: {
          // 进入插件时调用
          enter: (action) => {
             // action = { code, type, payload }
             window.utools.hideMainWindow()
             var key = 'https://api.day.app/f8VKmJyepTSSq2dFUiYsDh/';
             var content = action.payload;
             send(key + content);
             window.utools.outPlugin();
          }  
       } 
    }
 }