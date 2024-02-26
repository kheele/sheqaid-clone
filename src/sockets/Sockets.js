import {orgsFilter} from "graphql/Filters";
import {convertMobx} from "utils/Utils";

class Socket {
	constructor(name) {
		this.name = name;
	}
	
	fn(name) {
		return async (data) => {
			if (data === undefined || data === null) {
				data = {};
			} else {
				if (!isNumber(data) && !isBoolean(data)) {
					data = await convertMobx(data);
					
					const {
						site_id,
						project_id,
						client_id,
						incContractors,
						excContractors,
						exact_orgs,
						exact_orgs_company,
						contractor_site_id_key,
					} = data;
					const orgs_filter = orgsFilter({
						site_id,
						project_id,
						client_id,
						incContractors,
						excContractors,
						exact_orgs,
						exact_orgs_company,
						contractor_site_id_key,
					});
					
					data = {...data, orgs_filter};
				}
			}
			
			const path = `${this.name}${name ? ('/' + name) : ''}`;
			
			return workers.emit('socket/emit', path, data);
		};
	}
}

window.sockets = {
	of: (name) => {
		return new Socket(name);
	},
	on(evt, fn) {
		workers.on(evt, fn);
		workers.emit('socket/on', evt);
		
		return this;
	},
	once(evt, fn) {
		workers.once(evt, fn);
		workers.emit('socket/once', evt);
		
		return this;
	},
};
