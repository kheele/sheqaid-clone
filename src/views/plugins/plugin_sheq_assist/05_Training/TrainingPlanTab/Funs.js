// const {data: {employee, job_position, course_or_module, year, results, status, cost}} = res;

//<editor-fold desc="onNewItemEmployee">
export const onNewItemEmployee = res => {
    const {list} = this.refs.root;
    const groups = res.filter(({data: {employee}}) => !!employee).groupBy(({data: {employee}}) => employee.id);
    const keys = Object.keys(groups);

    const newGroups = keys.filter(key => list.noneMatch(({group: {id}}) => key === id));
    const oldGroups = keys.filter(key => list.anyMatch(({group: {id}}) => key === id));

    {
        const newList = newGroups.map(key => {
            const list = groups[key];
            const [item] = list;
            const {data: {employee: group}} = item;
            console.log('group', group)

            const cost = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            const attendanceRate = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            const results = list.map(({data: {results}}) => results || 'N/A');
            const status = list.map(({data: {status}}) => status);

            const courseList = list.map(({data: {course_or_module}}) => course_or_module).distinct(({id}) => id);
            const yearList = list.map(({data: {year}}) => year).distinct();

            return {group, list, cost, attendanceRate, results, status, courseList, yearList};
        });
        list.push(...newList);
    }
    {
        const __list = list;
        oldGroups.forEach(key => {
            const oldGroup = __list.find(({group: {id}}) => key === id);
            if (!oldGroup) return;

            const list = groups[key];
            const [item] = list;
            const {data: {employee: group}} = item;
            console.log('group', group)

            const cost = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            const attendanceRate = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            const results = list.map(({data: {results}}) => results || 'N/A');
            const status = list.map(({data: {status}}) => status);

            const courseList = list.map(({data: {course_or_module}}) => course_or_module).distinct(({id}) => id);
            const yearList = list.map(({data: {year}}) => year).distinct();

            return {group, list, cost, attendanceRate, results, status, courseList, yearList};
        });
        // list.map(({
        //     group,
        //     group: {id, data: {lname, fname, profile_pic}},
        //     list,
        //     cost,
        //     attendanceRate,
        //     results,
        //     status,
        //     courseList,
        //     yearList
        // }) => {
        //     // list.push(...res);
        // });
    }
};
//</editor-fold>

//<editor-fold desc="onNewItemJobPosition">
export const onNewItemJobPosition = res => {
    const {list} = this.refs.root;
    const groups = res.filter(({data: {job_position}}) => !!job_position).groupBy(({data: {job_position}}) => job_position.id);
    const keys = Object.keys(groups);

    const newGroups = keys.filter(key => list.noneMatch(({group: {id}}) => key === id));
    const oldGroups = keys.filter(key => list.anyMatch(({group: {id}}) => key === id));

    {
        const newList = newGroups.map(key => {
            const list = groups[key];
            const [item] = list;
            const {data: {job_position: group}} = item;
            console.log('group', group)

            const cost = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            const attendanceRate = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            const results = list.map(({data: {results}}) => results || 'N/A');
            const status = list.map(({data: {status}}) => status);

            const employeeList = list.filter(({data: {employee}}) => !!employee).map(({data: {employee}}) => employee).distinct(({id}) => id);
            const courseList = list.map(({data: {course_or_module}}) => course_or_module).distinct(({id}) => id);
            const yearList = list.map(({data: {year}}) => year).distinct();

            return {group, list, cost, attendanceRate, results, status, employeeList, courseList, yearList};
        });
        list.push(...newList);
    }
    // list.map(({
    //     group,
    //     group: {data: {name}},
    //     list,
    //     cost,
    //     attendanceRate,
    //     results,
    //     status,
    //     employeeList,
    //     courseList,
    //     yearList
    // }) => {
    //     // list.push(...res);
    // });
};
//</editor-fold>

//<editor-fold desc="onNewItemCourse">
export const onNewItemCourse = res => {
    const {list} = this.refs.root;
    const groups = res.groupBy(({data: {course_or_module}}) => course_or_module.id);
    const keys = Object.keys(groups);

    const newGroups = keys.filter(key => list.noneMatch(({group: {id}}) => key === id));
    const oldGroups = keys.filter(key => list.anyMatch(({group: {id}}) => key === id));

    {
        const newList = newGroups.map(key => {
            const list = groups[key];
            const [item] = list;
            const {data: {course_or_module: group}} = item;
            console.log('group', group)

            const cost = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            const attendanceRate = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            const results = list.map(({data: {results}}) => results || 'N/A');
            const status = list.map(({data: {status}}) => status);

            const employeeList = list.filter(({data: {employee}}) => !!employee).map(({data: {employee}}) => employee).distinct(({id}) => id);
            const jobPositionList = list.filter(({data: {job_position}}) => !!job_position).map(({data: {job_position}}) => job_position).distinct(({id}) => id);
            const yearList = list.map(({data: {year}}) => year).distinct();

            return {
                group,
                list,
                cost,
                attendanceRate,
                results,
                status,
                employeeList,
                jobPositionList,
                yearList
            };
        });
        list.push(...newList);
    }
    // list.map(({
    //     group,
    //     group: {data: {name}},
    //     list,
    //     cost,
    //     attendanceRate,
    //     results,
    //     status,
    //     employeeList,
    //     jobPositionList,
    //     yearList
    // }) => {
    //     // list.push(...res);
    // });
};
//</editor-fold>

//<editor-fold desc="onNewItemYear">
export const onNewItemYear = res => {
    const {list} = this.refs.root;
    const groups = res.groupBy(({data: {year}}) => year);
    const keys = Object.keys(groups);

    const newGroups = keys.filter(key => list.noneMatch(({group: {id}}) => key === id));
    const oldGroups = keys.filter(key => list.anyMatch(({group: {id}}) => key === id));

    {
        const newList = newGroups.map(key => {
            const list = groups[key];
            const group = key;
            console.log('group', group)

            const cost = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            const attendanceRate = list.map(({data: {cost}}) => cost || 0).reduce((a, b) => a + b, 0);
            const results = list.map(({data: {results}}) => results || 'N/A');
            const status = list.map(({data: {status}}) => status);

            const employeeList = list.filter(({data: {employee}}) => !!employee).map(({data: {employee}}) => employee).distinct(({id}) => id);
            const jobPositionList = list.filter(({data: {job_position}}) => !!job_position).map(({data: {job_position}}) => job_position).distinct(({id}) => id);
            const courseList = list.map(({data: {course_or_module}}) => course_or_module).distinct(({id}) => id);

            return {
                group,
                list,
                cost,
                attendanceRate,
                results,
                status,
                employeeList,
                jobPositionList,
                courseList
            };
        });
        list.push(...newList);
    }
    // list.map(({
    //     group,
    //     list,
    //     cost,
    //     attendanceRate,
    //     results,
    //     status,
    //     employeeList,
    //     jobPositionList,
    //     courseList
    // }) => {
    //     // list.push(...res);
    // });
};
//</editor-fold>
