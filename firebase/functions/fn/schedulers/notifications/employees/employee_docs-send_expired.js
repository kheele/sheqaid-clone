const moment = require('moment');
const {sendEmail} = require("./employee_docs_send_email");

exports.send = async ({sheets, columns, item, _group, name,}) => {
    const {
        id,
        username,
        user_id,
        company_id,
        client,
        project,
        site,
        client_id,
        project_id,
        site_id,
        sentList
    } = item;
    // send_new & with expiry date && expired

    const expired_list = sentList.filter(({ref, id, data: {expiry_date}}) => !!expiry_date).filter((
        {
            ref,
            id,
            data: {expiry_date}
        }
    ) => {
        const expired = expiry_date < new Date().getTime();
        return expired;
    });

    if (!expired_list.isEmpty()) {
        // console.log("sentList---expired=", expired_list.length)
        const employeeList = expired_list.map(({ref, id, data: {employee, expiry_date}}) => ({
            ref,
            id,
            expiry_date,
            employee
        })).distinct('ref').filter(({expiry_date}) => moment(Dates.parse(expiry_date)).fromNow().contains('days ago'));

        if (!employeeList.isEmpty()) {
            let notifMsg = `<div style="
                background: #eee;
                padding: 10px;
                border-radius: 10px;
                text-transform: uppercase;
                max-width: 900px;
                overflow: hidden;
                height: 20px;
            ">
                <b style="
                    background: green;
                    color: #fff;
                    padding: 0px;
                    height: 20px;
                    min-width: 20px!important;
                    float: left;
                    text-align: center;
                    margin-right: 5px;
                    border-radius: 50%;
                ">
                    ${employeeList.length}
                </b>
                <b>${name.plural}</b> of the following employees have expired.
            </div><br />\n`;

            const client_groups = employeeList.groupBy((
                {ref, id, expiry_date, employee: {id: employee_id, data: {client_id,}}}
            ) => client_id);

            const client_ids = Object.keys(client_groups).distinct();

            // console.log('expired client_ids', client_ids)

            client_ids.forEach(client_id => {
                let employeeList = client_groups[client_id];
                employeeList.sort((a, b) => {
                    if (a.employee.data.site_id > b.employee.data.site_id)
                        return 1;
                    if (a.employee.data.site_id < b.employee.data.site_id)
                        return -1;
                    return 0;
                });
                employeeList.sort((a, b) => {
                    if (a.expiry_date > b.expiry_date)
                        return 1;
                    if (a.expiry_date < b.expiry_date)
                        return -1;
                    return 0;
                });
                employeeList.sort((a, b) => {
                    if (a.employee.data.project_id > b.employee.data.project_id)
                        return 1;
                    if (a.employee.data.project_id < b.employee.data.project_id)
                        return -1;
                    return 0;
                });

                const firstItem = employeeList[0];
                const {employee: {data: {client}}} = firstItem;

                notifMsg += `<div style="background: #eee;padding: 10px 10px 0;border-radius: 10px 10px 0 0;text-transform: uppercase;max-width: 900px;overflow: hidden;">
                    <b style="
                        background: green;
                        color: #fff;
                        border-radius: 50%;
                        padding: 0px;
                        height: 20px;
                        min-width: 20px!important;
                        float: left;
                        text-align: center;
                        margin-right: 5px;
                    ">
                        ${employeeList.length}
                    </b>
                    <b>Company:</b> ${client ? client.name : "N/A"}
                </div>\n`;

                notifMsg += `<table cellpadding="10" cellspacing="0" 
                        style="border: 10px solid #eee;text-align: left;box-shadow: 0 0 4px #aaa;border-radius: 0 10px 10px 10px;margin: 0px 0 20px 0px;">
                 <thead style="font-size: 13px;background: #ddd;">
                    <th>#</th>
                    <th>Ref #</th>
                    <th>Company</th>
                    <th>Project</th>
                    <th>Site</th>
                    <th>Employee Name</th>
                    <th>ID/Passport #</th>
                    <th>Expired On</th>
                    <th>Time Passed</th>
                 </thead>
                 <tbody>\n`;

                employeeList.forEach((
                    {
                        ref,
                        id,
                        expiry_date,
                        employee: {id: employee_id, data: {fname, lname, id_num, passport_num, client, project, site}}
                    },
                    n
                ) => {
                    notifMsg += `<tr style="background: ${n % 2 === 0 ? '#fff' : '#eee'}">
                    <td style="border-left: 2px solid #ddd">${n + 1}</td>
                    <td style="border-left: 2px solid #ddd">${id}</td>
                    <td style="border-left: 2px solid #ddd">${client ? client.name : "N/A"}</td>
                    <td style="border-left: 2px solid #ddd">${project ? project.name : "N/A"}</td>
                    <td style="border-left: 2px solid #ddd">${site ? site.name : "N/A"}</td>
                    <td style="border-left: 2px solid #ddd">${lname} ${fname}</td>
                    <td style="border-left: 2px solid #ddd">${id_num || passport_num || ''}</td>
                    <td style="border-left: 2px solid #ddd">${Dates.formatDate(expiry_date)}</td>
                    <td style="border-left: 2px solid #ddd;border-right: 2px solid #ddd">${moment(Dates.parse(expiry_date)).fromNow()}</td>
                </tr>\n`;
                });
                notifMsg += `</tbody>
                </table>\n`;
            });

            const rows = expired_list.map(({ref, id, data: {client, project, site, employee, expiry_date}}) => {
                const {
                    id: employee_id,
                    data: {fname, lname, id_num, passport_num, sex, phone, email, optional_info}
                } = employee;

                const {department, job_position} = optional_info || {};

                const res = {
                    "Ref. #": id,
                    Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                    Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                    Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                    "Department": department ? (department.name || department.data.name) : "N/A",
                    "Job Position": job_position ? (job_position.name || job_position.data.name) : "N/A",

                    "First Name": fname,
                    "Last Name": lname,
                    "ID/Passport No.": id_num || passport_num || '',
                    Gender: sex || sex,
                    "Phone No.": phone ? String(phone) : "",
                    "Email Address": email || "",
                    "Expiry Date": Dates.formatDate(expiry_date),
                    "Time Past": moment(Dates.parse(expiry_date)).fromNow(),
                };

                return res;
            });

            // console.log("notifMsg--expired--", notifMsg)
            await sendEmail({snapshot: null, email: username, notifMsg: notifMsg});
            const sheet = {columns, rows, sheetName: `${name.plural}-Expired`};
            sheets.push(sheet);
        }
    }
};