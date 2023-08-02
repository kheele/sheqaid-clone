
export const getVariablesAndQueryConfig = (
    {
        org_id: {key, value},
        scope,
        type,
    }
) => {
    //<editor-fold desc="variables, filters">
    const variables = {
        [key]: value,
        // written_off,
    };

    let filter = [];
    if (scope) {
        filter.push(`scope: {_eq: "${scope}"}`);
    }
    if (type) {
        filter.push(`type: {_eq: "${type}"}`);
    }

    if(!filter.isEmpty()) {
        filter = filter.join(', ');
    }
    //</editor-fold>

    return {variables, filter};
};