const path = require("path");
const fs = require("fs-extra");

exports.run = async () => {
    fs.readdir(path.join(__dirname, 'docs/3. COF_Brake Test'), async (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files = files.map(file => path.basename(file));

        return;

        await Promise.all(files.map(async filename => {
            let [reg, type] = filename.split('.')[0].split(' ');
            type = type === "COF" ? "COF" : type === "BT" ? "Brake Test Report" : null;
            // console.log(reg);
            let res = await getRelayOne({
                query: `
					query findQuery {
					  asset_details_connection(where:{reg_num:{_eq: "${reg}"}}) {
						edges {
						  node {
							id
							reg_num
							asset_list{
							  id
							}
						  }
						}
					  }
					}
				`,
                operationName: 'findQuery',
            });
            if (res) {
                const {id, data: {reg_num, asset_list}} = res;
                const [asset] = asset_list;

                const buffer = fs.readFileSync(path.join(__dirname, 'docs/3. COF_Brake Test/' + filename));
                // console.log('buffer', type, id, reg, reg_num, !!buffer)

                // return;

                res = await getRelayOne({
                    query: `
                		query findAssetDocQuery {
                			asset_docs_connection(
                				where: {asset: {asset_detail: {reg_num: {_eq: "${reg}"}}}}
                			) {
                				edges {
						            node {
						                id
						            }
						        }
                			}
                		}
                	`,
                    operationName: 'findAssetDocQuery',
                });

                if (!res) {
                    res = await insertRelay({
                        query: `
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
                            doc: {}
                        },
                    });
                }

                if (res) {
                    const path = `assets/${asset.id}/docs`;
                    const name = `document-${res.id}-${Dates.formatTimestamp(new Date())}`;
                    const gcsUri = await upload(path + '/' + name, buffer);
                    console.log('gcsUri', gcsUri)

                    return await updateRelay({
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
