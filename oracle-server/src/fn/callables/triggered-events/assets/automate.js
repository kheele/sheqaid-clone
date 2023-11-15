const path = require("path");
const fs = require("fs-extra");

exports.run = async () => {
    fs.readdir(path.join(__dirname, 'docs/2. License Disc'), async (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files = files.map(file => path.basename(file));

        // return;

        await Promise.all(files.map(async filename => {
            let [reg, type] = filename.split('.')[0].split(' ');
            type = "Vehicle License";
            // console.log(reg);
            let res = await getGraphQLOne({
                query: `
					query findQuery {
					  asset_details(where:{reg_num:{_eq: "${reg}"}}) {
							id
							reg_num
							asset_list{
							  id
							}
					  }
					}
				`,
                operationName: 'findQuery',
            });

            // console.log('getGraphQLOne res', res);

            if (res) {
                const {id, data: {reg_num, asset_list}} = res;
                const [asset] = asset_list;

                const buffer = fs.readFileSync(path.join(__dirname, 'docs/2. License Disc/' + filename));
                // console.log('buffer', type, id, reg, reg_num, !!buffer)

                // return;

                res = await getGraphQLOne({
                    query: `
                		query findAssetDocQuery {
                			asset_docs(
                				where: {
                				    type: {_eq: "Vehicle License"}, 
                				    asset: {asset_detail: {reg_num: {_eq: "${reg_num}"}}}
                				}
                			) {
						                id
						                doc
                			}
                		}
                	`,
                    operationName: 'findAssetDocQuery',
                });

                // console.log('getRelayOne res', res);
                // return;//

                if (!res) {
                    res = await insertGraphQL({
                        mutation: `
                            mutation insertAssetDocMutation($object: asset_docs_insert_input!) {
                                insert_asset_docs_one(
                                    object: $object
                                ) {
                                    id
                                    created_at
                                    doc
                                    expiry
                                    title
                                    desc
                                    type
                                    asset_id
                                    asset{
                                        id
                                    }
                                }
                            }
                        `,
                        operationName: 'insertAssetDocMutation',
                        input: {
                            asset_id: asset.id,
                            title: type,
                            type,
                            doc: {}
                        },
                    });

                    console.log('insertRelay res', res);
                    return;
                }

                if (!res) {
                    console.log('res not found', reg_num);
                    return;
                }

                return;

                console.log('res', res.id, 'dlUrls' in res.data.doc);
                if(res && !res.data.doc.dlUrls) {

                    console.log('res', res.id, res.data.doc.dlUrls);
                }
                // return;

                if (res && !res.data.doc.dlUrls) {
                    const path = `assets/${asset.id}/docs`;
                    const name = `document-${res.id}-${Dates.formatTimestamp(new Date())}`;
                    const gcsUri = await upload(path + '/' + name, buffer);
                    console.log('gcsUri', gcsUri)

                    return await updateGraphQL({
                        mutation: `
                		mutation updateAssetDocMutation($id: asset_docs_pk_columns_input!, $_set: asset_docs_set_input!) {
                            update_asset_docs_by_pk(pk_columns: $id, _set: $_set) {
                                id
                                created_at
                                doc
                                expiry
                                title
                                desc
                                type
                                asset_id
                                asset{
                                    id
                                }
                            }
                        }
                	`,
                        operationName: 'updateAssetDocMutation',
                        id: res.id,
                        attrs: {
                            doc: gcsUri,
                        },
                    });
                }
            } else {
                console.log('asset not found reg', reg, type)
            }
        }));

        // console.log('data', data);
    });
};

const upload = async (filePath, buffer) => {
    const newName = `${filePath}.pdf`;

    const storageBucket = admin.storage().bucket(DEFAULT_BUCKET);
    let bucketFile = await storageBucket.file(newName);
    return bucketFile.save(buffer, {contentType: 'application/pdf'}).then(async () => {
        const gcsUri = "gs://" + DEFAULT_BUCKET + "/" + newName;
        const dlUrls = await bucketFile.getSignedUrl({
            action: 'read',
            expires: '03-17-2099'
        });
        return {gcsUri, dlUrls};
    });
};


// Licenses
// asset not found reg
// DV84XLGP
// HJ18TGGP
// FF77RJGP
// FG68MSGP
// FJ02MXGP
// DX92VBGP
// FN92LZGP
// HJ24WZGP
// FH82ZBGP
// FD75DBGP
// HJ18TLGP
// HJ24WWGP
// FN92LZGP
// FT14FGGP
// FW79HLGP
// FG37FZGP
// FN93PSGP
// FW79HVGP
// HB18NFGP
// HB18NFGP
// HK25BLGP
// FN84RZGP
// FY39PFGP
// FN84RXGP
// HK25BKGP
// HM07PHGP
// HB18NJGP
// HJ18BFGP
// HL07PDGP
// JB14YBGP
// JB43RMGP
