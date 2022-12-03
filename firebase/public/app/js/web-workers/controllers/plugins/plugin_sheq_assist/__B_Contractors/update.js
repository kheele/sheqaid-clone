
(() => {
    class Controller extends AControllerAssist {
        constructor(events, db) {
//        super(events, db, "contractors/");

            this.update_profile_user = this.update_profile_user.bind(this);
            this.update_profile_company = this.update_profile_company.bind(this);
            this.upload_profile_user = this.upload_profile_user.bind(this);
            this.upload_profile_company = this.upload_profile_company.bind(this);

            const {addAction, update_profile_user, update_profile_company, upload_profile_user, upload_profile_company} = this;
            addAction("update/profile/contractor", update_profile_user);
            addAction("update/profile/company", update_profile_company);

            addAction("upload/profile/contractor", upload_profile_user);
            addAction("upload/profile/company", upload_profile_company);
        }

        async update_profile_user(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user} = loggedUser;
                const doc_ref = await this.getDB().collection(this.tbl).doc(user.id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const old_data = doc_snapshot.data();
                const {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                const updated = await doc_ref.update(data);//Promise < void >

                const auditData = {id: doc_snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

                return true;
            });
        }

        async update_profile_company(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {company} = loggedUser;
                const doc_ref = await this.getDB().collection('default_companies').doc(company.id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const old_data = doc_snapshot.data();
                const {created_at} = old_data;
                if (created_at && created_at.toDate) {
                    old_data.created_at = created_at.toDate();
                }

                const updated = await doc_ref.update(data);//Promise < void >

                const auditData = {id: doc_snapshot.id, data: old_data};

                this.editAudit(loggedUser, new Date().getTime(), auditData);

                return true;
            });
        }

        async upload_profile_user(evt, path) {
            return Events.whenLoggedIn(async loggedUser => {
                const {user} = loggedUser;
                const doc_ref = await this.getDB().collection(this.tbl).doc(user.id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const profile_pic = await files.upload.call(this, path, async function (bucketFile) {
                    const new_name = this.tbl + '/' + user.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                    return new_name;
                }.bind(this));

                const updated = await doc_ref.update({profile_pic: profile_pic});//Promise < void >

                const data = doc_snapshot.data();
                const {created_at} = data;
                if (created_at && created_at.toDate) {
                    data.created_at = created_at.toDate();
                }

                const auditData = {id: doc_snapshot.id, data};

                this.uploadAudit(loggedUser, new Date().getTime(), auditData);

                user.data.profile_pic = profile_pic;
                return profile_pic;
            });
        }

        async upload_profile_company(evt, path) {
            return Events.whenLoggedIn(async loggedUser => {
                const {company} = loggedUser;
                const doc_ref = await this.getDB().collection('default_companies').doc(company.id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const profile_pic = await files.upload.call(this, path, async function (bucketFile) {
                    const new_name = 'default_companies/' + company.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                    return new_name;
                }.bind(this));

                const updated = await doc_ref.update({profile_pic: profile_pic});//Promise < void >

                const data = doc_snapshot.data();
                const {created_at} = data;
                if (created_at && created_at.toDate) {
                    data.created_at = created_at.toDate();
                }

                const auditData = {id: doc_snapshot.id, data};

                this.uploadAudit(loggedUser, new Date().getTime(), auditData);

                company.data.profile_pic = profile_pic;
                return profile_pic;
            });
        }
    }

    new Controller(events, db);
})();