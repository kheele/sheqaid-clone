//<editor-fold desc="imports">
import * as React from "react";
import Grid from "@mui/material/Grid";
import Counter from "containers/Cards/CounterCards/DefaultCounterCard";
import {forwardRef} from "react";
import {getRandomRolor} from "utils/UtilsFuns";
import PropTypes from "prop-types";
//</editor-fold>

//<editor-fold desc="GridCounter">
const Comp = forwardRef((
    {
        titlePlural,
        topStatsSize,
        item,
    }, ref) => {

    const {
        data: {
            sector_list = [],
            job_position_list = [],
            training_matrix_list = [],//[{id, cost, institution_conducting_training, trainer}]
            training_plan_list = [],//{id, completion_status, result, result_status, year, employee, course, training}
        }
    } = item;

    const cost = training_matrix_list.
    filter(({cost}) => !!cost).
    map(({cost}) => parseFloat(cost.replace("$", "").replace(",", ""))).
    reduce((n1, n2) => n1 + n2, 0);

    const total_trainers = training_matrix_list.
    filter(({trainer}) => !!trainer).
    map(({trainer}) => trainer.id).
    distinct().length;

    const total_institutions = training_matrix_list.
    filter(({institution_conducting_training}) => !!institution_conducting_training).
    map(({institution_conducting_training}) => institution_conducting_training).
    distinct().length;

    const total_participants = training_plan_list.
    filter(({employee}) => !!employee).
    filter(({year}) => year <= new Date().getFullYear()).
    filter(({completion_status}) => completion_status === "Completed" || completion_status === "In Progress").
    map(({employee}) => employee.id).
    distinct().length;

    return <Grid
        container
        columns={2}
        className="grid-4 w-full grid-gap-10"
        sx={{m: "0 0 -10px -10px", p: "20px", background: "white", justifyItems: 'center', width: "calc(100% + 10px) !important"}}
    >
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Total Cost</b>}
                 value={cost.toCurrencyNoCents('R')}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Trainings</b>}
                 count={training_matrix_list.length}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Participants</b>}
                 count={total_participants}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Institutions</b>}
                 count={total_institutions}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Conductors</b>}
                 count={total_trainers}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Job Positions</b>}
                 count={job_position_list.length}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Sectors</b>}
                 count={sector_list.length}
        />
    </Grid>;
});
//</editor-fold>

Comp.defaultProps = {
    topStatsSize: 150,
};

Comp.propTypes = {
    topStatsSize: PropTypes.number,
};

export default Comp;
