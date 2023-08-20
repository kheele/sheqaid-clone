const mime = require('mime');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const thumbsupply = require('thumbsupply');

exports.video = async (data) => {
    if (!data) {
        return null;
    }

    const {videoUrl} = data;

    return thumbsupply.generateThumbnail(videoUrl).then(thumb => {
        console.log('thumbsupply video, thumb', thumb)
        return thumb;
    });
};

exports.image = async (data) => {
    if (!data) {
        return null;
    }

    const {folder, fileName, sheetName, columns, rows} = data;

//     const date = new Date();
//     const dir = path.join(os.homedir(), "Documents", "SHEQAid", folder, fileName, Dates.formatDate(date));
//
//     // Make sure the output directory is there.
//     fs.ensureDirSync(dir);
//     const options = {
//         filename: path.join(dir, fileName),
//         useStyles: true,
//         useSharedStrings: true
//     };
//
//     const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
//     workbook.creator = 'SHEQ Aid';
//     workbook.lastModifiedBy = 'SHEQ Aid';
//     workbook.created = new Date();
//     workbook.modified = new Date();
//     workbook.lastPrinted = new Date();
// //    workbook.properties.date1904 = true;
// //    workbook.calcProperties.fullCalcOnLoad = true;

//     const worksheet = workbook.addWorksheet(sheetName, {properties: {tabColor: {argb: 'FFC0000'}}});
//     worksheet.columns = columns;
//     const header = worksheet.getRow(1);
//     header.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: {argb: 'cccccc'}
//     };
//
//     const lastCell = header.getCell(columns.length - 1);
//     worksheet.autoFilter = `A1:${lastCell.address}`;
//
//     rows.forEach((row, n) => {
// //                if (row.addImage) {
// //                    const image = row.addImage();
// //                    const imageId = workbook.addImage(image.file);
// //                    const col = columns.find(col => col.key === image.col);
// //                    const colIdx = columns.indexOf(col);
// //                    worksheet.addImage(imageId, {
// //                        tl: {col: colIdx, row: n},
// //                        ext: {width: 100, height: 100}
// //                    });
// //                    console.log('image', image, col, colIdx, n)
// ////                    worksheet.addRow(row).commit();
// //                } else {
//         worksheet.addRow(row).commit();
// //                }
//     });
//
//     worksheet.commit();

    return createExcelFileSheets({folder, fileName, sheets: [{sheetName, columns, rows}]});

    // await workbook.commit();
    //
    // const {filename} = options;
    // //read then file then delete it
    // const base64 = fs.readFileSync(filename, {encoding: 'base64'});
    // const dataUri = `data:${mime.getType(filename)};base64,${base64}`;
    // deleteTmpFile(filename);
    //
    // return dataUri;
};
