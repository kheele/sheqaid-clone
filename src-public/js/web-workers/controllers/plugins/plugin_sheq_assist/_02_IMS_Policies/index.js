
(() => {
    class Controller extends ADocumentCntr {
        //title, doc_num, revision_num, compiler, approving_officer, effective_date, revision_date, type, doc
        constructor(events) {
            super(events, {singular: "IMS Policy", plural: "IMS Policies"}, "plugin_sheq_assist/02_IMS_Policies/");
        
            this.doc_type_key = "plugin_sheq_assist_02_IMS_Policies";
        }

        async custom_create(evt, data) {
/*            const fs = self.require("fs-extra");
//            const path = self.require('path');

            //joining path of directory 
//            const directoryPath = path.join("C:\\Users\\E7240\\Documents\\Gobonzela\\02_IMS_Policies");
//            const process = (dir) => {
//                //passsing directoryPath and callback function
//                return new Promise((resolve, reject) => {
//                    fs.readdir(directoryPath, async (err, files) => {
//                        //handling error
//                        if (err) {
//                            reject(err);
////                            return console.log('Unable to scan directory: ' + err);
//                        } else {
//                            //listing all files using forEach
//                            await Promise.all(files.map(async (filePath, doc_num) => {
//                                filePath = path.join("C:\\Users\\E7240\\Documents\\Gobonzela\\02_IMS_Policies", filePath);
//                                try {
//                                    var stats = fs.statSync(filePath);
//                                    if (stats.isDirectory()) {
////                                process(filePath);
//                                    } else {
//                                        const ext = fileUtils.getExtension(filePath);
//                                        if (ext === 'doc' || ext === 'docx') {
//                                            // Do whatever you want to do with the file
//                                            console.log(doc_num, filePath, 'saving...');
//                                            const name = fileUtils.getFileName(filePath);
////                                    const filePathDest = filePath.replace(ext, "pdf");
////                                    fileConverterUtils.wordToPDF(filePath, filePathDest);
//
////                                    const {desc, responsible_person, expiry, doc_rev_num, doc_rev_date, doc}
//                                            const data = {
//                                                company_id: "4hKU3CF7tder8OhqoGrf",
//                                                user_id: "IbOjzlMXGl5Pe4tVzGQ6",
//                                                company: {id: "nKeFSyXL9pWBVv6a4nya", name: "Gobonzela Construction"},
//                                                type: "Upload",
//                                                internal_or_external: "Internal",
////                                        expiry: 1632952800000,
//                                                title: name.replace(".docx", "").replace(".doc", ""),
//                                                doc_num: doc_num + 1,
//                                                doc: [{
//                                                        doc: filePath,
////                                                doc_rev_date: ,
//                                                        doc_rev_num: 1.0
//                                                    }]
//                                            };
////                                    const data = {type: "Upload", internal_or_external: true, doc_num: doc_num + 1, doc: []};
////                                    data.company = {id: "nKeFSyXL9pWBVv6a4nya", name: "Gobonzela Construction"};
////                                    data.doc.push({
////                                        path: filePathDest
////                                    });
////                                    console.log('data', data);
//                                            await this.createAndUploadHasManyDocs(evt, data);
//                                            console.log(doc_num, filePath, 'saved');
//                                        }
//                                    }
//                                } catch (e) {
//                                    reject(e);
//                                }
//                            }));
//                            resolve();
//                        }
//                    });
//                });
//            }
//            await process(path.join("C:\\Users\\E7240\\Documents\\Gobonzela\\02_IMS_Policies"));
            {type, client, title, doc_num, doc: [{doc_rev_num, doc}]}*/
        }

    }

    new Controller(events);
})();