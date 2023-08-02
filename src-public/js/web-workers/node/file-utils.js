// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

((self) => {
	const isWebWorker = !!self.require && isFunction(self.require);

	let os, path, fs, mime, request;
	if (isWebWorker) {
		os = self.require('os');
		path = self.require('path');
		fs = self.require('fs-extra');
		mime = self.require('mime');
		request = self.require('request');
	}

	// <editor-fold defaultstate="collapsed" desc="fileUtils. Click on the + sign on the left to edit the code.">
	self.fileUtils = {
		toArrayBuffer: async function (filePath) {
			if (filePath instanceof File) {
				return await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsArrayBuffer(filePath);
					reader.onload = function () {
						resolve(reader.result);
					};
					reader.onerror = function (err) {
						console.error(err);
						reject(err);
					};
				});
			}
			if (isWebWorker) {
				try {
					const raw = fs.readFileSync(filePath);
					return raw.buffer;
				} catch (e) {
					return new Promise((resolve, reject) => {
						function binaryStringToArrayBuffer(binaryString) {
//                    const binaryString = window.atob(base64); // Comment this if not using base64
							let bytes = new Uint8Array(binaryString.length);
//                    bytes = bytes.map((byte, i) => binaryString.charCodeAt(i));
							const buffer = new ArrayBuffer(bytes.length);
							bytes.map((b, i) => buffer[i] = binaryString.charCodeAt(i));
							return buffer;
						}

						request.get(filePath, function (err, res, body) {
							if (err) {
								reject(err);
							} else if (res.statusCode === 200) {
								const buffer = binaryStringToArrayBuffer(body);
								resolve(buffer);
							} else {
								reject(new Error('Error reading url[' + filePath + '] (' + res.statusCode + ')'));
							}
						});
					});
				}
			}
		},

		toUint8Array: async function (filePath) {
			if (filePath instanceof File) {
				return await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(filePath);
					reader.onload = function () {
						const array = new Uint8Array(reader.result);
						resolve(array);
					};
					reader.onerror = function (err) {
						console.error(err);
						reject(err);
					};
				});
			}
			if (isWebWorker) {
				const raw = fs.readFileSync(filePath);
				return new Uint8Array(raw);
			}
		},

		toFile: async function (filePath) {
			if (filePath instanceof File) {
				return filePath;
			}
			if (isWebWorker) {
				const raw = fs.readFileSync(filePath);
				const arrayBuffer = raw.buffer;
				let name = this.getFileName(filePath);
				return new File([arrayBuffer], name, {type: mime.getType(filePath), path: filePath});
			}
		},

		toBlob: async function (filePath) {
			if (filePath instanceof File) {
				return await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsArrayBuffer(filePath);
					reader.onload = function () {
						const blob = new Blob([reader.result], { type: filePath.type });
						resolve(blob);
					};
					reader.onerror = function (err) {
						console.error(err);
						reject(err);
					};
				});
			}
			if (isWebWorker) {
				const raw = fs.readFileSync(filePath);
				const arrayBuffer = raw.buffer;
				return new Blob([arrayBuffer], {type: mime.getType(filePath)});
			}
		},

		toDataURI: async function (filePath) {
			if (filePath instanceof File) {
				return await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(filePath);
					reader.onload = function () {
						resolve(reader.result);//base64encoded string
					};
					reader.onerror = function (err) {
						console.error(err);
						reject(err);
					};
				});
			}
			if (isWebWorker) {
				const raw = fs.readFileSync(filePath);
				const arrayBuffer = raw.buffer;
				return `data:${mime.getType(filePath)};base64,${raw.toString('base64')}`;
			}
		},

		getMimeType: function (filePath) {
			if (filePath instanceof File) {
				return filePath.type;
			} else if (isWebWorker) {
				return mime.getType(filePath);
			}
		},

		getFileName: function (filePath) {
			if (filePath instanceof File) {
				return filePath.name;
			} else {
				return filePath.split('\\').pop().split('/').pop();
			}
		},

		getExtension: function (filePath) {
			const getExt = val => {
//            console.log('getExtension', val.substring(val.lastIndexOf('.') + 1, val.length))
				return val.substring(val.lastIndexOf('.') + 1, val.length) || val;
			};
			if (filePath instanceof File) {
				return getExt(filePath.name);
			}
			if (!filePath.contains('.')) {
				return filePath.split('/').pop();
			}
			return getExt(filePath);
		}
	};
	// </editor-fold>

	if (isWebWorker) {
		const dir = path.join(os.homedir(), 'AppData', 'Roaming', 'SheqAid');
		console.log(dir);

		Events.on("delete-all-cache", async db => {
			console.log('delete-all-cache', dir);
			return await new Promise((resolve, reject) => {
				fs.remove(dir, () => {
					console.log('delete-all-cache', dir, 'done!');
					resolve();
				});
			});
		});
		Events.on("open-dev-tools", async () => {
			console.log('open-dev-tools');
			return true;
//            const _5min = FBSettings.Timestamp.fromMillis(FBSettings.Timestamp.now().toMillis() + 10000);
//            const col_ref = await db2.collection('open-dev-tools').
//                    where('open', '==', true).
//                    where('updated_at', '<=', _5min).limit(1);
//            const snapshot = await col_ref.get();
//            return !snapshot.empty;
		});
		Events.on("file-utils", async (evt, fnName, path) => {
			console.log(evt, fnName, path);
			const fn = fileUtils[fnName];
			if (fn) {
				return fn(path);
			}
		});
	}
})(typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this);