const onCountActiveEmployees = () => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/active/dashboard/count");
};

const onCountRemovedEmployees = () => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/removed/dashboard/count");
};

const onCountTeams = () => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/teams/dashboard/count");
};

const onCountDepartments = () => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/departments/dashboard/count");
};

const onCountJobCategories = () => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/job-positions/dashboard/count");
};

const onCountJobPositions = () => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/job-positions/dashboard/count");
};

const onCountSupervisors = () => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/supervisors/dashboard/count");
};

//

const onCountAttendances = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/attendance/dashboard/count", expiry_date);
};

const onCountCompetencies = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/competencies/dashboard/count", expiry_date);
};

const onCountContacts = async () => {//expiry_date='ALL' for all record count
    const path = 'plugin_sheq_assist/16_Emergency_Preparedness/emergency-numbers/';
    const res = await Promise.all([`${path}external`, `${path}internal`].map(async path => workers.emit(`${path}/dashboard/count`)));
    return res.reduce((n1, n2) => n1 + n2, 0);
};

const onCountContracts = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/contracts/dashboard/count", expiry_date);
};

const onCountCounseling = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/counselling/dashboard/count", expiry_date);
};

const onCountKPI = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/06_Communication_And_Participation/kpi/dashboard/count", expiry_date);
};

const onCountLeaves = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/leaves/dashboard/count", expiry_date);
};

const onCountLicenses = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/licenses/dashboard/count", expiry_date);
};

const onCountMedicals = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/medicals/dashboard/count", expiry_date);
};

const onCountMeetings = expiry_date => {//expiry_date='ALL' for all record count
    return Promise.resolve(0);//workers.emit("plugin_sheq_assist/06_Communication_And_Participation//dashboard/count", expiry_date);
};

const onCountPPE = () => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/ppe/dashboard/count");
};

const onCountTasks = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/calendar/tasks/dashboard/count", expiry_date);
};

const onCountTrainings = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/05_Trainings/training-registry/dashboard/count", expiry_date);
};

const onCountWarnings = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/warnings/dashboard/count", expiry_date);
};

const onCountWorkPermits = expiry_date => {//expiry_date='ALL' for all record count
    return workers.emit("plugin_sheq_assist/employees/workpermits/dashboard/count", expiry_date);
};

const CountUtils = {
    onCountActiveEmployees,
    onCountRemovedEmployees,
    onCountTeams,
    onCountDepartments,
    onCountJobCategories,
    onCountJobPositions,
    onCountSupervisors,

    onCountAttendances,
    onCountCompetencies,
    onCountContacts,
    onCountContracts,
    onCountCounseling,
    onCountKPI,
    onCountLeaves,
    onCountLicenses,
    onCountMedicals,
    onCountMeetings,
    onCountPPE,
    onCountTasks,
    onCountTrainings,
    onCountWarnings,
    onCountWorkPermits
};

export {
    onCountActiveEmployees,
    onCountRemovedEmployees,
    onCountTeams,
    onCountDepartments,
    onCountJobCategories,
    onCountJobPositions,
    onCountSupervisors,

    onCountAttendances,
    onCountCompetencies,
    onCountContacts,
    onCountContracts,
    onCountCounseling,
    onCountKPI,
    onCountLeaves,
    onCountLicenses,
    onCountMedicals,
    onCountMeetings,
    onCountPPE,
    onCountTasks,
    onCountTrainings,
    onCountWarnings,
    onCountWorkPermits
};
export default CountUtils;
