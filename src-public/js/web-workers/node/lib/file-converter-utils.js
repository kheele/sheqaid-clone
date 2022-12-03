
((self) => {
    const isWebWorker = !!self.require && isFunction(self.require);
    if (isWebWorker) {
    const os = self.require('os');
    const fs = self.require("fs-extra");
    const path = self.require('path');
    const exec = self.require('child_process').execFile;

    const http = self.require('http');
    const https = self.require('https');
    
    self.fileConverterUtils = {
        wordToPDFOnline: async (sourceUrl, options = {recursive: false, deleteOriginal: true}) => {
            if (!sourceUrl)
                return Promise.reject('No source file supplied.');

            const appDir = path.join("ExtraApps");
            fs.ensureDirSync(appDir);

            const date = new Date();
            // Make sure the output directory is there.
            const dir = path.join(os.homedir(), "Documents", "SHEQAid/PreviewWord-Docs", Dates.formatDate(date));
            fs.ensureDirSync(dir);
            const source = path.join(dir, date.getTime() + '.docx');
            const output = path.join(dir, date.getTime() + '.pdf');
//            console.log('wordToPDFOnline1', source, output, options);
            const args = ['-f', source, '-O', output, '-T', 'wdFormatPDF'];

            const {locationRoot} = self;
            let transport;
            if (locationRoot.contains('localhost') || !locationRoot.startsWith('https://')) {
                transport = http;
            } else if (locationRoot.startsWith('https://')) {
                transport = https;
            }
            const command = `${path.join(appDir, 'docto.exe')}`;
            if (!fs.existsSync(command)) {
//                console.log('wordToPDFOnline dl', command);
                await new Promise((resolve, reject) => {
                    transport.get(self.locationRoot + "/js/web-workers/node/lib/docto.exe", res => {
//                        console.log('dl', res)
                        res.pipe(fs.createWriteStream(command));
                        resolve();
                    });
                });
            }
            await new Promise((resolve, reject) => {
                transport = sourceUrl.startsWith('https://') ? https : http;
//                console.log('sourceUrl', sourceUrl)
                transport.get(sourceUrl, res => {
//                    console.log('dl source', res)
                    res.pipe(fs.createWriteStream(source));
                    resolve();
                });
            });
//            console.log('wordToPDFOnline dl done', fs.existsSync(command));

            if (options.recursive)
                args.push('-OX', '.pdf');
            if (options.deleteOriginal)
                args.push('-R', 'true');

//            console.log('wordToPDFOnline2', command);
//            console.log('wordToPDFOnline3', args);
            return new Promise((resolve, reject) => {
                exec(command, args, (error, stdout, stderr) => {
//                    console.log('wordToPDFOnline4', error, stdout, stderr);
                    if (error) {
                        reject({error, stderr});
                    } else {
                        const res = fileUtils.toDataURI(output);
                        fs.remove(source, err => {
//                        fs.remove(output, err => {
//                            console.log('err', err)
                            resolve(res);
//                        });
                        });
                    }
                });
            });
        },
        wordToPDF: async (source, output, options = {recursive: false, deleteOriginal: false}) => {
            if (!source)
                return Promise.reject('No source file supplied.');
            if (!output)
                return Promise.reject('No output file supplied.');

//            console.log('wordToPDF1', source, output, options);
            const args = ['-f', source, '-O', output, '-T', 'wdFormatPDF'];

            const appDir = path.join("ExtraApps");
            fs.ensureDirSync(appDir);

            const command = `${path.join(appDir, 'docto.exe')}`;
            if (!fs.existsSync(command)) {
                console.log('wordToPDF dl', command);
                await new Promise((resolve, reject) => {
                    http.get(self.locationRoot + "/js/web-workers/node/lib/docto.exe", res => {
                        console.log('dl', res)
                        res.pipe(fs.createWriteStream(command));
                        resolve();
                    });
                });
                console.log('wordToPDF dl done', fs.existsSync(command));
            }

            if (options.recursive)
                args.push('-OX', '.pdf');
            if (options.deleteOriginal)
                args.push('-R', 'true');

            console.log('wordToPDF2', command);
            console.log('wordToPDF3', args);
            return new Promise((resolve, reject) => {
                exec(command, args, (error, stdout, stderr) => {
                    console.log('wordToPDF4', error, stdout, stderr);
                    if (error) {
                        reject({error, stderr});
                    } else {
                        resolve(output);
                    }
                });
            });
        },
        excelToPDF: async (source, output, options = {recursive: false, deleteOriginal: false}) => {
            if (!source)
                return Promise.reject('No source file supplied.');
            if (!output)
                return Promise.reject('No output file supplied.');

//            console.log('wordToPDF1', source, output, options);
            const args = ['-f', '-XL', source, '-O', output, '-T', 'xlpdf'];

            const appDir = path.join("ExtraApps");
            fs.ensureDirSync(appDir);

            const command = `${path.join(appDir, 'docto.exe')}`;
            if (!fs.existsSync(command)) {
                console.log('excelToPDF dl', command);
                await new Promise((resolve, reject) => {
                    http.get(self.locationRoot + "/js/web-workers/node/lib/docto.exe", res => {
                        console.log('dl', res)
                        res.pipe(fs.createWriteStream(command));
                        resolve();
                    });
                });
                console.log('excelToPDF dl done', fs.existsSync(command));
            }

            if (options.recursive)
                args.push('-OX', '.pdf');
            if (options.deleteOriginal)
                args.push('-R', 'true');

            console.log('excelToPDF2', command);
            console.log('excelToPDF3', args);
            return new Promise((resolve, reject) => {
                exec(command, args, (error, stdout, stderr) => {
                    console.log('excelToPDF4', error, stdout, stderr);
                    if (error) {
                        reject({error, stderr});
                    } else {
                        resolve(output);
                    }
                });
            });
        }
    };

    Events.on("wordToPDFOnline", async (db, sourceUrl, options) => {
        return await self.fileConverterUtils.wordToPDFOnline(sourceUrl, options);
    });
    Events.on("wordToPDF", async (db, source, output, options) => {
        return await self.fileConverterUtils.wordToPDF(source, output, options);
    });
    Events.on("excelToPDF", async (db, source, output, options) => {
        return await self.fileConverterUtils.excelToPDF(source, output, options);
    });
}
})(typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this);