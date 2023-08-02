import {isWeb} from './Utils';

if (!isWeb()) {
    const {Menu, BrowserWindow} = electronRemote;

    const {webContents} = electronRemote.getCurrentWindow();

    const isMac = process.platform === 'darwin';

    const createMenu = (devTools) => {
        const template = [
            // { role: 'fileMenu' }
            {
                label: 'File',
                submenu: [
                    isMac ? {role: 'close'} : {role: 'quit'}
                ]
            },
            // { role: 'viewMenu' }
            {
                label: 'View',
                submenu: [
                    {role: 'reload'},
                    {role: 'forceReload'},
                    ...(isPackagedElectron ? [] : [{role: 'toggleDevTools'}]),
                    {type: 'separator'},
                    {role: 'resetZoom'},
                    {role: 'zoomIn'},
                    {role: 'zoomOut'},
                    {type: 'separator'},
                    {role: 'togglefullscreen'}
                ]
            },
            // { role: 'windowMenu' }
            {
                label: 'Window',
                submenu: [
                    {role: 'minimize'},
//            {role: 'zoom'},
                    ...(isMac ? [
                        {type: 'separator'},
                        {role: 'front'},
                        {type: 'separator'},
                        {role: 'window'}
                    ] : [
                        {role: 'close'}
                    ])
                ]
            }
        ];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    };

    createMenu();
}