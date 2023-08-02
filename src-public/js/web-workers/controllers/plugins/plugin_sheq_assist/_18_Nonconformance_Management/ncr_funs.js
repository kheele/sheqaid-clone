class NCRFuns {

    static async getEmailCCReceipientsByCompany(
        {
            loggedUser: {
                access_type,
                user,
                user: {
                    data: {
                        client: my_client, project: my_project, site: my_site
                    }
                },
                company: {id: company_id},
                client_id: _client_id, project_id: _project_id, site_id: _site_id
            },
            user_id
        }
    ) {
        const ccReceipients = [];

        {
            if (user_id && user.id !== user_id) {
                const user_doc_ref = await db.collection('default_users').doc(user_id);
                let user_doc_snapshot = await user_doc_ref.get();
                if (user_doc_snapshot.exists) {
                    ccReceipients.push({id: user_doc_snapshot.id, data: user_doc_snapshot.data()});
                }
            } else {
                ccReceipients.push(user);
            }
        }

        {
            const users_by_company_snapshot = await db.collection('default_users').where('company_id', '==', company_id).orderBy('receive_modules_notifs').get();

            const {docs: user_docs} = users_by_company_snapshot;

            const processes_users = user_docs.map(doc => ({id: doc.id, data: doc.data()})).filter((
                {
                    id, data: {username, user_id, client, project, site, client_id, project_id, site_id, company_id}
                }
            ) => {
                if (!client && !client_id) {
                    return true;
                } else {
                    if (client) {
                        if(my_client) {
                            return my_client.id === client.id;
                        } else if(_client_id) {
                            return _client_id === client.id;
                        }
                    } else {
                        if(my_client) {
                            return my_client.id === client_id;
                        } else if(_client_id) {
                            return _client_id === client_id;
                        }
                    }
                }

                if (!project && !project_id) {
                    return true;
                } else {
                    if (project) {
                        if(my_project) {
                            return my_project.id === project.id;
                        } else if(_project_id) {
                            return _project_id === project.id;
                        }
                    } else {
                        if(my_project) {
                            return my_project.id === project_id;
                        } else if(_project_id) {
                            return _project_id === project_id;
                        }
                    }
                }

                if (!site && !site_id) {
                    return true;
                } else {
                    if (site) {
                        if(my_site) {
                            return my_site.id === site.id;
                        } else if(_site_id) {
                            return _site_id === site.id;
                        }
                    } else {
                        if(my_site) {
                            return my_site.id === site_id;
                        } else if(_site_id) {
                            return _site_id === site_id;
                        }
                    }
                }
            });

            ccReceipients.push(...processes_users);
        }

        return ccReceipients.filter(({id, data: {receive_modules_notifs}}) => {
            if (!receive_modules_notifs) {
                return false;
            }
            return receive_modules_notifs.anyMatch(v => v.text === 'Receive Non-Conformance Management Notifications' && v.value);
        }).
        map(({id, data: {username}}) => username).
        distinct();
    }

    static async getEmailCCReceipientsByContractor({contractor_id}) {
        const ccReceipients = [];

        {
            //get contractor users usernames to cc emails
            const contractors_users_snapshot = await db2.collection('plugin_sheq_assist_contractors_users').where('contractor_id', '==', contractor_id).get();

            ccReceipients.push(...contractors_users_snapshot.docs.map(doc => doc.get('username')));
        }

        return ccReceipients.distinct();
    }

    static async mapResults(item) {
        let {
            data, data: {
                client, project, site, client_id, project_id, site_id,
                source, selected_source_ref
            }
        } = item;

        const promise = [];
        // console.log('selected_source_ref', selected_source_ref)

        if (selected_source_ref && isFunction(selected_source_ref.get)) {
            const selected_source_snapshot = await selected_source_ref.get();
            if (selected_source_snapshot.exists) {
                const data = selected_source_snapshot.data();
                const {created_at} = data;
                if (created_at && created_at.toDate) {
                    data.created_at = created_at.toDate();
                }
                item.data.selected_source_ref = {id: selected_source_snapshot.id, data};
            }
        }

        // if ((client && isObject(client) && !client.data) || client_id) {
        //     promise.push(Events.get('plugin_sheq_assist/clients/').then(clients => {
        //         return clients.find_by_id.call(clients, null, client ? client.id || client_id : client_id);
        //     }).then(val => {
        //         item.data.client = val;
        //     }));
        // }
        // if ((project && isObject(project) && !project.data) || project_id) {
        //     promise.push(Events.get('plugin_sheq_assist/projects/').then(projects => {
        //         return projects.find_by_id.call(projects, null, project ? project.id || project_id : project_id);
        //     }).then(val => {
        //         item.data.project = val;
        //     }));
        // }
        // if ((site && isObject(site) && !site.data) || site_id) {
        //     promise.push(Events.get('plugin_sheq_assist/sites/').then(sites => {
        //         return sites.find_by_id.call(sites, null, site ? site.id || site_id : site_id);
        //     }).then(val => {
        //         item.data.site = val;
        //     }));
        // }
        await Promise.all(promise);

        return item;
    }

}