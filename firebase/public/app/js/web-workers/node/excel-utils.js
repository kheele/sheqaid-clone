// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

(() => {
    const fs = self.require("fs-extra");
    const path = self.require('path');
    const Excel = self.require('exceljs');

    self.excelUtils = {
        create: async (dir, fileName, sheetName, columns, rows) => {

            // Make sure the output directory is there.
            fs.ensureDirSync(dir);
            var options = {
                filename: path.join(dir, fileName),
                useStyles: true,
                useSharedStrings: true
            };

            const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
            workbook.creator = 'SHEQ Assist';
            workbook.lastModifiedBy = 'SHEQ Assist';
            workbook.created = new Date();
            workbook.modified = new Date();
            workbook.lastPrinted = new Date();
//    workbook.properties.date1904 = true;
//    workbook.calcProperties.fullCalcOnLoad = true;

            const worksheet = workbook.addWorksheet(sheetName, {properties: {tabColor: {argb: 'FFC0000'}}});
            worksheet.columns = columns;

            rows.forEach((row, n) => {
//                if (row.addImage) {
//                    const image = row.addImage();
//                    const imageId = workbook.addImage(image.file);  
//                    const col = columns.find(col => col.key === image.col);
//                    const colIdx = columns.indexOf(col);
//                    worksheet.addImage(imageId, {
//                        tl: {col: colIdx, row: n},
//                        ext: {width: 100, height: 100}
//                    });
//                    console.log('image', image, col, colIdx, n)
////                    worksheet.addRow(row).commit();
//                } else {
                    worksheet.addRow(row).commit();
//                }
            });

            worksheet.commit();

            await workbook.commit();

            return options.filename;
        },
        read: async (path, validHeaderNames) => {
            const list = [];

            const workbook = new Excel.Workbook();
            let rows = await workbook.xlsx.readFile(path).then(async () => {
                const worksheet = workbook.model.sheets[0];
//                console.log('workbook', workbook)
//                console.log('worksheet', worksheet)
                return worksheet.rows;
            });

            rows = rows.filter(({cells}) => 'value' in cells[0]).map(({number, cells}) => {
                const row = {};
                cells.filter(({type}) => type !== 0).forEach(({address, type, value, hyperlink}) => {//{address, type, value, hyperlink, text}
                    if (hyperlink) {
                        hyperlink = hyperlink.replace('mailto:', '');
                    }
                    row[address] = {address, type, value: value || hyperlink};
                });
                return row;
            });

            const cols = rows.slice(0, 1)[0];

            const errors = excelUtils.getExcelHeaderErrors(cols, validHeaderNames);
            if (!errors.isEmpty()) {
                return {errors};
            }

            rows = rows.slice(1);

            return excelUtils.convertExcelToJson(cols, rows, validHeaderNames);
        },
        createExcelHeaderColsKeys: (cols, validHeaderNames) => {
            const colsKeys = Object.keys(cols);

            for (let n = 0; n < validHeaderNames.length; n++) {
                const validHeaderName = validHeaderNames[n];
                const {key: headerKey, value: headerValues, required} = validHeaderName;

                const colFoundKey = colsKeys.find(key => {
                    const colsVal = cols[key];
                    return headerValues.anyMatch(v => {
                        return colsVal.value.toLowerCase() === v.toLowerCase();
                    });
                });
                if (colFoundKey) {
                    const colsVal = cols[colFoundKey];
                    colsVal.key = headerKey;
                }
            }
        },
        getExcelHeaderErrors: (cols, validHeaderNames) => {
            const colsKeys = Object.keys(cols);

            let errors = [];
            for (let n = 0; n < validHeaderNames.length; n++) {
                const validHeaderName = validHeaderNames[n];
                const {key: headerKey, value: headerValues, required} = validHeaderName;

                const colFoundKey = colsKeys.find(key => {
                    const colsVal = cols[key];
                    return headerValues.anyMatch(v => {
                        return colsVal.value.toLowerCase() === v.toLowerCase();
                    });
                });
                if (!colFoundKey && required) {
                    errors.push(validHeaderName);
                }
            }

            return errors;
        },
        convertExcelToJson: (cols, rows, validHeaderNames) => {
            excelUtils.createExcelHeaderColsKeys(cols, validHeaderNames);
            const colsKeys = Object.keys(cols).filter(k => {
                return !!cols[k].key;
            });

            const getRowVal = row => {
                const res = {};
                const keys = Object.keys(row);
                for (let n = 0; n < colsKeys.length; n++) {//{A1: {key: ?, address: "A1", type: 3, value: "Company Number"}}
                    const colKey = colsKeys[n];//A1
                    const {key} = cols[colKey];//{key: ?, address: "A1", type: 3, value: "Company Number"}

                    const rowKey = keys.find(k => k.charAt(0) === colKey.charAt(0));
                    if (rowKey) {
                        const {value: row_value} = row[rowKey];//{address: "A2", type: 3, value: ""}
                        if (key === 'email') {
                            console.log(rowKey, row_value, row[rowKey], row)
                        }
                        if (isString(row_value)) {
                            res[key] = row_value.toTitleCase();
                        } else {
                            res[key] = row_value;
                        }
//                        console.log(colKey, key, rowKey, row_value)
                    }
                }
                return res;
            };

            return rows.map(getRowVal);
        }
    };
})();