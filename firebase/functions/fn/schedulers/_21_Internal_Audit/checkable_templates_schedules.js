    //{
    //template_id, interval, item_id, status,
    //next_date{
    //  split{year, month, date, day},
    //  date,
    //  status
    //},
    //prev_date{
    //  date_history_year[]
    //  date_history_month[]
    //  date_history_date[]
    //  date_history_day[]
    //  date_history[]
    //  status_history[""]
    //},
    //prev_list[{status, date, date_split, list[]}]
    //}

exports.scheduleNextTemplateChecklist = functions.pubsub.schedule('every 30 minutes').timeZone('Africa/Johannesburg').onRun(async ctx => {
    const now = new Date().getTime();

    let q = db2.collection('21_Internal_Audit_checkable_templates_schedules');
    q = q.where('next_date.date', '>', now);

    const snapshot = await q.get();
    if(snapshot.empty) {
        return;
    }
    const data = snapshot.data();
    let {employee_ref, interval, next_date, prev_date} = data;

    const currD = Dates.parse(next_date.date).setMidnight();
    
    const {
        split: {year, month, date, day},
        date: fullDate, 
        status
    } = next_date;
    
    prev_date = prev_date || {};
    prev_date.date_history_year = prev_date.date_history_year || [];
    prev_date.date_history_month = prev_date.date_history_month || [];
    prev_date.date_history_date = prev_date.date_history_date || [];
    prev_date.date_history_day = prev_date.date_history_day || [];
    
    prev_date.date_history = prev_date.date_history || [];
    prev_date.status_history = prev_date.status_history || [];
    
    prev_date.date_history_year.push(year);
    prev_date.date_history_month.push(month);
    prev_date.date_history_date.push(date);
    prev_date.date_history_day.push(day);
    
    prev_date.date_history.push(fullDate);
    prev_date.status_history.push(status);

    switch (interval) {
        case "Daily":
            currD.addDays(1);
            break;
        case "Weekly":
            currD.addWeeks(1);
            break;
        case "Monthly":
            currD.addMonths(1);
            break;
        case "Quarterly":
            currD.addMonths(3);
            break;
        case "Bi-Annually":
            currD.addMonths(6);
            break;
        case "Annually":
            currD.addYears(1);
            break;
    }

    next_date.split = {
        year: currD.getFullYear(),
        month: currD.getMonth(),
        date: currD.getDate(),
        day: currD.getDay()
    };
    next_date.date = currD.getTime();
    next_date.status = "Scheduled";
    data.next_date = next_date;
    data.status = "Scheduled";
    
    const employee = await employee_ref.get();
    
    await snapshot.ref.set(data, {merge: true});

    const {email, fname, lname} = employee.data;
    if (email) {
//        const opts = {
//            from: '"SHEQ Aid" <support@sheqsolve.com>',
//            bcc: email,
//            subject: 'SHEQ Aid Application Link',
//            html: '<h3><b>Dear ' + fname + ' ' + lname + '</b></h3>\n\
//                                <p>You have a scheduled inspection with the following details:</p>\n\
//                                <p>Interval: <b>' + interval + '</b></p>\n\
//                                <p>Start Date: <b>' + Dates.formatDate(currD) + '</b></p>\n\
//                                <p>Kind Regards<br/>SHEQ Aid</p>'
//        };
//        await EmailUtils.send(opts);
    }
});

exports.notifyNextTemplateScheduleChecklist = functions.pubsub.schedule('every 30 minutes').timeZone('Africa/Johannesburg').onRun(async ctx => {
    notifyByInterval("Daily");
    notifyByInterval("Weekly");
    notifyByInterval("Monthly");
    notifyByInterval("Quarterly");
    notifyByInterval("Bi-Annually");
    notifyByInterval("Annually");
});

async function notifyByInterval(interval) {
    let q = db2.collection('21_Internal_Audit_checkable_templates_schedules');
    q = q.where('interval', '==', interval);
    
    const currD = new Date();
    switch (interval) {
        case "Daily":
            currD.addDays(1);
            break;
        case "Weekly":
            currD.addWeeks(1);
            break;
        case "Monthly":
            currD.addMonths(1);
            break;
        case "Quarterly":
            currD.addMonths(3);
            break;
        case "Bi-Annually":
            currD.addMonths(6);
            break;
        case "Annually":
            currD.addYears(1);
            break;
    }

    q = q.where('next_date.date', '==', currD.getTime());

    const snapshot = await q.get();
    if(snapshot.empty) {
        return;
    }
//    const data = snapshot.data();
//    const {employee_ref, interval, next_date, prev_date} = data;
//    const employee = await employee_ref.get();
//
//    
}