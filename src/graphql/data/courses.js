import inputList from "./courses.json";
import findByNameTrainingCourse from "../../mutations/all/TrainingCourse/findByNameTrainingCourse";
import insertTrainingCourse from "../../mutations/all/TrainingCourse/insertTrainingCourse";
import {execWhen} from "../../utils/UtilsFuns";
import listAllTrainingCourseByLoggedClient
    from "../../mutations/all/TrainingCourse/listAllTrainingCourseByLoggedClient";

const groupedBy = inputList.reduce((result, item) => {
    const {job_position, course, unit_standard, unit_standard_desc, frequency, provider} = item;
    if (job_position) {
        // If job_position is not null, create a new group with that job_position
        result.push({
            job_position,
            courses: [{
                course: course.toTitleCase(),

                unit_standard: `${unit_standard}`,
                unit_standard_desc,
                // unit_standard1: null,
                // unit_standard_desc1: null,
                frequency,
                provider,
            }],
        });
    } else {
        // If job_position is null, add the course to the previous group
        const previousGroup = result[result.length - 1];
        previousGroup.courses.push({
            course: course.toTitleCase(),

            unit_standard: `${unit_standard}`,
            unit_standard_desc,
            // unit_standard1: null,
            // unit_standard_desc1: null,
            frequency,
            provider,
        });
    }
    return result;
}, []);

groupedBy.sort((a, b) => (a.job_position > b.job_position) ? 1 : -1);

const outputList = [];

console.log(groupedBy);

for(let n = 0; n < groupedBy.length; n++){
    const group = groupedBy[n];
    const {courses, job_position} = group;
    for(let i = 0; i < courses.length; i++){
        const item = courses[i];
        const {course, unit_standard, unit_standard_desc, frequency, provider} = item;
        const foundItem = outputList.find(v => v.course === course);
        if(foundItem){
            foundItem.job_position_list.push(job_position);
        } else {
            outputList.push({
                ...item, job_position_list: [job_position]
            })
        }
    }
}

outputList.sort((a, b) => (a.course > b.course) ? 1 : -1);

console.log(outputList);

(async () => {
    await execWhen(() => window.storage && storage.loggedUser);

    const client_id = 12;//15=gob, 12=mzi
    const list = await listAllTrainingCourseByLoggedClient(client_id);
    console.log(`list`, JSON.stringify(list));

    await Promise.all(outputList.map(async item => {
        const {course, job_position_list} = item;
        delete item.course;
        delete item.job_position_list;
        item.name = course;
        item.client_id = client_id;

        // if(job_position_list) {
        //     item.job_position_list = {data: job_position_list};
        // }

        const existingItem = list.find(({data: {client, name}}) => client && client.id === item.client_id && name.toLowerCase() === course.toLowerCase());
        // console.log(`existingItem`, existingItem && existingItem.data.client && existingItem.data.client.id, item.client_id)
        if(existingItem) {
            // console.log(`Found ${existingItem}`, course)
        } else {
            const res = await insertTrainingCourse(item);
            // console.log(`saved`, res, course)
            console.log(`saved`, course)
        }
    }));
    console.log(`Courses done`, outputList.length)
})();
// console.log(outputList);