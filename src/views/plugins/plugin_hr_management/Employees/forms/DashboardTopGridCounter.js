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
        item, topStatsSize
    }, ref) => {

    let {
        id,
        data: {
            document_list_aggregate, document_id_passport_list_aggregate, document_prdp_list_aggregate,
            banking_detail_list_aggregate, living_address_list_aggregate,
            dependent_list_aggregate, next_of_kin_list_aggregate,

            competency_list_aggregate,
            contract_list_aggregate,
            counselling_list_aggregate,
            job_appointment_list_aggregate,
            leave_list_aggregate,
            license_list_aggregate,
            medical_list_aggregate,
            warning_list_aggregate,
            work_permit_list_aggregate,

            ppe_type_list_aggregate,
            trainer_training_list_aggregate,
            supervisor_employee_list_aggregate,
        }
    } = item;

    return <Grid
        container
        columns={1}
        spacing={5}
        className="grid-6 w-full grid-gap-10"
        sx={{m: 0, mt: '20px', mb: "0px", p: "20px", background: "white", justifyItems: 'center',}}
    >
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">ID/Passports</b>}
                 count={document_id_passport_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Banking Details</b>}
                 count={banking_detail_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Living Addresses</b>}
                 count={living_address_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Dependents</b>}
                 count={dependent_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Next Of Kins</b>}
                 count={next_of_kin_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Work Permits</b>}
                 count={work_permit_list_aggregate.aggregate.count}
        />

        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">PrDPs</b>}
                 count={document_prdp_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Licenses</b>}
                 count={license_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Competencies</b>}
                 count={competency_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Warnings</b>}
                 count={warning_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Contracts</b>}
                 count={contract_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Job Appointments</b>}
                 count={job_appointment_list_aggregate.aggregate.count}
        />

        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Counsellings</b>}
                 count={counselling_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Medicals</b>}
                 count={medical_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Leaves</b>}
                 count={leave_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Trainings</b>}
                 count={trainer_training_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">PPE</b>}
                 count={ppe_type_list_aggregate.aggregate.count}
        />
        <Counter size={topStatsSize}
                 color="white"
                 countUpClass="color-white"
                 background={getRandomRolor()}
                 title={<b className="color-white font-size-14">Supervised Employees</b>}
                 count={supervisor_employee_list_aggregate.aggregate.count}
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
