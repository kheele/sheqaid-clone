
(function() {
    class Controller extends AController {
        constructor(events, db) {
            super(events, db, {singular: "Administrator / User", plural: "Administrators / Users"}, "users/update/");

            this.tbl = 'default_users';

            this.update_profile_user = this.update_profile_user.bind(this);
            this.upload_profile_user = this.upload_profile_user.bind(this);

            const {addAction, update_profile_user, upload_profile_user} = this;
            
            addAction("profile/user", update_profile_user);
            addAction("upload/profile-pic/user", upload_profile_user);
        }

        async update_profile_user(evt, data) {
            return db.whenLoggedIn(async loggedUser => {
                const doc_ref = await db.collection(this.tbl).doc(loggedUser.id);
                let doc_snapshot = await doc_ref.get();//Promise < DocumentSnapshot < T > >
                if (!doc_snapshot.exists) {
                    return null;
                }

                const updated = await doc_ref.update(data);//Promise < void >

                return true;
            });
        }

        async upload_profile_user(evt, id, path) {
            return db.whenLoggedIn(async loggedUser => {
                const doc_ref = await db.collection(this.tbl).doc(id);
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

                if (loggedUser.id === id) {
                    loggedUser.data.profile_pic = profile_pic;
                }
                return profile_pic;
            });
        }
    }

    new Controller(events, db);
})();