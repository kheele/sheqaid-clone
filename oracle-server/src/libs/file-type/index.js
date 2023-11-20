exports.fileTypeFromBuffer = (data) => {
    return socketConvertBinary.emit('emit', {
        path: 'convert',
        data,
    }).catch(err => {
        console.error('fileTypeFromBuffer', err)
        throw err;
    });
};