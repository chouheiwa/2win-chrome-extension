function job() {
    setInterval(() => {
        chrome.runtime.sendMessage({
            from: 'content',
            type: 'authToken',
            data: localStorage.getItem("YL_TOKEN")
        });
    },1000);
}
job();
// content_script.js

