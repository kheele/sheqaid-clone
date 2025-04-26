import GQLClient from "graphql/GQLClient";
import {orgsFilter} from "graphql/Filters";

// <editor-fold defaultstate="collapsed" desc="SelectLoad. Click on the + sign on the left to edit the code.">
function onSelectLoadAssetActionCategories() {
	return workers.emit("plugin_sheq_assist/19_Maintenance/actions/categories/list").then(res => {
		return res.map(value => {
			return {label: value, value};
		});
	});
}

function onSelectLoadAssetManufacturers() {
	return GQLClient
	.query({
		query: `
      query listAllToolsByLoggedQuery {
        asset_details(
          where: {
            manufacturer:{_is_null: false}
          },
          distinct_on: manufacturer,
	        order_by: {manufacturer: asc},
        ) {
          manufacturer
        }
      }
    `,
	}).then(res => res.map(v => v.manufacturer).distinct().map(value => {
		return {label: value, value};
	}));
}

function onSelectLoadAssetModels() {
	return GQLClient
	.query({
		query: `
      query listAllToolsByLoggedQuery {
        asset_details(
          where: {
            model:{_is_null: false}
          },
          distinct_on: model,
	        order_by: {model: asc},
        ) {
          model
        }
      }
    `,
	}).then(res => res.map(v => v.model).distinct().map(value => {
		return {label: value, value};
	}));
}

function onSelectLoadAssetLocations() {
	let filter = orgsFilter({exact_orgs: false}).join(',');
	return GQLClient
	.query({
		query: `
      query listAllToolsByLoggedQuery {
        asset_details(
          where: {
            location:{_is_null: false},
            asset_list: {${filter}}
          },
	        order_by: {location: asc},
        ) {
          location
        }
      }
    `,
	}).then(res => res.map(v => {
		const {location: value} = v;
		return {label: value, value};
	}));
}

function onSelectLoadAssetToolkits() {
	let filter = orgsFilter({exact_orgs: false}).join(',');
	return GQLClient
	.query({
		query: `
      query listAllToolsByLoggedQuery {
        asset_details(
          where: {
            toolkit:{_is_null: false},
            asset_list: {${filter}}
          },
	        order_by: {toolkit: asc},
        ) {
          toolkit
        }
      }
    `,
	}).then(res => res.map(v => {
		const {toolkit: value} = v;
		return {label: value, value};
	}));
}

function onSelectLoadAssetVendors() {
	return GQLClient
	.query({
		query: `
      query listAllToolsByLoggedQuery {
        asset_purchase_info(
          where: {
            vendor:{_is_null: false}
          },
          distinct_on: vendor,
	        order_by: {vendor: asc},
        ) {
          vendor
        }
      }
    `,
	}).then(res => res.map(v => v.vendor).distinct().map(value => {
		return {label: value, value};
	}));
}
// </editor-fold>

export {
// <editor-fold defaultstate="collapsed" desc="SelectLoad. Click on the + sign on the left to edit the code.">
	onSelectLoadAssetActionCategories,
	onSelectLoadAssetManufacturers,
	onSelectLoadAssetModels,
	onSelectLoadAssetLocations,
	onSelectLoadAssetToolkits,
	onSelectLoadAssetVendors,
// </editor-fold>
};