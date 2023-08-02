'use strict';

const path = require('path');
//const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const MergeIntoSingle = require('webpack-merge-and-include-globally');
const uglifyJS = require('uglify-js');
const CopyPlugin = require('copy-webpack-plugin');

function WatchExternalFilesPlugin(workersPath) {
    WatchExternalFilesPlugin.prototype.apply = (compiler) => {
        compiler.plugin('after-compile', (compilation, callback) => {
            ['/controllers/', '/node/', '/*.js'].map(v => `${workersPath}${v}`).forEach(path => {
                compilation.contextDependencies.add(path);
//                console.log('WatchExternalFilesPlugin changed', path)
            });
//            console.log('WatchExternalFilesPlugin changed')
            callback();
        });
    };
}

module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';

//    const mainPath = path.resolve('public/js/web-workers/controllers/');
    const workersPath = 'src-public/js/web-workers';
    const controllersPath = workersPath + '/controllers';
    //console.log(workersPath, controllersPath)
    //return new MergeIntoSingleFilePlugin({
    return [
        isEnvDevelopment && new CopyPlugin({
            patterns: [
                { from: "./node_modules/@pdftron/webviewer/public", to: "./public/webviewer/lib" },
            ],
        }),,
//        new WatchExternalFilesPlugin({
//            files: [
//                './worker-contr/**/*.js',
//                '!./worker-contr.js'
//            ]
//        }),
        new WatchExternalFilesPlugin(workersPath),
        new MergeIntoSingle({
            files: [
                merge('worker-inline', workersPath),
                merge('worker-contr', workersPath),

                merge('worker-admin', controllersPath),
                merge('worker-defaults', controllersPath),
                merge('worker-funs', controllersPath),

                merge('worker-plugins_claim_management', controllersPath),
                merge('worker-plugins_extra', controllersPath),
                merge('worker-plugins_general', controllersPath),
                merge('worker-plugins_hr_management', controllersPath),
                merge('worker-plugins_sheq_assist', controllersPath),

                merge('worker-utils', workersPath),

                merge('firebase_client_app', workersPath)
            ]
        })
//        new MergeIntoSingle({
//            files: [
//                merge('worker-contr', workersPath),
//                
//                merge('worker-admin', controllersPath),
//                merge('worker-defaults', controllersPath),
//                merge('worker-funs', controllersPath),
//                
//                merge('worker-utils', workersPath)
//            ]
//        }),
//        new MergeIntoSingle({
//            files: [
//                merge('worker-plugins_claim_management', controllersPath),
//                merge('worker-plugins_extra', controllersPath),
//                merge('worker-plugins_general', controllersPath),
//                merge('worker-plugins_hr_management', controllersPath),
//                merge('worker-plugins_sheq_assist', controllersPath)
//            ]
//        })
    ];
};
//267

function merge(file, path) {
    return {
        src: require(`./${file}`)(path),
        dest: code => {
            const name = `./js/web-workers/${file}.js`;
            console.log('merge', name)
//
            let map;
            if (process.env.NODE_ENV !== 'development') {
                const min = uglifyJS.minify(code);
                code = min.code;
                map = min.map;
            }

            const res = {[name]: code};
            if (map) {
                res[name + '.map'] = map;
            }
            return res;
            //console.log('transform1', code)
//            const min = uglifyJS.minify(code);
//            //console.log('transform2', min)
//            const name = `${file}.js`;
//            return {
//                [name]: min.code//,
//                        //[name + '.map']: min.map
//            };
        }
    };
}