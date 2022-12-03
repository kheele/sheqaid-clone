
(() => {
    const isFunction = function ($this) {
        return $this instanceof Function || typeof $this === 'function';
    };
    
    if(!self.require || !isFunction(self.require)) {
        return;
    }
    const path = self.require('path');
//    const {argv}--app-path=
//    console.log(process.argv)
    const paths = [
        path.join(process.resourcesPath, 'app.asar'),
        path.join(process.resourcesPath, 'app.asar', 'node_modules'),
        path.join(process.resourcesPath, 'app', 'node_modules'), //when asar is disabled
        process.resourcesPath.replace(/electron[\\/]dist[\\/]resources/g, ''),
        process.resourcesPath.replace(/node_modules[\\/]electron[\\/]dist[\\/]resources/g, '')
    ];

    if(global.require.main) {
        paths.map((path) => {
            global.require.main.paths.push(path);
        });
    } else {
        paths.map((path) => {
            global.module.paths.push(path);
        });
    }
})();