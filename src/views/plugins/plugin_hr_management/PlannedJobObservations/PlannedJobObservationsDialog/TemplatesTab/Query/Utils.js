import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
  {
      site_id, project_id, client_id,
      //
      exact_orgs = false,
  }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgsFilter({site_id, project_id, client_id, exact_orgs});

    filter = filter.map(v => `{${v}}`).join(',');
    //</editor-fold>

    return {filter};
};