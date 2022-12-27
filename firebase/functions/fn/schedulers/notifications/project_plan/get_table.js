const moment = require("moment");
exports.table = (fn) => {
    return `<table 
        cellPadding="5" 
        cellSpacing="0"
        style="border:10px solid #eee;border-spacing: 0px;text-align:left;border-radius:0 10px 10px 10px;margin:0px 0 20px 0px;width: 1000px;">
        <thead style="font-size:13px;background:#ddd">
            <tr>
                <th style="text-align: center;">#</th>
                <th></th>
            </tr>
        </thead>
        <tbody style="">
            ${fn(render)}
        </tbody>
    </table>`;
};

const render = (
    {
        item: {
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
        },
        renderDueDate,
    }, n) => {

    const {
        // outstanding,
        // additional_notes,
        progress_date
    } = (progress_list || []).getLastElement() || {};

    const priorityColors = {
        color: {
            Critical: "#fff", High: "#000", Medium: "#000", Low: "#fff",
        }, bg: {
            Critical: "red", High: "orange", Medium: "yellow", Low: "green",
        }
    };
    const resultColors = {
        color: {
            Fail: "#fff", Pass: "#fff",
        }, bg: {
            Fail: "red", Pass: "green",
        }
    };

    const priority_attrs = {
        bg: priorityColors.bg[priority] || null, color: priorityColors.color[priority] || null
    };
    const result_attrs = {
        bg: resultColors.bg[result] || null, color: resultColors.color[result] || null,
    };

    const style = "border-left: 2px solid #ddd;border-right: 2px solid #ddd;";

    return `<tr style="background:#fff;">
        <td style="/* border-left:2px solid #ddd; */padding: 5px;text-align: center;">${n + 1}</td>
        <td style="/* border-left:2px solid #ddd; */">
            <table style="width: 100%;border-spacing: 0;" cellPadding="5">
                <thead style="font-size:13px;background:#ddd">
                <tr>
                    <th style="width: 20%;">Ref #</th>
                    <th style="width: 20%;">Project</th>
                    <th style="width: 20%;">Site</th>
                    <th style="width: 20%;">Responsible Person</th>
                    <th style="width: 20%;">Approving Person</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style="border-left:2px solid #ddd">${id}</td>
                    <td style="border-left:2px solid #ddd">
                        ${isString(project) ? project : (project ? (project.name || project.data.name) : "N/A")}
                    </td>
                    <td style="border-left:2px solid #ddd">
                        ${isString(site) ? site : (site ? (site.name || site.data.name) : "")}
                    </td>
                    <td style="border-left:2px solid #ddd">
                        ${responsible_person ? ((responsible_person.lname || responsible_person.data.lname) + " " + (responsible_person.fname || responsible_person.data.fname)) : "N/A"}
                    </td>
                    <td style="border-left:2px solid #ddd;border-right: 2px solid #ddd;">
                        ${approving_person ? ((approving_person.lname || approving_person.data.lname) + " " + (approving_person.fname || approving_person.data.fname)) : "N/A"}
                    </td>
                </tr>
                </tbody>
            </table>
            <table style="width: 100%;border-spacing: 0;" cellPadding="5">
                <thead style="font-size:13px;background:#ddd">
                <tr>
                    <th style="/* width:180px; */">Process</th>
                    <!--                    <th>Description</th>-->
                    <!--                    <th>Comments</th>-->
                    <!--                    <th>Remarks</th>-->
                    <!--                    <th>Additional Notes</th>-->
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style="border-left:2px solid #ddd;border-right:2px solid #ddd">
                        ${process || "N/A"}
                    </td>
                </tr>
                </tbody>
            </table>
            <table style="width: 100%;border-spacing: 0;" cellPadding="5">
                <thead style="font-size:13px;background:#ddd">
                <tr>
                    <th style="/* width: 20%; */">Source</th>
                    <th style="width: 20%;">Acceptance Status</th>
                    <th style="width: 20%;">Status</th>
                    <th style="width: 20%;">Type</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style="border-left:2px solid #ddd;">
                        ${source || "N/A"}
                    </td>
                    <td style="border-left:2px solid #ddd;">
                        ${status_acceptance || "N/A"}
                    </td>
                    <td style="border-left:2px solid #ddd;">
                        ${status || "N/A"}
                    </td>
                    <td style="border-left:2px solid #ddd;border-right:2px solid #ddd">
                        ${type || "N/A"}
                    </td>
                </tr>
                </tbody>
            </table>
            <table style="width: 100%;border-spacing: 0;border-bottom: 2px solid #ddd;" cellPadding="5">
                <thead style="font-size:13px;background:#ddd">
                <tr>
                    <th style="width: 20%;">Priority</th>
                    <th style="width: 20%;">Result</th>
                    <th style="width: 20%;">Due Date</th>
                    <th style="width: 20%;">Progress Date</th>
                    <th style="width: 20%;">Completed Date</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td style="font-weight: bold; background: ${priority_attrs.bg}; color: ${priority_attrs.color};">
                        ${priority || "N/A"}
                    </td>
                    <td style="font-weight: bold; background: ${result_attrs.bg}; color: ${result_attrs.color};">
                        ${result || "N/A"}
                    </td>
                    ${renderDueDate(due_date)}
                    <td style="border-left:2px solid #ddd;">
                        ${Dates.formatDate(progress_date) || "N/A"}
                    </td>
                    <td style="border-left:2px solid #ddd;border-right:2px solid #ddd">
                        ${Dates.formatDate(completed_date) || "N/A"}
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>`;
};