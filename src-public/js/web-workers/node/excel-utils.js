// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

((self) => {
    const isWebWorker = !!self.require && isFunction(self.require);
    if (isWebWorker) {
        const fs = self.require("fs-extra");
        const path = self.require('path');
        const Excel = self.require('exceljs');

        self.excelUtils = {
            create: async (dir, fileName, sheetName, columns, rows) => {

                // Make sure the output directory is there.
                fs.ensureDirSync(dir);
                const options = {
                    filename: path.join(dir, fileName),
                    useStyles: true,
                    useSharedStrings: true
                };

                const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
                workbook.creator = 'SHEQ Aid';
                workbook.lastModifiedBy = 'SHEQ Aid';
                workbook.created = new Date();
                workbook.modified = new Date();
                workbook.lastPrinted = new Date();
//    workbook.properties.date1904 = true;
//    workbook.calcProperties.fullCalcOnLoad = true;

                const worksheet = workbook.addWorksheet(sheetName, {properties: {tabColor: {argb: 'FFC0000'}}});
                worksheet.columns = columns;

                const header = worksheet.getRow(1);
                header.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {argb: 'cccccc'}
                };
                
                const lastCell = header.getCell(columns.length - 1);
                worksheet.autoFilter = `A1:${lastCell.address}`;

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

                const errors = getExcelHeaderErrors(cols, validHeaderNames);
                if (!errors.isEmpty()) {
                    return {errors};
                }

                rows = rows.slice(1);

                return convertExcelToJson(cols, rows, validHeaderNames);
            }
        };

        const convertExcelToJson = (cols, rows, validHeaderNames) => {
            createExcelHeaderColsKeys(cols, validHeaderNames);
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
        };

        const createExcelHeaderColsKeys = (cols, validHeaderNames) => {
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
        };

        const getExcelHeaderErrors = (cols, validHeaderNames) => {
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
        };
    } else {
        self.excelUtils = {
            create: async (folder, fileName, sheetName, columns, rows) => {
                const onCreate = functions.httpsCallable('callables-excel_utils-onCreate');
                try {
                    const res = await onCreate({folder, fileName, sheetName, columns, rows});
//                    console.log('excelUtils create res', res)
                    if (res && res.data) {
                        return res.data;
                    }
                } catch (ex) {
                    console.error('excelUtils create err', ex)
                }
            },
            read: async (path, validHeaderNames) => {
                const onRead = functions.httpsCallable('callables-excel_utils-onRead');
                try {
                    const res = await onRead({path, validHeaderNames});
//                    console.log('excelUtils read res', res)
                    if (res && res.data) {
                        return res.data;
                    }
                } catch (ex) {
                    console.error('excelUtils read err', ex)
                }
            }
        };
    }
})(typeof self === 'object' && self.self === self && self || typeof global === 'object' && global.global === global && global || this);