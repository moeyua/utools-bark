const utools = window.utools;
const dbStorage = utools.dbStorage;
let setting = [
    {
        key: 'key',
        value: 0
    },
    {
        key: 'pushTitle',
        value: 0
    },
    {
        key: 'autoCopy',
        value: 2
    },
    {
        key: 'sound',
        value: 0
    },
    {
        key: 'isArchive',
        value: 2
    },
    {
        key: 'icon',
        value: 0
    },
    {
        key: 'group',
        value: 0
    },
    {
        key: 'level',
        value: 'active'
    },
    {
        key: 'url',
        value: 0
    }
];
function send(url) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        // 通信成功时，状态值为4
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                utools.showNotification("发送成功\n" + xhr.responseText);
            } else {
                utools.showNotification("发送失败\n" + xhr.statusText);
            }
        }
    };

    xhr.onerror = function (e) {
        utools.showNotification("error:\n" + xhr.statusText);
    };

    xhr.open('GET', url, true);
    xhr.send(null);
}

// 获取当前 Key
function getKey() {
    let key = dbStorage.getItem('key');
    if (!key) {
        utools.showNotification("请先去设置 key");
        return 0;
    } else {
        return key;
    }
}

function generateUrl(message) {
    const db = utools.db.allDocs();
    let url = '';
    for (const iterator of db) {
        for(let i = 0; i < setting.length; i++) {
            if (setting[i].key === iterator._id) {
                setting[i].value = iterator.value;
            }
        }
    }
    // key / 标题 / 内容 / ？ / 
    url = setting[0].value + (setting[1].value?(setting[1].value + '/'):'') + message + '?'
    for (let i = 2; i < setting.length; i++) {
        if (setting[i].value) {
            url = url + setting[i].key + '=' + setting[i].value + '&'
        }
    }
    console.log(url)
    return url;
}

function translate(key) {
    let param = ['key','autoCopy','pushTitle','sound','isArchive','icon','group','level','badge','url','copy', 1, 2, 0];
    let title = ['设置key','自动复制推送内容到剪切板','推送标题','推送铃声','自动保存通知消息','自定义推送图标','推送消息分组','时效性通知','设置角标','URL Test','Copy Test','开启','关闭','没有设置'];
    console.log(key, param.indexOf(key))
    if (param.indexOf(key) !== -1) {
        return title[param.indexOf(key)];
    } else if (title.indexOf(key) !== -1) {
        return param[title.indexOf(key)];
    } else {
        return key;
    }
}

function initialize() {
    for (const option of setting) {
        if (!dbStorage.getItem(option.key)) {
            if (option.key === 'key') {            
                utools.showNotification("请设置 key");
            }
            dbStorage.setItem(option.key, option.value);
        }
    }
}

// 1 表示开启，2 表示关闭，0 表示没有
function handleSwitch(key) {
    let value = dbStorage.getItem(key);
    dbStorage.setItem(key, value === 2 ? 1 : 2);
    // console.log(key, dbStorage.getItem(key))
    return dbStorage.getItem(key);
}

window.exports = {
    "send": { // 注意：键对应的是 plugin.json 中的 features.code
        mode: "none",  // 用于无需 UI 显示，执行一些简单的代码
        args: {
            // 进入插件时调用
            enter: (action) => {
                // action = { code, type, payload }
                initialize();
                utools.hideMainWindow();
                let message = encodeURIComponent(action.payload);
                let url = generateUrl(message);
                send(url)
                utools.outPlugin();
            }
        }
    },
    "setting": {
        mode: "list",
        args: {
            enter: (action, callbackSetList) => {
                initialize();
                let settings = [];
                for (const iterator of utools.db.allDocs()) {
                    // console.log(iterator._id,iterator.value)
                    settings.push({ title: translate(iterator._id), description: translate(iterator.value) })
                }
                console.log(utools.db.allDocs());
                callbackSetList(settings);
            },
            select: (action, itemData, callbackSetList) => {
                // 分两种情况，切换状态或者自定义
                if (itemData.description === '开启' || itemData.description === '关闭') {
                    let res = handleSwitch(translate(itemData.title));
                    utools.showNotification(itemData.title + '当前为：' + translate(res) + '，页面将会在下次打开时刷新配置');
                } else {
                    utools.setSubInput(({ text }) => {
                        if (text === '0') {
                            text = 0;
                        }                       
                        // utools.showNotification(text)
                        dbStorage.setItem(translate(itemData.title), text)
                    }, '请输入' + itemData.title)
                }
            },
        }
    }
}