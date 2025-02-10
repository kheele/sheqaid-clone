import docxConverter from 'docx-pdf';

window.wordToPDF = async (source, output) => {
    if (!source)
        return Promise.reject('No source file supplied.');
    if (!output)
        return Promise.reject('No output file supplied.');

    return new Promise((resolve, reject) => {
        docxConverter(source, output, function (err, res) {
            if (err) {
                reject(err);
                console.log(err);
            } else {
                resolve(res);
            }
            console.log('result' + res);
        });
    });
};

export default {};
