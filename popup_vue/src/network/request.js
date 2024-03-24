export default (path, init) => {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({
            from: 'popup',
            type: 'dataFetch',
            data: {
                path, init
            }
        }, (response) => {
            resolve(response);
        });
    });
}