export default async (job_position_id) => {
    return workers.emit("plugin_sheq_assist/employees/select/filter", {job_position_id});
};