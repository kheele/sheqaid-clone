
export const getVariablesAndQueryConfig = (
    {
        view = 'Course',
        employee_view = 'active',
        target_view,
        org_id: {key, value},
    }
) => {
    const {id, target} = target_view || {};

    //<editor-fold desc="variables, filters">
    const variables = {
        [key]: value,
        // removed,
    };

    if(target && id) {
        variables.group = id;
    }

    let filter = ``;
    if (employee_view === 'active') {
        filter = `employee: {removed: {_eq: true}}`;
    } else if (employee_view === 'inactive') {
        filter = `employee: {removed: {_eq: false}}`;
    }

    if(!filter.isEmpty()) {
        filter = `, ${filter}`;
    }
    //</editor-fold>

    return {variables, filter};
};