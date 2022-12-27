const moment = require("moment");
const {sendEmail} = require("./send_email");
const {table} = require("./get_table");

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
    //send_new & no expiry date

    // console.log('send_no_expiry',
    //     sentList.length,
    //     sentList.filter(({id, data: {due_date}}) => !due_date).length,
    // )

    const no_expiry_list = sentList
        .filter(({id, data: {due_date}}) => !due_date)
        .map(v => {
            // console.log('send_no_expiry',
            //     v.client_id, v.client, client_id, client,
            //     v.project_id, v.project, project_id, project,
            //     v.site_id, v.site, site_id, site,
            // )
            return {
                ...v,
                client: v.client_id === client_id ? client : v.client,
                project: v.project_id === project_id ? project : v.project,
                site: v.site_id === site_id ? site : v.site,
            };
        });

    if (!no_expiry_list.isEmpty()) {
        let notifMsg = `<div style="
                background: #eee;
                padding: 10px;
                border-radius: 10px;
                text-transform: uppercase;
                max-width: 900px;
                overflow: hidden;
                height: 35px;
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
                    ${no_expiry_list.length}
                </b>
                <b>Non-Conformance(s)</b> do not have due date. 
                <br />
                <b style="color: red">
                    RECOMMENDATION: Please add the due dates of the following Non-Conformances
                </b>
            </div><br />\n`;

        const client_groups = no_expiry_list.groupBy((
            {id, data: {client_id}}
        ) => client_id);

        const client_ids = Object.keys(client_groups).distinct();

        client_ids.forEach(client_id => {
            let ncrList = client_groups[client_id];
            ncrList.sort((a, b) => {
                if (a.data.site_id > b.data.site_id)
                    return 1;
                if (a.data.site_id < b.data.site_id)
                    return -1;
                return 0;
            });
            ncrList.sort((a, b) => {
                if (a.data.project_id > b.data.project_id)
                    return 1;
                if (a.data.project_id < b.data.project_id)
                    return -1;
                return 0;
            });

            const firstItem = ncrList[0];
            const {data: {client}} = firstItem;

            let clientName;
            if(client) {
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
                            renderDueDate: (due_date) => `<td style="border-left:2px solid #ddd;font-weight:bold;background:#777;color:#fff">N/A</td>`,
                        },
                        n)
                ).join('\n');
            });
        });

        const rows = no_expiry_list.map((
            {
                id,
                data: {
                    created_at,
                    client, project, site,
                    //1
                    type, priority,
                    source, selected_source_id, selected_source_ref, selected_source_item,
                    //2
                    desc, process,
                    //3
                    due_date, responsible_person, approving_person,
                    //4
                    document_list,
                    //5
                    comments, remarks,
                    //6
                    progress_list = [],
                    //7
                    status_acceptance, status, result, completed_date, additional_notes
                }
            }
        ) => {
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
                "Due Date": "N/A",
                "Days Left/Passed": "N/A",
                "Progress Date": Dates.formatDate(progress_date) || "",
                "Completed Date": Dates.formatDate(completed_date) || "",
            };

            return res;
        });

        // console.log("notifMsg--no-expiry--", notifMsg)
        await sendEmail({snapshot: null, email: username, notifMsg: notifMsg});
        const sheet = {columns, rows, sheetName: `Non-Conformance-No-Due-Date`};
        sheets.push(sheet);
    }
};