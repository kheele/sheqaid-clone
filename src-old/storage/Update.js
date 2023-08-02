import {extendObservable, toJS} from 'mobx';

import {list} from './';

class Update {
    
    async updateDBUser(loggedUser) {
        if (loggedUser) {
            const {access_type, company: _company, user: _user} = {...toJS(loggedUser)};
            const company = {
                id: _company.id, 
                data: {profile_pic: _company.data.profile_pic}
            };
            const user = {id: _user.id};
            await indexedStorage.loggedUser.createOrUpdate({access_type, company, user, id: 1});
        }
    }

    updateClient(id, updateAttrs) {
        const item = list.clients.find(v => v.id === id);
        if (item) {
            extendObservable(item.data, updateAttrs);
        }
    }

    updateProject(id, updateAttrs) {
        const item = list.projects.find(v => v.id === id);
        if (item) {
            extendObservable(item.data, updateAttrs);
        }
    }

    updateSite(id, updateAttrs) {
        const item = list.sites.find(v => v.id === id);
        if (item) {
            extendObservable(item.data, updateAttrs);
        }
    }

}

const update = new Update();
export default update;