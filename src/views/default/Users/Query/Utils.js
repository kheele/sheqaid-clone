import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
    {
        name,
        //
        exact_orgs = false,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filter = orgsFilter({exact_orgs});

    if(name) {
      if (filter.anyMatch(v => v.trim().startsWith('_or'))) {
        filter.push(`_and: {
          _or: [{fname: {_ilike: "${name}"}}, {lname: {_ilike: "${name}"}}]
        }`);
      } else {
        filter.push(`_or: [{fname: {_ilike: "${name}"}}, {lname: {_ilike: "${name}"}}]`);
      }
    }

    filter = filter.join(',');
    //</editor-fold>

    return {filter};
};