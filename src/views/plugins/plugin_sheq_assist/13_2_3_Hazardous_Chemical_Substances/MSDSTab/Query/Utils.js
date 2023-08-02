
export const getVariablesAndQueryConfig = (
    {
        org_id: {key, value},
        category,
        risk_level,
        manufacturer,
    }
) => {
    //<editor-fold desc="variables, filters">
    const variables = {
        [key]: value,
        // removed,
    };

    let filter = [];
    if (category) {
        filter.push(`category: {_eq: "${category}"}`);
    }
    if (risk_level) {
        filter.push(`risk_level: {_eq: "${risk_level}"}`);
    }
    if (manufacturer) {
        filter.push(`manufacturer: {_eq: "${manufacturer}"}`);
    }

    if(!filter.isEmpty()) {
        filter = filter.join(", ");
    }
    //</editor-fold>

    return {variables, filter};
};