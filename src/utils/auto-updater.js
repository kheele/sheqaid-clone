import {isWeb} from './Utils';

if (!isWeb()) {
    autoUpdater.on('checking-for-update', () => {
        console.log('autoUpdater', 'checking-for-update')
//    ipcMainEvents.emit('auto-update_checking-for-update', "");
    });
    autoUpdater.on('update-available', (evt, info) => {
        console.log('autoUpdater', 'update-available', info)
//    ipcMainEvents.emit('auto-update_available', info);
    });
    autoUpdater.on('update-not-available', (evt, info) => {
        console.log('autoUpdater', 'update-not-available', info)
//    ipcMainEvents.emit('auto-update_not-available', info);
    });
    autoUpdater.on('error', (evt, err) => {
        console.error('autoUpdater', 'error', err)
//    ipcMainEvents.emit('auto-update_error', err);
    });
    autoUpdater.on('download-progress', (progressObj) => {
        console.log('autoUpdater', 'download-progress', progressObj)
//    ipcMainEvents.emit('auto-update_download-progress', progressObj);
    });
    autoUpdater.on('update-downloaded', (evt, info) => {
        console.log('autoUpdater', 'update-downloaded', info)
//    ipcMainEvents.emit('auto-update_downloaded', info);
//    setTimeout(function () {
//        autoUpdater.quitAndInstall();
//    }, 1000);
    });

//ipcMainEvents.on('check-updates', async () => {
////        autoUpdater.checkForUpdates();
//    autoUpdater.checkForUpdatesAndNotify();
//    return true;
//});
}