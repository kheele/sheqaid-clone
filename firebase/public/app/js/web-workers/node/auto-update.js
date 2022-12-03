
(() => {
    const log = self.require('electron-log');
    const {autoUpdater} = require("electron-updater");

    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = 'info';
    log.info('App starting...');

//    autoUpdater.on('checking-for-update', () => {
//        Events.emit('auto-update_checking-for-update', "");
//    });
//    autoUpdater.on('update-not-available', (evt, info) => {
//        Events.emit('auto-update_not-available', info);
//    });

    autoUpdater.on('update-available', (evt, info) => {
        Events.emit('auto-update_available', info);
    });
    autoUpdater.on('error', (evt, err) => {
        Events.emit('auto-update_error', err);
    });
    autoUpdater.on('download-progress', (progressObj) => {
        Events.emit('auto-update_download-progress', progressObj);
    });
    autoUpdater.on('update-downloaded', (evt, info) => {
        Events.emit('auto-update_downloaded', info);
        setTimeout(() => {
            autoUpdater.quitAndInstall();
        }, 1000);
    });

    Events.on('check-updates', async () => {
//        autoUpdater.checkForUpdates();
        autoUpdater.checkForUpdatesAndNotify();
        return true;
    });
})();