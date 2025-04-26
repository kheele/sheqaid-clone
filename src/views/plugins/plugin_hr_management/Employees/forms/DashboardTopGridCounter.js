//<editor-fold desc="imports">
import * as React from "react";
import {forwardRef} from "react";
import Grid from "@mui/material/Grid";
import Counter from "containers/Cards/CounterCards/DefaultCounterCard";
import {getRandomRolor} from "utils/UtilsFuns";
import PropTypes from "prop-types";
import EmployeeProfileSettings from "utils/EmployeeProfileSettings";
//</editor-fold>

//<editor-fold desc="GridCounter">
const Comp = forwardRef((
    {
        item, topStatsSize, onClick,
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
        {<Counter size={topStatsSize}
                  id="document_id_passport"
                  color="white"
                  countUpClass="color-white"
                  background={getRandomRolor()}
                  title={<b className="color-white font-size-14">ID/Passports</b>}
                  count={document_id_passport_list_aggregate.aggregate.count}
                  onClick={onClick}
        />}
        {EmployeeProfileSettings.isEmployeeBankingDetailsViewers(item) && <Counter
            id="banking_detail"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Banking
                Details</b>}
            count={banking_detail_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {EmployeeProfileSettings.isEmployeeLivingAddressViewers(item) && <Counter
            id="living_address"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Residential<br/>
                Addresses</b>}
            count={living_address_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {EmployeeProfileSettings.isValidEmployeeDependantsViewers(item) && <Counter
            id="dependent"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Dependents</b>}
            count={dependent_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {EmployeeProfileSettings.isValidEmployeeNextOfKinViewers(item) && <Counter
            id="next_of_kin"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Next
                Of Kins</b>}
            count={next_of_kin_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {<Counter
            id="work_permit"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b className="color-white font-size-14">Work Permits (Foreigners)</b>}
            count={work_permit_list_aggregate.aggregate.count}
            onClick={onClick}
        />}

        {<Counter
            id="document_prdp"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b className="color-white font-size-14">PrDPs</b>}
            count={document_prdp_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {<Counter
            id="license"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b className="color-white font-size-14">Licenses</b>}
            count={license_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {EmployeeProfileSettings.isEmployeeCompetencyViewers(item) && <Counter
            id="competency"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Competencies</b>}
            count={competency_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {EmployeeProfileSettings.isEmployeeWarningViewers(item) && <Counter
            id="warning"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Warnings</b>}
            count={warning_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {EmployeeProfileSettings.isEmployeeContractsViewers(item) && <Counter
            id="contract"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Contracts</b>}
            count={contract_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {EmployeeProfileSettings.isEmployeeJobAppointmentsViewers(item) && <Counter
            id="job_appointment"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Job
                Appointments</b>}
            count={job_appointment_list_aggregate.aggregate.count}
            onClick={onClick}
        />}

        {EmployeeProfileSettings.isEmployeeCounselingViewers(item) && <Counter
            id="counselling"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Counselings</b>}
            count={counselling_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {EmployeeProfileSettings.isEmployeeMedicalFitnessViewers(item) && <Counter
            id="medical"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Medicals</b>}
            count={medical_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {EmployeeProfileSettings.isEmployeeTimeOffViewers(item) && <Counter
            id="leave"
            size={topStatsSize}
            color="white"
            countUpClass="color-white"
            background={getRandomRolor()}
            title={<b
                className="color-white font-size-14">Time-Off</b>}
            count={leave_list_aggregate.aggregate.count}
            onClick={onClick}
        />}
        {/*{<Counter */}
        {/*    id="trainer_training"*/}
        {/*    size={topStatsSize}*/}
        {/*          color="white"*/}
        {/*          countUpClass="color-white"*/}
        {/*          background={getRandomRolor()}*/}
        {/*          title={<b className="color-white font-size-14">Trainings</b>}*/}
        {/*          count={trainer_training_list_aggregate.aggregate.count}*/}
        {/*onClick={onClick}*/}
        {/*/>}*/}
        {/*{<Counter*/}
        {/*    id="ppe_type"*/}
        {/*    size={topStatsSize}*/}
        {/*    color="white"*/}
        {/*    countUpClass="color-white"*/}
        {/*    background={getRandomRolor()}*/}
        {/*    title={<b className="color-white font-size-14">PPE</b>}*/}
        {/*    count={ppe_type_list_aggregate.aggregate.count}*/}
        {/*onClick={onClick}*/}
        {/*/>}*/}
        {/*{<Counter*/}
        {/*    id="supervisor_employee"*/}
        {/*    size={topStatsSize}*/}
        {/*    color="white"*/}
        {/*    countUpClass="color-white"*/}
        {/*    background={getRandomRolor()}*/}
        {/*    title={<b className="color-white font-size-14">Supervised<br/>Employees</b>}*/}
        {/*    count={supervisor_employee_list_aggregate.aggregate.count}*/}
        {/*onClick={onClick}*/}
        {/*/>}*/}
    </Grid>;
});
//</editor-fold>

Comp.defaultProps = {
    topStatsSize: 150,
};

Comp.propTypes = {
    topStatsSize: PropTypes.number,
    onClick: PropTypes.func,
};

export default Comp;
