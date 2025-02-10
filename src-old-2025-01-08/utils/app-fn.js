import "./UtilsFuns";

navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || 
        navigator.mozGetUserMedia || 
        navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

if(isPackagedElectron) {
//if(isPackagedElectron || isWeb()) {TODO: uncomment for production
    if(!window.console) window.console = {};
    const methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    for(let i=0; i < methods.length; i++){
        const key = methods[i];
        console[key] = () => {
            if(key === 'error') {
                //TODO: send to server
            }
        };
    }
}