
export const getVariablesAndQueryConfig = (
    {
        org_id: {key, value},
    }
) => {
    //<editor-fold desc="variables, filters">
    const variables = {
        [key]: value,
        // removed,
    };

    // let filter = ``;
    // if (employee_view === 'active') {
    //     filter = `employee: {removed: {_eq: true}}`;
    // } else if (employee_view === 'inactive') {
    //     filter = `employee: {removed: {_eq: false}}`;
    // }
    //
    // if(!filter.isEmpty()) {
    //     filter = `, ${filter}`;
    // }
    //</editor-fold>

    return {variables/*, filter*/};
};