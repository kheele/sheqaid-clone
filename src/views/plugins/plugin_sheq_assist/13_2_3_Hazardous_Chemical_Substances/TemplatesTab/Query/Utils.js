
export const getVariablesAndQueryConfig = (
    {
        org_id: {key, value},
        physical_state,
        type,
    }
) => {
    //<editor-fold desc="variables, filters">
    const variables = {
        [key]: value,
        // removed,
    };

    let filter = [];
    if (physical_state) {
        filter.push(`physical_state: {_eq: "${physical_state}"}`);
    }
    if (type) {
        filter.push(`type: {_eq: "${type}"}`);
    }

    if(!filter.isEmpty()) {
        filter = filter.join(", ");
    }
    //</editor-fold>

    return {variables, filter};
};