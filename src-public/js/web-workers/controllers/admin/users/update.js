
(function () {
    class Controller extends AControllerRead {
        constructor(events) {
            super(events, {singular: "Administrator / User", plural: "Administrators / Users"}, "admin/users/update/");

            this.tbl = 'admin_users';

            this.update_profile_company = this.update_profile_company.bind(this);
            this.upload_profile_user = this.upload_profile_user.bind(this);
            this.upload_profile_company = this.upload_profile_company.bind(this);

            const {addAction, update_profile_company, upload_profile_user, upload_profile_company} = this;
            addAction("profile/company", update_profile_company);

            addAction("upload/profile-pic/user", upload_profile_user);
            addAction("upload/profile-pic/company", upload_profile_company);
        }

        getDB() {
            return db2;
        }

        async update(evt, id, updateAttrs) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                const snapshot = await doc_ref.get();
                if (!snapshot.exists) {
                    return null;
                }

                if (updateAttrs.username) {
                    updateAttrs.username = updateAttrs.username.toLowerCase();
                }

                console.log('users update', updateAttrs)

                const res = await AControllerRead.prototype.update.call(this, evt, id, updateAttrs);

                if (updateAttrs.username) {
                    const {username: new_username} = updateAttrs;
                    console.log('users update new_username', new_username)

                    if (loggedUser.user.id === id) {
                        await auth.currentUser.updateEmail(new_username);
                        loggedUser.user.data.username = new_username;
                    } else {
                        //cant update other user email
                    }
                }
                if (updateAttrs.phone) {
                    const {phone: new_phone} = updateAttrs;
                    console.log('users update new_phone', new_phone)

                    if (loggedUser.user.id === id) {
                        await auth.currentUser.updatePhoneNumber(new_phone);
                        loggedUser.user.data.phone = new_phone;
                    } else {
                        //cant update other user phone
                    }
                }
                return res;
            });
        }

        async update_profile_company(evt, data) {
            return Events.whenLoggedIn(async loggedUser => {
                const {company} = loggedUser;
                const doc_ref = await this.getDB().collection('admin_company').doc(company.id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const updated = await doc_ref.update(data);//Promise < void >

                return true;
            });
        }

        async upload_profile_user(evt, id, path) {
            return Events.whenLoggedIn(async loggedUser => {
                const doc_ref = await this.getDB().collection(this.tbl).doc(id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                let {profile_pic: profile_pic_old} = doc_snapshot.data();

                const profile_pic = await files.upload.call(this, path, async function (bucketFile) {
                    const new_name = this.tbl + '/' + id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                    console.log('fileUtils', new_name)
                    return new_name;
                }.bind(this));

                if (profile_pic_old) {
                    files.remove(profile_pic_old);
                }

                const updated = await doc_ref.update({profile_pic});//Promise < void >

                const {user} = loggedUser;
                if (user.id === id) {
                    user.data.profile_pic = profile_pic;
                }
                return profile_pic;
            });
        }

        async upload_profile_company(evt, path) {
            return Events.whenLoggedIn(async loggedUser => {
                const {company} = loggedUser;
                const doc_ref = await this.getDB().collection('admin_company').doc(company.id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                let {profile_pic: profile_pic_old} = doc_snapshot.data();

                const profile_pic = await files.upload.call(this, path, async bucketFile => {
                    const new_name = 'admin_company/' + company.id + '/profile-pic.' + fileUtils.getExtension(bucketFile.name);
                    return new_name;
                });

                if (profile_pic_old) {
                    files.remove(profile_pic_old);
                }

                const updated = await doc_ref.update({profile_pic});//Promise < void >

                company.data.profile_pic = profile_pic;
                return profile_pic;
            });
        }
    }

    new Controller(events);
})();