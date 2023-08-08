import {isObservableArray, toJS} from 'mobx';
import {mapPersonDetails} from "./ArrayMapperUtils";
import {Dates} from "./Dates";

class ShouldUpdate {
    //<editor-fold desc="Others">
    static check(data, old_data, newVal, key) {
        if (newVal) {
            if (!old_data) {
                data[key] = newVal;
            } else if (!old_data[key] || old_data[key] !== newVal) {
                data[key] = newVal;
            }
        }
    }

    static checkBox(data, old_data, newVal, key) {
        if (newVal) {
            console.log('checkBox', key, toJS(newVal))
            if (isObject(newVal) && newVal.text && newVal.value) {
                newVal = newVal.value;
            }
            if ((isArray(newVal) || isObservableArray(newVal))) {
                newVal = newVal.map(v => v.value || v);
            }
//        if (typeof newVal !== 'undefined') {
            if (!old_data) {
                data[key] = newVal;
            } else if (JSON.stringify(old_data[key]) !== JSON.stringify(newVal)) {
                if (newVal === undefined || newVal === null) {
//                    data[key] = null;
                } else {
                    data[key] = newVal;
                }
            }
//            alert(old_data[key] + ' = ' + newVal)
//        }
        }
    }

    static checkDate(data, old_data, newVal, key) {
        if (newVal && isDate(newVal)) {
            // newVal = isNumber(newVal) ? newVal : newVal.getTime();
            newVal = Dates.formatDateSQL(newVal);
            if (!old_data) {
                data[key] = newVal;
            } else if (!old_data[key] || Dates.formatDateSQL(old_data[key]) !== newVal) {
                data[key] = newVal;
            }
        }
    }

    static checkDate_deprecated(data, old_data, newVal, key) {
        if (newVal && isDate(newVal)) {
            newVal = isNumber(newVal) ? newVal : newVal.getTime();
            if (!old_data) {
                data[key] = newVal;
            } else if (!old_data[key] || old_data[key] !== newVal) {
                data[key] = newVal;
            }
        }
    }

    static checkSignature(data, old_data, newVal, key) {
        if (newVal && (isArray(newVal) || isObservableArray(newVal))) {
            if (!old_data) {
                data[key] = JSON.stringify(newVal.slice());
            } else if (!old_data[key] || JSON.stringify(old_data[key]) !== JSON.stringify(newVal.slice())) {
                data[key] = JSON.stringify(newVal.slice());
            }
        }
    }

    static checkFile(data, old_data, newVal, key) {
        if (newVal && (isString(newVal.path) || newVal.path instanceof File)) {
            if (!old_data) {
                data[key] = newVal.path;
            } else if (!old_data[key] || old_data[key] !== newVal) {
                data[key] = newVal.path;
            }
        }
    }
    //</editor-fold>

    //<editor-fold desc="Objects">
    static checkCountry(data, old_data, country_id, key) {
        key = key || 'country';
        const key_id = key.endsWith('_id') ? key : `${key}_id`;
        if (country_id) {
            if (!old_data) {
                data[key_id] = country_id;
            } else {
                if (old_data[key_id]) {
                    if (old_data[key_id] !== country_id) {
                        data[key_id] = country_id;
                    }
                } else if (old_data[key]) {
                    if (old_data[key].id !== country_id) {
                        data[key_id] = country_id;
                    }
                } else {
                    data[key_id] = country_id;
                }
            }
        }
    }

    static checkZone(data, old_data, zone_id, key) {
        key = key || 'zone';
        const key_id = key.endsWith('_id') ? key : `${key}_id`;
        if (zone_id) {
            if (!old_data) {
                data[key_id] = zone_id;
            } else {
                if (old_data[key_id]) {
                    if (old_data[key_id] !== zone_id) {
                        data[key_id] = zone_id;
                    }
                } else if (old_data[key]) {
                    if (old_data[key].id !== zone_id) {
                        data[key_id] = zone_id;
                    }
                } else {
                    data[key_id] = zone_id;
                }
            }
        }
    }

    static checkCity(data, old_data, city_id, key) {
        key = key || 'city';
        const key_id = key.endsWith('_id') ? key : `${key}_id`;
        if (city_id) {
            if (!old_data) {
                data[key_id] = city_id;
            } else {
                if (old_data[key_id]) {
                    if (old_data[key_id] !== city_id) {
                        data[key_id] = city_id;
                    }
                } else if (old_data[key]) {
                    if (old_data[key].id !== city_id) {
                        data[key_id] = city_id;
                    }
                } else {
                    data[key_id] = city_id;
                }
            }
        }
    }

    static checkUser(data, old_data, user, key) {
        if (user) {
            if (!old_data) {
                const {id, data: {fname, lname, username}} = user;
                data[key] = {id, fname, lname, username};
            } else if (!old_data[key] || old_data[key].id !== user.id) {
                const {id, data: {fname, lname, username}} = user;
                data[key] = {id, fname, lname, username};
            }
        }
    }

    static checkEmployee(data, old_data, employee, key) {
        if (employee) {
            let email;
            if (!old_data) {
                if (isNumber(employee)) {
                    data[key] = employee;
                } else if (employee.id) {
                    data[key] = convertIdToBigint(employee.id);
                } else {
                    const {id = null, data: _data, fname, lname, _email = null} = employee;
                    email = _email || (_data && _data.email);
                    data[key] = {id, fname: fname || _data.fname, lname: lname || _data.lname};
                }
            } else {
                if (isNumber(employee)) {
                    if (!old_data[key]) {
                        data[key] = employee;
                    } else {
                        if (isNumber(old_data[key])) {
                            if (old_data[key] !== employee) {
                                data[key] = employee;
                            }
                        } else {
                            if (old_data[key].id !== employee) {
                                data[key] = employee;
                            }
                        }
                    }
                } else {
                    if (employee.id) {
                        if (!old_data[key]) {
                            data[key] = employee.id;
                        } else {
                            if (isNumber(old_data[key])) {
                                if (old_data[key] !== employee.id) {
                                    data[key] = employee.id;
                                }
                            } else {
                                if (old_data[key].id !== employee.id) {
                                    data[key] = employee.id;
                                }
                            }
                        }
                    } else {
                        const {data: _data, fname, lname, _email = null} = employee;
                        email = _email || (_data && _data.email);
                        data[key] = {fname: fname || _data.fname, lname: lname || _data.lname};
                    }
                }

            }
            if (data[key] && email) {
                data[key].email = email;
            }
        }
    }

    static checkEmployee_deprecated(data, old_data, employee, key) {
        if (employee) {
            let email;
            if (!old_data) {
                const {id = null, data: _data, fname, lname, _email = null} = employee;
                email = _email || (_data && _data.email);
                data[key] = {id, fname: fname || _data.fname, lname: lname || _data.lname};
            } else if (!old_data[key] || old_data[key].id !== employee.id) {
                const {id = null, data: _data, fname, lname, _email = null} = employee;
                email = _email || (_data && _data.email);
                data[key] = {id, fname: fname || _data.fname, lname: lname || _data.lname};
            }
            if (data[key] && email) {
                data[key].email = email;
            }
        }
    }

    static checkClient(data, old_data, client_id, key) {
        key = key || "client";
        const key_id = key.endsWith('_id') ? key : `${key}_id`;
        if (client_id) {
            client_id = client_id.id || (client_id === "All" || client_id === undefined ? null : client_id);
            if (!old_data) {
                data[key_id] = client_id;
            } else {
                if (old_data[key_id]) {
                    if (old_data[key_id] !== client_id) {
                        data[key_id] = client_id;
                    }
                } else if (old_data[key]) {
                    if (old_data[key].id !== client_id) {
                        data[key_id] = client_id;
                    }
                } else {
                    data[key_id] = client_id;
                }
            }
        } else {
            if (old_data) {
                if (old_data[key_id] || old_data[key]) {
                    data[key_id] = null;
                }
            }
        }
    }

    static checkClient_deprecated(data, old_data, client, key) {
        key = key || "client";
        if (client && (!old_data || (!old_data[key] || old_data[key].id !== client.id))) {
            if (client === "All") client = null;

            let old_val = old_data[key];
            if (old_val === "All") old_val = null;

            console.log(key, client, old_val)
            if (client && client.id) {
                const {id, data: _data, name} = client;
                data[key] = {id, name: name || _data.name};
            } else if (client !== old_val) {
                data[key] = client;
            }
        }
    }

    static checkProject(data, old_data, project_id, key) {
        key = key || "project";
        const key_id = key.endsWith('_id') ? key : `${key}_id`;
        if (project_id) {
            project_id = project_id.id || (project_id === "All" || project_id === undefined ? null : project_id);
            if (!old_data) {
                data[key_id] = project_id;
            } else {
                if (old_data[key_id]) {
                    if (old_data[key_id] !== project_id) {
                        data[key_id] = project_id;
                    }
                } else if (old_data[key]) {
                    if (old_data[key].id !== project_id) {
                        data[key_id] = project_id;
                    }
                } else {
                    data[key_id] = project_id;
                }
            }
        } else {
            if (old_data) {
                if (old_data[key_id] || old_data[key]) {
                    data[key_id] = null;
                }
            }
        }
    }

    static checkProject_deprecated(data, old_data, project, key) {
        key = key || "project";
        if (project && (!old_data || (!old_data[key] || old_data[key].id !== project.id))) {
            if (project === "All") project = null;

            let old_val = old_data[key];
            if (old_val === "All") old_val = null;

            if (project && project.id) {
                const {id, data: _data, name} = project;
                data[key] = {id, name: name || _data.name};
            } else if (project !== old_val) {
                data[key] = project;
            }
        }
    }

    static checkSite(data, old_data, site_id, key) {
        key = key || "site";
        const key_id = key.endsWith('_id') ? key : `${key}_id`;
        if (site_id) {
            site_id = site_id.id || (site_id === "All" || site_id === undefined ? null : site_id);
            if (!old_data) {
                data[key_id] = site_id;
            } else {
                if (old_data[key_id]) {
                    if (old_data[key_id] !== site_id) {
                        data[key_id] = site_id;
                    }
                } else if (old_data[key]) {
                    if (old_data[key].id !== site_id) {
                        data[key_id] = site_id;
                    }
                } else {
                    data[key_id] = site_id;
                }
            }
        } else {
            if (old_data) {
                if (old_data[key_id] || old_data[key]) {
                    data[key_id] = null;
                }
            }
        }
    }

    static checkSite_deprecated(data, old_data, site, key) {
        key = key || "site";
        if (site && (!old_data || (!old_data[key] || old_data[key].id !== site.id))) {
            if (site === "All") site = null;

            let old_val = old_data[key];
            if (old_val === "All") old_val = null;

            if (site && site.id) {
                const {id, data: _data, name} = site;
                data[key] = {id, name: name || _data.name};
            } else if (site !== old_val) {
                data[key] = site;
            }
        }
    }

    static checkSDS(data, old_data, sds, key) {
        key = key || 'sds';
        if (sds) {
            if (!old_data) {
                const {id} = sds;
                data[key] = {id};
            } else if (!old_data[key] || old_data[key].id !== sds.id) {
                const {id} = sds;
                data[key] = {id};
            }
        }
    }

    static checkHazchemSheet(data, old_data, hazchem_sheet, key) {
        key = key || 'hazchem_sheet';
        if (hazchem_sheet) {
            if (!old_data) {
                const {id} = hazchem_sheet;
                data[key] = {id};
            } else if (!old_data[key] || old_data[key].id !== hazchem_sheet.id) {
                const {id} = hazchem_sheet;
                data[key] = {id};
            }
        }
    }

    static checkCourseOrModule(data, old_data, course_or_module, key) {
        key = key || 'course_or_module';
        if (course_or_module) {
            if (!old_data) {
                if (course_or_module.id) {
                    const {id, data: _data, name} = course_or_module;
                    data[key] = {id, name: name || _data.name};
                } else {
                    data[key] = course_or_module;
                }
            } else if (!old_data[key] || old_data[key].id !== course_or_module.id) {
                if (course_or_module.id) {
                    const {id, data: _data, name} = course_or_module;
                    data[key] = {id, name: name || _data.name};
                } else {
                    data[key] = course_or_module;
                }
            }
        }
    }

    static checkTrainingMatrix(data, old_data, training_matrix, key) {
        key = key || 'training_matrix';
        if (training_matrix) {
            if (!old_data) {
                data[key] = training_matrix.id;
            } else if (!old_data[key] || old_data[key].id !== training_matrix.id) {
                data[key] = training_matrix.id;
            }
        }
    }

    static checkTrainingMatrix_deprecated(data, old_data, training_matrix, key) {
        key = key || 'training_matrix';
        if (training_matrix) {
            if (!old_data) {
                if (training_matrix.id) {
                    const {id, data: _data, type, course_or_module, job_title} = training_matrix;
                    data[key] = {
                        id, type: type || _data.type,
                        course_or_module: course_or_module || _data.course_or_module,
                        job_title: job_title || _data.job_title
                    };
                } else {
                    data[key] = training_matrix;
                }
            } else if (!old_data[key] || old_data[key].id !== training_matrix.id) {
                if (training_matrix.id) {
                    const {id, data: _data, type, course_or_module, job_title} = training_matrix;
                    data[key] = {
                        id, type: type || _data.type,
                        course_or_module: course_or_module || _data.course_or_module,
                        job_title: job_title || _data.job_title
                    };
                } else {
                    data[key] = training_matrix;
                }
            }
        }
    }

    static checkTrainingPlanYear(data, old_data, training_plan, key) {
        key = key || 'training_plan';
        if (training_plan) {
            if (!old_data) {
                if (training_plan.group) {
                    const {group: year} = training_plan;
                    data[key] = parseInt(year, 10);
                } else {
                    data[key] = parseInt(training_plan, 10);
                }
            } else if (!old_data[key] || old_data[key] !== training_plan || (
                old_data[key] && training_plan && old_data[key].group !== training_plan.group
            )) {
                if (training_plan.group) {
                    const {group: year} = training_plan;
                    data[key] = parseInt(year, 10);
                } else {
                    data[key] = parseInt(training_plan, 10);
                }
            }
        }
    }

    static checkAsset(data, old_data, asset_id, key) {
        key = key || 'asset';
        const key_id = key.endsWith('_id') ? key : `${key}_id`;
        if (asset_id) {
            if(!isNumber(asset_id) && asset_id.id) {
                asset_id = asset_id.id;
            }
            if (!old_data) {
                data[key_id] = asset_id;
            } else {
                if (old_data[key_id]) {
                    if (old_data[key_id] !== asset_id) {
                        data[key_id] = asset_id;
                    }
                } else if (old_data[key]) {
                    if (old_data[key].id !== asset_id) {
                        data[key_id] = asset_id;
                    }
                } else {
                    data[key_id] = asset_id;
                }
            }
        }
    }

    static checkDepartment(data, old_data, department_id, key) {
        key = key || 'department';
        const key_id = key.endsWith('_id') ? key : `${key}_id`;
        if (department_id) {
            department_id = department_id.id || department_id;
            if (!old_data) {
                data[key_id] = department_id;
            } else {
                if (old_data[key_id]) {
                    if (old_data[key_id] !== department_id) {
                        data[key_id] = department_id;
                    }
                } else if (old_data[key]) {
                    if (old_data[key].id !== department_id) {
                        data[key_id] = department_id;
                    }
                } else {
                    data[key_id] = department_id;
                }
            }
        }
    }

    static checkDepartment_deprecated(data, old_data, department, key) {
        key = key || 'department';
        if (department) {
            if (!old_data) {
                if (department.id) {
                    const {id, data: _data, name} = department;
                    data[key] = {id, name: name || _data.name};
                } else {
                    data[key] = department;
                }
            } else if (!old_data[key] || old_data[key].id !== department.id) {
                if (department.id) {
                    const {id, data: _data, name} = department;
                    data[key] = {id, name: name || _data.name};
                } else {
                    data[key] = department;
                }
            }
        }
    }

    static checkJobPosition(data, old_data, job_position_id, key) {
        key = key || 'job_position';
        const key_id = key.endsWith('_id') ? key : `${key}_id`;
        if (job_position_id) {
            job_position_id = job_position_id.id || job_position_id;
            if (!old_data) {
                data[key_id] = job_position_id;
            } else {
                if (old_data[key_id]) {
                    if (old_data[key_id] !== job_position_id) {
                        data[key_id] = job_position_id;
                    }
                } else if (old_data[key]) {
                    if (old_data[key].id !== job_position_id) {
                        data[key_id] = job_position_id;
                    }
                } else {
                    data[key_id] = job_position_id;
                }
            }
        }
    }

    static checkJobCategory(data, old_data, job_category_id, key) {
        key = key || 'job_category';
        const key_id = key.endsWith('_id') ? key : `${key}_id`;
        if (job_category_id) {
            job_category_id = job_category_id.id || job_category_id;
            if (!old_data) {
                data[key_id] = job_category_id;
            } else {
                if (old_data[key_id]) {
                    if (old_data[key_id] !== job_category_id) {
                        data[key_id] = job_category_id;
                    }
                } else if (old_data[key]) {
                    if (old_data[key].id !== job_category_id) {
                        data[key_id] = job_category_id;
                    }
                } else {
                    data[key_id] = job_category_id;
                }
            }
        }
    }

    static checkJobPosition_deprecated(data, old_data, job_position, key) {
        key = key || 'job_position';
        if (job_position) {
            if (!old_data) {
                if (job_position.id) {
                    const {id, data: _data, name} = job_position;
                    data[key] = {id, name: name || _data.name};
                } else {
                    data[key] = job_position;
                }
            } else if (!old_data[key] || old_data[key].id !== job_position.id) {
                if (job_position.id) {
                    const {id, data: _data, name} = job_position;
                    data[key] = {id, name: name || _data.name};
                } else {
                    data[key] = job_position;
                }
            }
        }
    }
    //</editor-fold>

    //<editor-fold desc="Lists">
    static checkBoxList(data, old_data, newVal, key) {
        // if (newVal) {
        if (isNullable(newVal)) {
            newVal = [];
        }

        console.log('checkBoxList', key, toJS(newVal))

        const list = toJS(newVal);
        list.sort();
        if (!old_data) {
            data[key] = list;
            return;
        }

        let old_list = toJS(old_data[key] || []);
        old_list.sort();
        if (old_list.length !== list.length) {
            data[key] = list;
            return;
        }

        if (JSON.stringify(old_list) !== JSON.stringify(list)) {
            data[key] = list;
        }
        // }
    }

    static checkFileList(data, old_data, newVal, key) {
        if (newVal) {
            const mapper = ({path}) => path;
            if (!newVal.filter(mapper).isEmpty()) {
                const newList = newVal.map(mapper);
                const list = toJS(newList);
                list.sort();
                if (!old_data) {
                    data[key] = list;
                    return;
                }

                let old_list = toJS(old_data[key] || []);
                old_list.sort();
                if (old_list.length !== list.length) {
                    data[key] = [...newVal, ...newList];
                    return;
                }

                if (JSON.stringify(old_list) !== JSON.stringify(list)) {
                    data[key] = [...newVal, ...newList];
                }
            }
        }
    }

    static checkWitnessList(data, old_data, newVal, key) {
        key = key || "witness_list";
        if (newVal && (isArray(newVal) || isObservableArray(newVal))) {
            const mapper = v => {
                if (v.id) {
                    return {witness_id: v.id};
                }
                if (v.witness) {
                    return {witness_id: v.witness.id};
                }
                return {witness_external: {data: v}};
            };

            newVal = newVal.map(mapPersonDetails).map(mapper);
            const list = toJS(newVal);
            list.sort();
            if (!old_data) {
                data[key] = {data: list};
                return;
            }

            let old_list = toJS(old_data[key] || []);
            old_list = old_list.map(mapper);
            old_list.sort();
            if (old_list.length !== list.length) {
                data[key] = {data: list};
                return;
            }

            if (JSON.stringify(old_list) !== JSON.stringify(list)) {
                data[key] = {data: list};
            }
        }
    }

    static checkListPermissionsModules(data, old_data, newVal, key) {
        if (newVal && (isArray(newVal) || isObservableArray(newVal))) {
            key = key || "permissions_module_list";
            const mapper = (v) => ({...v});

            newVal = newVal && newVal.map(mapper);

            const list = toJS(newVal);
            list.sort();
            if (!old_data) {
                data[key] = list;
                return;
            }

            let old_list = toJS(old_data[key] || []);
            old_list = old_list.map(mapper);
            old_list.sort();
            if (old_list.length !== list.length) {
                data[key] = list;
                return;
            }

            if (JSON.stringify(old_list) !== JSON.stringify(list)) {
                data[key] = list;
            }
        }
    }

    static checkListPermissionsOther(data, old_data, newVal, key) {
        if (newVal && (isArray(newVal) || isObservableArray(newVal))) {
            key = key || "permissions_other_list";
            const mapper = (v) => ({...v});

            newVal = newVal && newVal.map(mapper);

            const list = toJS(newVal);
            list.sort();
            if (!old_data) {
                data[key] = list;
                return;
            }

            let old_list = toJS(old_data[key] || []);
            old_list = old_list.map(mapper);
            old_list.sort();
            if (old_list.length !== list.length) {
                data[key] = list;
                return;
            }

            if (JSON.stringify(old_list) !== JSON.stringify(list)) {
                data[key] = list;
            }
        }
    }

    static checkListToJS(data, old_data, newVal, key, mapper) {
        if (mapper) {
            newVal = newVal && mapper && newVal.map(mapper);
        }
        if (newVal && (isArray(newVal) || isObservableArray(newVal))) {
            const list = toJS(newVal);
            list.sort();
            if (!old_data) {
                data[key] = list;
                return;
            }

            let old_list = toJS(old_data[key] || []);
            if (mapper) {
                old_list = old_list.map(mapper);
            }
            old_list.sort();
            if (old_list.length !== list.length) {
                data[key] = list;
                return;
            }

            if (JSON.stringify(old_list) !== JSON.stringify(list)) {
                data[key] = list;
            }
        }
    }

    static checkObjectToJS(data, old_data, newVal, key, mapper) {
        if (mapper) {
            newVal = newVal && newVal.map(mapper);
        }
        if (newVal && (isArray(newVal) || isObservableArray(newVal))) {
            const list = toJS(newVal);
            list.sort();
            if (!old_data) {
                data[key] = list;
                return;
            }

            let old_list = toJS(old_data[key] || []);
            if (mapper) {
                old_list = old_list.map(mapper);
            }
            old_list.sort();
            if (old_list.length !== list.length) {
                data[key] = list;
                return;
            }

            if (JSON.stringify(old_list) !== JSON.stringify(list)) {
                data[key] = list;
            }
        }
    }

    static checkListToJSElseEmpty(data, old_data, newVal, key, mapper) {
        if (mapper) {
            newVal = newVal && newVal.map(mapper);
        }
        if (newVal && (isArray(newVal) || isObservableArray(newVal))) {
            const list = toJS(newVal);
            list.sort();
            if (!old_data) {
                data[key] = list;
                return;
            }

            let old_list = toJS(old_data[key] || []);
            if (mapper) {
                old_list = old_list.map(mapper);
            }
            old_list.sort();
            if (old_list.length !== list.length) {
                data[key] = list;
                return;
            }

            if (JSON.stringify(old_list) !== JSON.stringify(list)) {
                data[key] = list;
            }
        } else {
            data[key] = [];
        }
    }

    static checkJobCategoryList(data, old_data, job_category_list, key) {
        key = key || 'job_category_list';
        if (job_category_list && (isArray(job_category_list) || isObservableArray(job_category_list))) {
            const job_category_list_mapped = job_category_list;
            job_category_list_mapped.sort();

            const old_job_category_list_mapped = (old_data[key] || []);
            old_job_category_list_mapped.sort();

            const setList = () => {
                data[key] = job_category_list.map(v => {
                    const old = old_job_category_list_mapped.find(v2 => v2.job_category.id === v.id);
                    if (old) {
                        const {id, job_category} = old;
                        return {id, job_category_id: job_category.id};
                    }
                    if (v.id) {
                        const {id} = v;
                        return {job_category_id: id};
                    }
                    return v;
                });
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_job_category_list_mapped) !== JSON.stringify(job_category_list_mapped)) {
                setList();
            }
        }
    }

    static checkJobPositionList(data, old_data, job_position_list, key) {
        key = key || 'job_position_list';
        if (job_position_list && (isArray(job_position_list) || isObservableArray(job_position_list))) {
            const job_position_list_mapped = job_position_list;
            job_position_list_mapped.sort();

            const old_job_position_list_mapped = (old_data[key] || []);
            old_job_position_list_mapped.sort();

            const setList = () => {
                data[key] = job_position_list.map(v => {
                    const old = old_job_position_list_mapped.find(v2 => v2.job_position.id === v.id);
                    if (old) {
                        const {id, job_position} = old;
                        return {id, job_position_id: job_position.id};
                    }
                    if (v.id) {
                        const {id} = v;
                        return {job_position_id: id};
                    }
                    return v;
                });
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_job_position_list_mapped) !== JSON.stringify(job_position_list_mapped)) {
                setList();
            }
        }
    }

    static checkDepartmentList(data, old_data, department_list, key) {
        key = key || 'department_list';
        if (department_list && (isArray(department_list) || isObservableArray(department_list))) {
            const department_list_mapped = department_list;
            department_list_mapped.sort();

            const old_department_list_mapped = (old_data[key] || []);
            old_department_list_mapped.sort();

            const setList = () => {
                data[key] = department_list.map(v => {
                    const old = old_department_list_mapped.find(v2 => v2.department.id === v.id);
                    if (old) {
                        const {id, department} = old;
                        return {id, department_id: department.id};
                    }
                    if (v.id) {
                        const {id} = v;
                        return {department_id: id};
                    }
                    return v;
                });
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_department_list_mapped) !== JSON.stringify(department_list_mapped)) {
                setList();
            }
        }
    }

    static checkSectorList(data, old_data, sector_list, key) {
        key = key || 'sector_list';
        if (sector_list && (isArray(sector_list) || isObservableArray(sector_list))) {
            const sector_list_mapped = sector_list;
            sector_list_mapped.sort();

            const old_sector_list_mapped = (old_data[key] || []);
            old_sector_list_mapped.sort();

            const setList = () => {
                data[key] = sector_list.map(v => {
                    const old = old_sector_list_mapped.find(v2 => v2.sector.id === v.id);
                    if (old) {
                        const {id, sector} = old;
                        return {id, sector_id: sector.id};
                    }
                    if (v.id) {
                        const {id} = v;
                        return {sector_id: id};
                    }
                    return v;
                });
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_sector_list_mapped) !== JSON.stringify(sector_list_mapped)) {
                setList();
            }
        }
    }

    static checkTeamEmployeeList(data, old_data, employee_list, key) {
        key = key || 'employee_list';
        if (employee_list && (isArray(employee_list) || isObservableArray(employee_list))) {
            // const mapper = v => {
            //     if (v.employee) {
            //         return v.employee.id;
            //     } else {
            //         return v.id;
            //     }
            // };
            const employee_list_mapped = employee_list;//.map(mapper);
            employee_list_mapped.sort();

            const old_employee_list_mapped = (old_data[key] || []);//.map(mapper);
            old_employee_list_mapped.sort();

            const setList = () => {
                data[key] = employee_list.map((v) => {
                    let {id, employee} = v;
                    if (employee || id) {
                        id = (employee ? employee.id : id);
                        return {id};
                    }
                    return v;
                });
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_employee_list_mapped) !== JSON.stringify(employee_list_mapped)) {
                setList();
            }
        }
    }

    static checkEmployeeList(data, old_data, employee_list, key) {
        key = key || 'employee_list';
        if (employee_list && (isArray(employee_list) || isObservableArray(employee_list))) {
            // const mapper = v => {
            //     if (v.employee) {
            //         return v.employee.id;
            //     } else {
            //         return v.id;
            //     }
            // };
            const employee_list_mapped = employee_list;//.map(mapper);
            employee_list_mapped.sort();

            const old_employee_list_mapped = (old_data[key] || []);//.map(mapper);
            old_employee_list_mapped.sort();

            const setList = () => {
                data[key] = employee_list.map((v) => {
                    const {id, employee} = v;
                    const old = old_employee_list_mapped.find(v2 => v2.employee.id === (employee ? employee.id : id));
                    if (old) {
                        const {id, employee} = old;
                        return {id, employee_id: employee.id};
                    }
                    if (employee || id) {
                        const employee_id = (employee ? employee.id : id);
                        return {employee_id};
                    }
                    return v;
                });
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_employee_list_mapped) !== JSON.stringify(employee_list_mapped)) {
                setList();
            }
        }
    }

    static checkEmployeeList_deprecated(data, old_data, employee_list, key) {
        key = key || 'employee_list';
        if (employee_list && (isArray(employee_list) || isObservableArray(employee_list))) {
            const mapper = v => {
                if (v.employee) {
                    return v.employee.id;
                } else {
                    return v.id;
                }
            };
            const employee_list_mapped = employee_list.map(mapper);
            employee_list_mapped.sort();

            const old_employee_list_mapped = (old_data[key] || []).map(mapper);
            old_employee_list_mapped.sort();

            const setList = () => {
                data[key] = employee_list.map(v => {
                    if (v.employee) {
                        const {id, fname, lname} = v.employee;
                        return {id, fname, lname};
                    } else {
                        const {id, fname, lname} = v;
                        return {id, fname, lname};
                    }
                });
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_employee_list_mapped) !== JSON.stringify(employee_list_mapped)) {
                setList();
            }
        }
    }

    static checkTeamList(data, old_data, team_list, key) {
        key = key || 'team_list';
        if (team_list && (isArray(team_list) || isObservableArray(team_list))) {
            const mapper = v => {
                if (v.team) {
                    return v.team.id;
                } else {
                    return v.id;
                }
            };
            const team_list_mapped = team_list.map(mapper);
            team_list_mapped.sort();

            const old_team_list_mapped = (old_data[key] || []).map(mapper);
            old_team_list_mapped.sort();

            const setList = () => {
                data[key] = team_list_mapped;
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_team_list_mapped) !== JSON.stringify(team_list_mapped)) {
                setList();
            }
        }
    }

    static checkPPEList(data, old_data, ppe_list, key) {
        key = key || 'ppe_list';
        if (ppe_list && (isArray(ppe_list) || isObservableArray(ppe_list))) {
            const mapper = v => {
                if (v.ppe) {
                    return v.ppe.id;
                } else {
                    return v.id;
                }
            };
            const ppe_list_mapped = ppe_list.map(mapper);
            ppe_list_mapped.sort();

            const old_ppe_list_mapped = (old_data[key] || []).map(mapper);
            old_ppe_list_mapped.sort();

            const setList = () => {
                data[key] = ppe_list_mapped;
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_ppe_list_mapped) !== JSON.stringify(ppe_list_mapped)) {
                setList();
            }
        }
    }

    static checkChemicalStockList(data, old_data, chemical_stock_list, key) {
        key = key || 'chemical_stock_list';
        if (chemical_stock_list && (isArray(chemical_stock_list) || isObservableArray(chemical_stock_list))) {
            const chemical_stock_list_mapped = chemical_stock_list.filter(v => !!v).slice();
            chemical_stock_list_mapped.sort();

            const old_chemical_stock_list_mapped = (old_data[key] || []).filter(v => !!v).slice();
            old_chemical_stock_list_mapped.sort();

            const setList = () => {
                data[key] = chemical_stock_list_mapped.filter(v => !!v).slice();
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_chemical_stock_list_mapped) !== JSON.stringify(chemical_stock_list_mapped)) {
                setList();
            }
        }
    }

    static checkIncidentList(data, old_data, incident_list, key) {
        key = key || 'incident_list';
        if (incident_list && (isArray(incident_list) || isObservableArray(incident_list))) {
            const mapper = v => {
                if (v.incident) {
                    return v.incident.id;
                } else {
                    return v.id;
                }
            };
            const incident_list_mapped = incident_list.filter(v => !!v).map(mapper).slice();
            incident_list_mapped.sort();

            const old_incident_list_mapped = (old_data[key] || []).filter(v => !!v).map(mapper).slice();
            old_incident_list_mapped.sort();

            const setList = () => {
                data[key] = incident_list_mapped;
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_incident_list_mapped) !== JSON.stringify(incident_list_mapped)) {
                setList();
            }
        }
    }

    static checkSiteList(data, old_data, site_list, key) {
        key = key || 'site_list';
        if (site_list && (isArray(site_list) || isObservableArray(site_list))) {
            const mapper = v => {
                const {id} = v.site;
                return id;
            };
            const site_list_mapped = site_list.map(mapper);
            site_list_mapped.sort();

            const old_site_list_mapped = (old_data[key] || []).map(mapper);
            old_site_list_mapped.sort();

            const setList = () => {
                data[key] = {
                    data: site_list.map(({site: {id: site_id}}) => {
                        return {site_id};
                    })
                };
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_site_list_mapped) !== JSON.stringify(site_list_mapped)) {
                setList();
            }
        }
    }

    static checkSiteList_deprecated(data, old_data, site_list, key) {
        key = key || 'site_list';
        if (site_list && (isArray(site_list) || isObservableArray(site_list))) {
            const mapper = v => {
                const {id} = v.site;
                return id;
            };
            const site_list_mapped = site_list.map(mapper);
            site_list_mapped.sort();

            const old_site_list_mapped = (old_data[key] || []).map(mapper);
            old_site_list_mapped.sort();

            const setList = () => {
                data[key] = site_list.map(({site}) => site).map(({id, data: {name}}) => {
                    return {id, name};
                });
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_site_list_mapped) !== JSON.stringify(site_list_mapped)) {
                setList();
            }
        }
    }

    static checkClientBlacklist(data, old_data, client_blacklist, key) {
        key = key || 'client_blacklist';
        if (client_blacklist && (isArray(client_blacklist) || isObservableArray(client_blacklist))) {
            const mapper = v => {
                if (v.client) {
                    return v.client.id;
                } else {
                    return v.id || v;
                }
            };
            const client_blacklist_mapped = client_blacklist.filter(v => !!v).map(mapper).slice();
            client_blacklist_mapped.sort();

            const old_client_blacklist_mapped = (old_data[key] || []).filter(v => !!v).map(mapper).slice();
            old_client_blacklist_mapped.sort();

            const setList = () => {
                data[key] = client_blacklist_mapped;
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_client_blacklist_mapped) !== JSON.stringify(client_blacklist_mapped)) {
                setList();
            }
        }
    }

    static checkProjectBlacklist(data, old_data, project_blacklist, key) {
        key = key || 'project_blacklist';
        if (project_blacklist && (isArray(project_blacklist) || isObservableArray(project_blacklist))) {
            const mapper = v => {
                if (v.project) {
                    return v.project.id;
                } else {
                    return v.id || v;
                }
            };
            const project_blacklist_mapped = project_blacklist.filter(v => !!v).map(mapper).slice();
            project_blacklist_mapped.sort();

            const old_project_blacklist_mapped = (old_data[key] || []).filter(v => !!v).map(mapper).slice();
            old_project_blacklist_mapped.sort();

            const setList = () => {
                data[key] = project_blacklist_mapped;
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_project_blacklist_mapped) !== JSON.stringify(project_blacklist_mapped)) {
                setList();
            }
        }
    }

    static checkSiteBlacklist(data, old_data, site_blacklist, key) {
        key = key || 'site_blacklist';
        if (site_blacklist && (isArray(site_blacklist) || isObservableArray(site_blacklist))) {
            const mapper = v => {
                if (v.site) {
                    return v.site.id;
                } else {
                    return v.id || v;
                }
            };
            const site_blacklist_mapped = site_blacklist.filter(v => !!v).map(mapper).slice();
            site_blacklist_mapped.sort();

            const old_site_blacklist_mapped = (old_data[key] || []).filter(v => !!v).map(mapper).slice();
            old_site_blacklist_mapped.sort();

            const setList = () => {
                data[key] = site_blacklist_mapped;
            };
            if (!old_data) {
                setList();
            } else if (JSON.stringify(old_site_blacklist_mapped) !== JSON.stringify(site_blacklist_mapped)) {
                setList();
            }
        }
    }
    //</editor-fold>

}

export default ShouldUpdate;
