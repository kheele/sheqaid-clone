import inputList from "./plan-mzi.json";
import {execWhen} from "../../utils/UtilsFuns";
import findByPassportOrIDNumEmployee from "../../mutations/all/Employee/findByPassportOrIDNumEmployee";
import listAllTrainingCourseByLoggedClient
    from "../../mutations/all/TrainingCourse/listAllTrainingCourseByLoggedClient";
import insertEmployee from "../../mutations/all/Employee/insertEmployee";
import SAIdUtils from "../../utils/SAIdUtils";
import {Dates} from "../../utils/Dates";
import insertTrainingPlan from "../../mutations/all/TrainingPlan/insertTrainingPlan";
import insertTrainingPlanByEmployee from "../../mutations/all/TrainingPlan/insertTrainingPlanByEmployee";
import findByIdsTrainingPlan from "../../mutations/all/TrainingPlan/findByIdsTrainingPlan";

const groupedBy = inputList.reduce((result, item) => {
    const {
        id_num,
        passport_num,
        employee,
        // job_position,
        Completed_2020,
        Completed_2021,
        Completed_2022,
        Completed_2023,
        Completed_2024,
        Completed_2025,
        //
        2020: _2020,
        2021: _2021,
        2022: _2022,
        2023: _2023,
        2024: _2024,
        2025: _2025,
    } = item;
    const num = id_num || passport_num;
    if (num) {
        // If num is not null, create a new group with that num
        result.push({
            employee,
            employee_id: num,
            id_num,
            passport_num,
            // job_position,
            plans: [{
                Completed_2020,
                Completed_2021,
                Completed_2022,
                Completed_2023,
                Completed_2024,
                Completed_2025,
                //
                2020: _2020,
                2021: _2021,
                2022: _2022,
                2023: _2023,
                2024: _2024,
                2025: _2025,
            }],
        });
    } else {
        // If num is null, add the course to the previous group
        const previousGroup = result[result.length - 1];
        previousGroup.plans.push({
            Completed_2020,
            Completed_2021,
            Completed_2022,
            Completed_2023,
            Completed_2024,
            Completed_2025,
            //
            2020: _2020,
            2021: _2021,
            2022: _2022,
            2023: _2023,
            2024: _2024,
            2025: _2025,
        });
    }
    return result;
}, []);

groupedBy.sort((a, b) => (a.employee > b.employee) ? 1 : -1);

console.log(groupedBy);

(async () => {
    await execWhen(() => window.storage && storage.loggedUser);

    const company_id = 6;
    const client_id = 12;
    // const project_id = 81;//
    const user_id = 61;

    const list = await listAllTrainingCourseByLoggedClient(client_id);

    const outputList = [];


    await Promise.all(groupedBy.map(async item => {
        const {
            employee,
            employee_id,
            id_num,
            passport_num,
            // job_position,
            plans,
        } = item;

        //job_position_id, course_id, year

        //all plans recorded: gob: 5358, mzi: 13122

        const employee_pg = await findByPassportOrIDNumEmployee(employee_id);
        if (!employee_pg) {
            if (employee) {
                console.log("plan_mzi no employee", employee, employee_id);
                const parts = employee.split(" ");
                if (parts.length === 3) {
                    // let [lname0, lname, fname, letter] = parts;
                    let [lname, fname, letter] = parts;
                    // let [lname, fname] = parts;
                    if(letter.length === 1 || letter.length === 2) {
                    //     lname = `${lname0} ${lname}`;
                        const id_num = SAIdUtils.isValid(employee_id) ? employee_id : null;
                        const passport_num = !id_num ? employee_id : null;
                        const dob = id_num ? Dates.formatDateSQL(SAIdUtils.getDOB(id_num)) : null;
                        const sex = id_num ? SAIdUtils.getGender(id_num) : null;
                        console.log("plan_mzi insert employee", lname, fname, id_num, passport_num, dob, sex);
                        await insertEmployee({company_id, client_id, user_id, lname, fname, id_num, passport_num, dob, sex});//gob: added 62, mzi: add ?
                    }
                }
            } else {
                console.log("plan_mzi no employee", employee, employee_id);
            }
        } else {
            await Promise.all(plans.map(async item => {
                const course = item["2020"] || item["2021"] || item["2022"] || item["2023"] || item["2024"] || item["2025"];
                const course_pg = list.find((
                    {
                        data: {
                            client,
                            name
                        }
                    }
                ) => (client && client.id === client_id) && name.toLowerCase() === course.toLowerCase());
                if (!course_pg) {
                    console.log("plan_mzi no course", course, employee, employee_id);
                } else {
                    await Promise.all([2020, 2021, 2022, 2023, 2024, 2025].map(async year => {
                        outputList.push({
                            company_id,
                            client_id,
                            // project_id,
                            user_id,

                            year,
                            course_id: course_pg.id,//
                            // training_id: ,
                            // job_position_id,
                            employee_id: employee_pg.id,

                            completion_status: item[`Completed_${year}`] === "yes" ? "Completed" : "Not Started",
                            // result_status: ,
                        });
                    }));
                }
            }));
        }
        // }
    }));
    //
    console.log(outputList);
    await Promise.all(outputList.map(async item => {
        const plan = await findByIdsTrainingPlan(item);
        if(plan) {

        } else {
            try {
                const res = await insertTrainingPlanByEmployee(item);
                console.log("plan_mzi saved", res);
            } catch (err) {

            }
        }
    }));
})();