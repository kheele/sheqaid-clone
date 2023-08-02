
export const fillNullLists = (list) => list.map((v) => {
    !v.attendance_list && (v.attendance_list = []);
    !v.course_list && (v.course_list = []);
    !v.employee_list && (v.employee_list = []);
    !v.job_position_list && (v.job_position_list = []);
    !v.training_list && (v.training_list = []);
    !v.list && (v.list = []);
    !v.status_not_started && (v.status_not_started = 0);
    !v.status_outstanding && (v.status_outstanding = 0);
    !v.status_in_progress && (v.status_in_progress = 0);
    !v.status_completed && (v.status_completed = 0);
    return v;
});