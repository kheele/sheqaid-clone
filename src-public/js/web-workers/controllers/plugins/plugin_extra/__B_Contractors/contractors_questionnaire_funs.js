
class ContractorQuestionnaireFuns {

    static async getLinkDoc(v, n) {
        if (v.linkDoc && !v.linkDoc.id) {
            const templates = await Events.get('plugin_sheq_assist/contractors/questionnaires/templates/');
            v.linkDoc = await templates.find_by_id.call(templates, null, v.linkDoc);
        }
        return v;
    }

    static async getEmailCCReceipientsByContractor( {contractor_id}) {
        const ccReceipients = [];

        {
            //get contractor users usernames to cc emails
            const contractors_users_snapshot = await db2.collection('plugin_sheq_assist_contractors_users').
                    where('contractor_id', '==', contractor_id).
                    get();

            ccReceipients.push(...contractors_users_snapshot.docs.map(doc => doc.get('username')));
        }

        return ccReceipients.distinct();
    }

    static async getEmailCCReceipientsByCompany( {
    loggedUser: {
    access_type,
            user, user: {
            data: {
            client: my_client, project: my_project, site: my_site
            }
            },
            company: {id: company_id},
            client_id, project_id, site_id
    },
            user_id,
            answered_by
    }) {
        const ccReceipients = [];

        {
            if (user_id && user.id !== user_id) {
                const user_doc_ref = await db.collection('default_users').doc(user_id);
                let user_doc_snapshot = await user_doc_ref.get();
                if (user_doc_snapshot.exists) {
                    ccReceipients.push(user_doc_snapshot);
                }
            } else {
                ccReceipients.push(user);
            }
        }

        {
            let qFn = () => db.collection('default_users').where('company_id', '==', company_id).orderBy('receive_modules_notifs');
            if (my_client) {
                const q = qFn().where('client_id', '==', my_client.id);
                const users_snapshot = await q.get();
                ccReceipients.push(...users_snapshot.docs);
            } else if (client_id) {
                const q = qFn().where('client_id', '==', client_id);
                const users_snapshot = await q.get();
                ccReceipients.push(...users_snapshot.docs);
            }
            if (my_project) {
                const q = qFn().where('project_id', '==', my_project.id);
                const users_snapshot = await q.get();
                ccReceipients.push(...users_snapshot.docs);
            } else if (project_id) {
                const q = qFn().where('project_id', '==', project_id);
                const users_snapshot = await q.get();
                ccReceipients.push(...users_snapshot.docs);
            }
            if (my_site) {
                const q = qFn().where('site_id', '==', my_site.id);
                const users_snapshot = await q.get();
                ccReceipients.push(...users_snapshot.docs);
            } else if (site_id) {
                const q = qFn().where('site_id', '==', site_id);
                const users_snapshot = await q.get();
                ccReceipients.push(...users_snapshot.docs);
            }
        }

        return ccReceipients.filter(doc => {
            let receive_modules_notifs;
            try {
                receive_modules_notifs = doc.get('receive_modules_notifs');
            } catch(err) {
                receive_modules_notifs = doc.data.receive_modules_notifs;
            }
            if (!receive_modules_notifs) {
                return false;
            }
            return receive_modules_notifs.anyMatch(v => v.text === 'Receive Contractor Management Notifications' && v.value);
        }).map(doc => {
            try {
                return doc.get('username');
            } catch(err) {
                return doc.data.username;
            }
        }).distinct();
    }

    static async getEmailCCReceipients( {loggedUser: {access_type, user}, user_id, contractor_id, answered_by}) {
        const ccReceipients = [];
        if (answered_by === 'Sender') {

        } else {
            ccReceipients.push(user.data.username);
        }

        {
            if (user_id && user.id !== user_id) {
                const user_doc_ref = await db.collection('default_users').doc(user_id);
                let user_doc_snapshot = await user_doc_ref.get();
                if (user_doc_snapshot.exists) {
                    ccReceipients.push(user_doc_snapshot.get('username'));
                }
            }
        }

        {
            //get contractor users usernames to cc emails
            const contractors_users_snapshot = await this.getDB().collection('plugin_sheq_assist_contractors_users').
                    where('contractor_id', '==', contractor_id).
                    get();

            ccReceipients.push(...contractors_users_snapshot.docs.map(doc => doc.get('username')));
        }

        return ccReceipients.distinct();
    }

    static async mapQuestionnaireResults(item) {
        let {id, data: {
                user_id,
                form, form: {name: formName, desc, type, title_page_list, questions}
            }
        } = item;

        const toObject = async questionsObj => {
            const questionsArr = (await Promise.all(Object.values(questionsObj).map(QuestionnaireFuns.unmapQuestionnaires(questionsObj, true))));
            return questionsArr.toObject();
        };

        if (title_page_list) {
            form.title_page_list = await toObject(title_page_list);
        }
        if (questions) {
            form.questions = await toObject(questions);
        }

        return item;
    }


}