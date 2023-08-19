import inputList from "./training_matrix.json";
import findByNameTrainingCourse from "../../mutations/all/TrainingCourse/findByNameTrainingCourse";
import insertTrainingCourse from "../../mutations/all/TrainingCourse/insertTrainingCourse";
import {execWhen} from "../../utils/UtilsFuns";
import listAllTrainingCourseByLoggedClient
    from "../../mutations/all/TrainingCourse/listAllTrainingCourseByLoggedClient";
import findByPassportOrIDNumEmployee from "../../mutations/all/Employee/findByPassportOrIDNumEmployee";
import findByNameEmployee from "../../mutations/all/Employee/findByNameEmployee";
import insertTrainingPlanByEmployee from "../../mutations/all/TrainingPlan/insertTrainingPlanByEmployee";

const outputList = inputList.map(item => {
    const {employee, job_position} = item;

    const new_item = {employee, job_position, course_List: []};
    Object.keys(item).filter(k => k !== 'employee' && k !== 'job_position').filter(k => item[k] !== null).forEach(k => {
        new_item.course_List.push({
            name: k,
            date: item[k]
        });
    });

    return new_item;
});

console.log(outputList);

(async () => {
    await execWhen(() => window.storage && storage.loggedUser);

    const user_id = 61;
    const company_id = 1;
    const client_id = 4;
    const project_id = 10;
    const list = await listAllTrainingCourseByLoggedClient(client_id);
    console.log(`list`, JSON.stringify(list));

    await Promise.all(outputList.map(async item => {
        const {employee, job_position, course_List} = item;

        const employee_pg = await findByNameEmployee({
            fname: employee.split(" ")[0].toTitleCase(),
            lname: employee.split(" ")[1].toTitleCase()
        });
        if (!employee_pg) {
            console.log("Employ does not exist ", employee);
            return;
        }

        for (let n = 0; n < course_List.length; n++) {
            const course = course_List[n];
            const course_pg = list.find(({data: {name}}) => (name.toLowerCase() === course.name.toLowerCase()));

            if (!course_pg) {
                console.log("no course", course, employee, employee);
            } else {
                const val = {
                    company_id,
                    client_id,
                    project_id,
                    user_id,

                    year: parseInt(course.date.split("/")[2]),
                    course_id: course_pg.id,//
                    // training_id: ,
                    // job_position_id,
                    employee_id: employee_pg.id,

                    completion_status: "Not Started",
                    // result_status: ,
                };
                console.log(`val`, val)
                // const res = await insertTrainingPlanByEmployee(val);
                // console.log(`res`, res)
            }
        }

    }));
    console.log(`Courses done`, outputList.length)
})();
console.log(outputList);