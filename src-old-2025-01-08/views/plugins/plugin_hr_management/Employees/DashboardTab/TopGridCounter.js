//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import Counter from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef} from "react";
import {getRandomRolor} from "utils/UtilsFuns";
//</editor-fold>

//<editor-fold desc="GridCounter">
const Comp = forwardRef((
    {
        data: {
            employee_active_list_aggregate,
            employee_removed_list_aggregate,
            team_list_aggregate,
            department_list_aggregate,
            job_category_list_aggregate,
            job_position_list_aggregate,
            supervisor_list_aggregate,
        },

        onViewActiveTab,
        onViewRemovedTab,
        onViewTeams,
        onViewDepartments,
        onViewJobPositions,
        onViewJobCategories,
        onViewSupervisors,
    }, ref) => {

    return <Grid
        container
        columns={1}
        spacing={5}
        className="grid-7 w-full grid-gap-10"
        sx={{m: 0, mt: '10px', mb: "30px", justifyItems: 'center',}}
    >
        <Counter size={180}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Active Employees</b>}
                 count={employee_active_list_aggregate.aggregate.count}
                 onClick={onViewActiveTab}
        />
        <Counter size={180}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Removed Employees</b>}
                 count={employee_removed_list_aggregate.aggregate.count}
                 onClick={onViewRemovedTab}
        />
        <Counter size={180}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Teams</b>}
                 count={team_list_aggregate.aggregate.count}
                 onClick={onViewTeams}
        />
        <Counter size={180}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Departments</b>}
                 count={department_list_aggregate.aggregate.count}
                 onClick={onViewDepartments}
        />
        <Counter size={180}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Job Categories</b>}
                 count={job_category_list_aggregate.aggregate.count}
                 onClick={onViewJobCategories}
        />
        <Counter size={180}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Job Positions</b>}
                 count={job_position_list_aggregate.aggregate.count}
                 onClick={onViewJobPositions}
        />
        <Counter size={180}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Supervisors</b>}
                 count={supervisor_list_aggregate.aggregate.count}
                 onClick={onViewSupervisors}
        />
    </Grid>;
});
//</editor-fold>

export default Comp;
