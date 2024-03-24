let data = {
    token: ''
}

// 读取数据
chrome.storage.sync.get('token', function ({token}) {
    data.token = token;
});

const baseUrl = 'https://wdgw.jtexpress.com.cn'
const dataFetch = async ({path, init}, sendResponse, token) => {
    try {
        init = init || {};

        const response = await fetch(`${baseUrl}/${path}`, {
            ...init,
            headers: {
                ...init.headers ?? {},
                'Authtoken': token
            },
        });
        sendResponse(await response.json());
    } catch (error) {
        sendResponse(error);
    }
}

const wakeup = async () => {
    console.log('wake up')
}

const PopupListener = {
    dataFetch,
    wakeup
}

const baseFunction = async (message, sender, sendResponse) => {
    if (message.from === 'popup') {

        await PopupListener[message.type](message.data, sendResponse, data.token);
    }
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.from === 'content') {
        if (message.type === 'authToken') {
            chrome.storage.sync.set({token: data.token});
            data.token = message.data;
        }
        return false;
    }

    baseFunction(message, sender, sendResponse);

    return true;
});