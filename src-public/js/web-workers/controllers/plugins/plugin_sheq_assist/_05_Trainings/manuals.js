
(() => {
    class Controller extends AControllerAid {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        constructor(events) {
            super(events, {singular: "Training Manual", plural: "Training Manuals"}, "plugin_sheq_assist/05_Trainings/manuals/", "plugin_sheq_assist_trainings_manuals");
            
            const fn = async (tbl) => {
                console.log('start', tbl)
                const doc_ref = await this.getDB().collection(tbl);//Promise < DocumentReference < T > >
                const querySnapshot = await doc_ref.get();
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push(doc);
                });

                await Promise.all(list.map(async (doc) => {
                    let {
                        client, client_id,
                        project, project_id,
                        site, site_id
                    } = doc.data();
                    
                    const doc_ref = await this.getDB().collection(tbl).doc(doc.id);
                    const attrs = {};
                    if(client && client.id) {
                        attrs.client_id = client.id;
                    } else if(!client && !client_id) {
                        attrs.client = null;
                        attrs.client_id = null;
                    }
                    if(project && project.id) {
                        attrs.project_id = project.id;
                    } else if(!project && !project_id) {
                        attrs.project = null;
                        attrs.project_id = null;
                    }
                    if(site && site.id) {
                        attrs.site_id = site.id;
                    } else if(!site && !site_id) {
                        attrs.site = null;
                        attrs.site_id = null;
                    }
                    await doc_ref.set(attrs, {merge: true});
                    console.log(tbl, doc.id)
                }));
                console.log('end', tbl)
            };
//            (async () => {
//                await fn(this.tbl);
//                await fn("plugin_sheq_assist_trainings_register");
//                await fn("plugin_sheq_assist_trainings_matrix");
//                await fn("plugin_sheq_assist_trainings_certificates");
//            })();
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="create">
        async create(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                this.injectSavable(evt, loggedUser, data);
                const {user_id, company_id, created_at} = data;
                const {job_position} = data;

                if (!!job_position && typeof job_position === 'string') {
                    delete data.job_position;
                    const _data = {name: job_position, user_id, company_id, created_at};
                    const job_position_doc_ref = await this.getDB().collection('plugin_sheq_assist_job_positions').add(_data);//Promise < DocumentReference < T > >
                    const job_position_doc_snapshot = await job_position_doc_ref.get();//Promise < DocumentSnapshot < T > >
                    data.job_position = {id: job_position_doc_snapshot.id, name: job_position_doc_snapshot.data().name};
                }

                const {doc} = data;
                delete data.doc;

                data.type = typeof doc === 'object' ? "Video" : "Document";

                const doc_ref = await this.getDB().collection(this.tbl).add(data);//Promise < DocumentReference < T > >
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >

                if (data.type === 'Document') {
                    const gcsUri = await files.upload.call(this, doc, async function (bucketFile) {
                        const new_name = this.tbl + '/' + doc_snapshot.id + '/' + bucketFile.name;
                        return new_name;
                    }.bind(this)).catch(e => {
                        doc_ref.delete();//Promise < void >
                        throw e;
                    });
                    const updated = await doc_ref.update({doc: gcsUri});//Promise < void >
                } else {
                    const savedDoc = {};
                    doc.thumbnail = JSON.parse(doc.thumbnail);
                    doc.thumbnail = Uint8Array.from(doc.thumbnail);
                    doc.thumbnail = Buffer.from(doc.thumbnail.buffer);
                    const gcsUri = await Promise.all([
                        files.upload.call(this, doc.video, async function (bucketFile) {
                            const new_name = this.tbl + '/' + doc_snapshot.id + '/' + bucketFile.name;
                            return new_name;
                        }.bind(this)).catch(e => {
                            doc_ref.delete();//Promise < void >
                            throw e;
                        }).then(gcsUri => {
                            savedDoc.video = gcsUri;
                        }),
                        files.upload.call(this, {name: 'thumbnail.jpg', buffer: doc.thumbnail}, async function (bucketFile) {
                            const new_name = this.tbl + '/' + doc_snapshot.id + '/' + bucketFile.name;
                            return new_name;
                        }.bind(this)).catch(e => {
                            doc_ref.delete();//Promise < void >
                            throw e;
                        }).then(gcsUri => {
                            savedDoc.thumbnail = gcsUri;
                        })
                    ]);
                    console.log('savedDoc', savedDoc)
                    const updated = await doc_ref.update({doc: savedDoc});//Promise < void >
                }

                doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                data = doc_snapshot.data();
                const {created_at: created_at_2} = data;
                if (created_at_2 && created_at_2.toDate) {
                    data.created_at = created_at_2.toDate();
                }

                const auditData = {id: doc_snapshot.id, data};

                this.createAudit(loggedUser, data.created_at.getTime(), auditData);

                return auditData;

            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="remove">
        async remove(evt, id) {
            return this.removeWithFile(evt, id, async ({data: {doc}}) => {
                doc && await files.remove(doc);
            });
        }
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc="list">
        async list(evt) {
            return Events.whenLoggedIn(async loggedUser => {
                let list = await AControllerAid.prototype.list.call(this, evt);
                
                const doc_list = list.filter(val => val.data.type === 'Document');
                const video_list = list.filter(val => val.data.type === 'Video');
                return {doc_list, video_list};
            });
        }
        // </editor-fold>
        
        sortBy(list) {
            list.sortBy("data.title");
        }
    }

    new Controller(events);
})();