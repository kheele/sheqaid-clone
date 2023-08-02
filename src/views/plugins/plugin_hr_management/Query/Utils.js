import {orgsFilter} from "graphql/Filters";

export const getVariablesAndQueryConfig = (
    {
        view,
        mon, mon2, mon3,
        expiry_date = 'ALL',
        isContract = false,
        //
        department_id,
        job_position_id,
        team_id,
        supervisor_id,
        employee_id,
        //
        site_id, project_id, client_id,
        //
        exact_orgs = true,
    }
) => {
    //<editor-fold desc="variables, filters">
    let filterEmployee = orgsFilter({site_id, project_id, client_id, exact_orgs,});

    if (department_id) {
        filterEmployee.push(`department_id: {_eq: ${department_id}}`);
    }
    if (job_position_id) {
        filterEmployee.push(`job_position_id: {_eq: ${job_position_id}}`);
    }
    if (team_id) {
        filterEmployee.push(`team_id: {_eq: ${team_id}}`);
    }
    if (supervisor_id) {
        filterEmployee.push(`supervisor_id: {_eq: ${supervisor_id}}`);
    }

    if(view === "Employee") {
        if (employee_id) {
            filterEmployee.push(`id: {_eq: ${employee_id}}`);
        }
        filterEmployee = `,${filterEmployee.join(',')}`;
    } else {
        if (employee_id) {
            filterEmployee.push(`employee_id: {_eq: ${employee_id}}`);
            filterEmployee = `,${filterEmployee.join(',')}`;
        } else {
            filterEmployee = `,employee: {${filterEmployee.join(',')}}`;
        }
    }

    let filter = [];
    if (expiry_date === null) {//expiry_no
        filter.push(`expiry_date: {_is_null: true}`);
    } else if (expiry_date === -1) {//expired
        filter.push(`expiry_date: {_lte: "now()"}`);
    } else if (expiry_date === 1) {//expired_1mon
        filter.push(`expiry_date: {_gt: "now()", _lte: "${mon}"}`);
    } else if (expiry_date === 2) {//expired_2mon
        filter.push(`expiry_date: {_gt: "${mon}", _lte: "${mon2}"}`);
    } else if (expiry_date === 3) {//expired_3mon
        filter.push(`expiry_date: {_gt: "${mon2}", _lte: "${mon3}"}`);
    } else if (expiry_date === 4) {//expired_4mon
        filter.push(`expiry_date: {_gt: "${mon3}"}`);
    }

    if(!filter.isEmpty()) {
        if(isContract) {
            filter = `,contract_details: {${filter.join(',')}}`;
        } else {
            filter = `,${filter.join(',')}`;
        }
    }
    //</editor-fold>

    return {filter, filterEmployee};
};