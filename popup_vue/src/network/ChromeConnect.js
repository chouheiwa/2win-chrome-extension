
const chrome = window.chrome;

const openTab = () => {
    chrome.tabs.create({
        url: 'https://wd.jtexpress.com.cn/login'
    });
}

const wakeUp = () => {
    try {
        chrome.runtime.sendMessage({
            from: 'popup',
            type: 'wakeup',
            data: {}
        });
    } catch (e) {

    }
}

export default {
    openTab,
    wakeUp
}