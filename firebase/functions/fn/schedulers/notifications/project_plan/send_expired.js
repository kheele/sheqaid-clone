const moment = require("moment");
const {sendEmail} = require("./send_email");
const {table} = require("./get_table");

exports.send = async ({sheets, columns, item, _group, name,}) => {
    const {
        id, username, user_id, company_id, client, project, site, client_id, project_id, site_id, sentList
    } = item;
    // send_new & with expiry date && expired

    const d = new Date().getTime();
    const expired_list = sentList
        .filter(({id, data: {due_date}}) => !!due_date && due_date <= d)
        .map(v => {
            // console.log('send_expired',
            //     username, 'c',
            //     v.client_id, client_id, 'p',
            //     v.project_id, project_id, 's',
            //     v.site_id, site_id,
            // )
            return {
                ...v,
                client: v.client_id === client_id ? client : v.client,
                project: v.project_id === project_id ? project : v.project,
                site: v.site_id === site_id ? site : v.site,
            };
        });

    if (!expired_list.isEmpty()) {
        // console.log("sentList---expired=", expired_list.length)
        // const employeeList = expired_list.map(({ref, id, data: {employee, due_date}}) => ({
        //     ref,
        //     id,
        //     due_date,
        //     employee
        // })).distinct("ref").filter(({due_date}) => moment(Dates.parse(due_date)).fromNow().contains("days ago"));

        let notifMsg = `<div style="
                background: #eee;
                padding: 10px;
                border-radius: 10px;
                text-transform: uppercase;
                max-width: 900px;
                overflow: hidden;
                height: 60px;
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
                    ${expired_list.length}
                </b>
                <b>Non-Conformance(s)</b> have expired.
                <br />
                <b style="color: red; float: left; margin-left: 25px;">
                    RECOMMENDATION: If the Non-Conformance has been completed, 
                    please update it and mark it as "Completed" and update "Date Completed"
                </b>
            </div><br />\n`;

        const client_groups = expired_list.groupBy(({id, data: {client_id}}) => client_id);

        const client_ids = Object.keys(client_groups).distinct();

        // console.log("expired client_ids", client_ids)

        client_ids.forEach(client_id => {
            let ncrList = client_groups[client_id];
            ncrList.sort((a, b) => {
                if (a.data.site_id > b.data.site_id) return 1;
                if (a.data.site_id < b.data.site_id) return -1;
                return 0;
            });
            ncrList.sort((a, b) => {
                if (a.data.project_id > b.data.project_id) return 1;
                if (a.data.project_id < b.data.project_id) return -1;
                return 0;
            });

            const firstItem = ncrList[0];
            const {data: {client}} = firstItem;

            let clientName;
            if (client) {
                clientName = client.id ? client.name || client.data.name : "N/A";
            } else {
                clientName = "N/A";
            }
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
                        ${ncrList.length}
                    </b>
                    <b>Company:</b> ${clientName}
                </div>\n`;

            notifMsg += table((row) => {
                return ncrList.map((item, n) => row({
                            item,
                            renderDueDate: (due_date) => `<td style="border-left:2px solid #ddd;font-weight:bold;background:#777;color:#fff">
                            ${Dates.formatDate(due_date)} (${moment(Dates.parse(due_date)).fromNow()})
                        </td>`,
                        },
                        n)
                ).join('\n');
            });
        });

        const rows = expired_list.map((
            {
                id,
                data: {
                    created_at, client, project, site, //1
                    type, priority, source, selected_source_id, selected_source_ref, selected_source_item, //2
                    desc, process, //3
                    due_date, responsible_person, approving_person, //4
                    document_list, //5
                    comments, remarks, //6
                    progress_list = [], //7
                    status_acceptance, status, result, completed_date, additional_notes
                }
            }) => {
            const {
                // outstanding,
                // additional_notes,
                progress_date
            } = (progress_list || []).getLastElement() || {};

            const res = {
                "Ref. #": id,
                Company: isString(client) ? client : (client ? (client.name || client.data.name) : ""),
                Project: isString(project) ? project : (project ? (project.name || project.data.name) : ""),
                Site: isString(site) ? site : (site ? (site.name || site.data.name) : ""),

                "Responsible Person": responsible_person ? ((responsible_person.lname || responsible_person.data.lname) + " " + (responsible_person.fname || responsible_person.data.fname)) : "N/A",
                "Approving Person": approving_person ? ((approving_person.lname || approving_person.data.lname) + " " + (approving_person.fname || approving_person.data.fname)) : "N/A",

                "Source": source || "",
                "Type": type || "",
                "Priority": priority || "",
                "Process": process || "",

                "Description": desc || "",
                "Comments": comments || "",
                "Remarks": remarks || "",
                "Additional Notes": additional_notes || "",
                "Acceptance Status": status_acceptance || "",
                "Status": status || "",
                "Result": result || "",
                "Due Date": Dates.formatDate(due_date),
                "Days Left/Passed": moment(Dates.parse(due_date)).fromNow(),
                "Progress Date": Dates.formatDate(progress_date) || "",
                "Completed Date": Dates.formatDate(completed_date) || "",
            };

            return res;
        });

        // console.log("notifMsg--expired--", notifMsg)
        await sendEmail({snapshot: null, email: username, notifMsg: notifMsg});
        const sheet = {columns, rows, sheetName: `Non-Conformance-Expired`};
        sheets.push(sheet);
    }
};