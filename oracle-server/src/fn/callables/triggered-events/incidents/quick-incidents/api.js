// <editor-fold defaultstate="collapsed" desc="sendNewQuickIncidentNotification">
exports.sendNewQuickIncidentNotification = async (body) => {
    const data = getTriggeredEventsData(body, "sheq_incident_investigation_quick");
    if (!data) {
        return;
    }

    const {new_item} = data;
    const {
        id,
    } = new_item;

    const orgs_fragment = `
        id
        name
        user_list(where: {
            removed: {_eq: false},
            notifications_settings: {receive_incident_management_notifs: {_eq: true}},
        }){
            id
            full_name
            username
            phone
        }
    `;

    const injury_fragment = `
        injury{
          id
          name
        }
    `;

    const doc_fragment = `
        id
        doc
        type
    `;

    const person_fragment = `
        id
        full_name
        email
        phone
    `;

    const item = await getRelayOne({
        query: `
            query findByIdQuery($id: bigint) {
                sheq_incident_investigation_quick_connection(
                    where: {id: {_eq: $id}},
                    limit: 1
                ) {
                  edges {
                    node {
                        id
                        removed
                        //
                        company{
                            ${orgs_fragment}
                        }
                        client{
                            ${orgs_fragment}
                        }
                        project{
                            ${orgs_fragment}
                        }
                        site{
                            ${orgs_fragment}
                        }
                        //
                        person_injured{
                            ${person_fragment}
                        }
                        person_injured_other{
                            ${person_fragment}
                        }
                        person_reporting{
                            ${person_fragment}
                        }
                        person_reporting_other{
                            ${person_fragment}
                        }
                        //
                        incident_date
                        incident_time
                        date_reported
                        time_reported
                        time_shift
                        //
                        is_vehicle_incident
                        short_desc
                        severity
                        exact_location
                        latitude
                        longitude
                        //
                        driver{
                            ${person_fragment}
                        }
                        driver_other{
                            ${person_fragment}
                        }
                        driver_email
                        driver_phone
                        vehicle_make
                        vehicle_reg_num
                        category_list{
                            id
                            category{
                              id
                              name
                            }
                        }
                        nature_of_injury_list:injury_list(where:{injury:{type:{_eq:"Nature"}}}){
                            ${injury_fragment}
                        }
                        bodily_injury_location_list:injury_list(where:{injury:{type:{_eq:"Bodily Parts"}}}){
                            ${injury_fragment}
                        }
                        injury_mechanism_list:injury_list(where:{injury:{type:{_eq:"Direct Cause"}}}){
                            ${injury_fragment}
                        }
                        image_list:doc_list(where:{type:{_eq:"Image"}}){
                            ${doc_fragment}
                        }
                        video_list:doc_list(where:{type:{_eq:"Video"}}){
                            ${doc_fragment}
                        }
                    }
                  }
                }
            }
        `,
        operationName: 'findByIdQuery',
        variables: {id: id},
    });
    if (!item) {
        return;
    }
//7Qk6ipL0kgj0ThgYqOMQ, GypCgmbrT13AZgfx8peG, XvEGdxUp0GAaLpcduNro (message),
    const {
        removed,
        //
        company,
        client,
        project,
        site,
        //
        person_injured,
        person_injured_other,
        person_reporting,
        person_reporting_other,
        //
        incident_date,
        incident_time,
        date_reported,
        time_reported,
        time_shift,
        //
        is_vehicle_incident,
        short_desc,
        severity,
        exact_location,
        latitude,
        longitude,
        //
        driver,
        driver_other,
        driver_email,
        driver_phone,
        vehicle_make,
        vehicle_reg_num,
        //
        category_list,
        //
        nature_of_injury_list,
        bodily_injury_location_list,
        injury_mechanism_list,
        //
        image_list,
        video_list,
    } = item.data;

    const emails = [driver_email];
    if(site && site.user_list) {
        emails.push(...site.user_list.map(v => v.username));
    }
    if(project && project.user_list) {
        emails.push(...project.user_list.map(v => v.username));
    }
    if(client && client.user_list) {
        emails.push(...client.user_list.map(v => v.username));
    }
    if(company && company.user_list) {
        emails.push(...company.user_list.map(v => v.username));
    }

    let location = "";
    if (client) {
        location = client.name;
    } else {
        location = company.name;
    }
    if (project) {
        location += " > " + project.name;
    }
    if (site) {
        location += " > " + site.name;
    }
    if (location.isEmpty()) {
        location = "N/A";
    }

    let imageSection =  '';
    (image_list || []).forEach(v => {
        imageSection +=  `<img src="${v.doc.dlUrls[0]}"/>`;
    });
    let videoSection =  '';
    (video_list || []).forEach(v => {
        videoSection +=  `<video src="${v.doc.dlUrls[0]}"/>`;
    });

    const vehicleSection = is_vehicle_incident ? `
        <p>Vehicle Make: <b>${vehicle_make || 'N/A'}</b></p>
        <p>Vehicle Registration : <b>${vehicle_reg_num || 'N/A'}</b></p>
        <p>Driver: <b>${driver || driver_other ? (driver || driver_other).full_name : 'N/A'}</b></p>
        <p>Driver Phone No.: <b>${driver_phone || ((driver || driver_other) && (driver || driver_other).phone) || 'N/A'}</b></p>
        <p>Driver Email Address: <b>${driver_email || ((driver || driver_other) && (driver || driver_other).email) || 'N/A'}</b></p>
    ` : '';

    await EmailUtils.send({
        from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
//      to: emails.join(','),
        bcc: emails.distinct().join(','),
        subject: 'SHEQ Aid Notifications (Incident Recorded)',
        html: `
            <p>This is an automated email from SHEQ Aid.<br />Please do not reply to this email.</p>
            <p>The following incident has been reported:</p>
            <p>Location (Company/Project/Site): <b>${location}</b></p>
            <p>ID: <b>${id}</b></p>
            <p>Short Description: <b>${short_desc}</b></p>
            <p>Exact Location: <b>${exact_location}</b></p>
            <p>Location Reported: <b>latitude: ${latitude}, longitude: ${longitude}</b></p>
            <p>Incident Category: <b>${(!category_list.isEmpty() ? category_list.map(v => v.category.name).join(',') : 'N/A')}</b></p>
            
            <p>Nature Of Injury: <b>${(!nature_of_injury_list.isEmpty() ? nature_of_injury_list.map(v => v.injury.name).join(',') : 'N/A')}</b></p>
            <p>Bodily Injury Location: <b>${(!bodily_injury_location_list.isEmpty() ? bodily_injury_location_list.map(v => v.injury.name).join(',') : 'N/A')}</b></p>
            <p>Injury Mechanism: <b>${(!injury_mechanism_list.isEmpty() ? injury_mechanism_list.map(v => v.injury.name).join(',') : 'N/A')}</b></p>
            
            ${imageSection}
            ${videoSection}
            
            <p>Date Of Incident: <b>${Dates.formatDate(incident_date) || 'N/A'}</b></p>
            <p>Time Of Incident: <b>${incident_time}</b></p>
            <p>Date Reported: <b>${Dates.formatDate(date_reported) || 'N/A'}</b></p>
            <p>Time Reported: <b>${time_reported}</b></p>
            <p>Time Shift: <b>${time_shift}</b></p>
            <p>Incident Severity: <b>${severity}</b></p>
            
            <p>Reported By: <b>${person_reporting || person_reporting_other ? (person_reporting || person_reporting_other).full_name : 'N/A'}</b></p>
            <p>Person Injured: <b>${person_injured || person_injured_other ? (person_injured || person_injured_other).full_name : 'N/A'}</b></p>
            
            ${vehicleSection}
            
            <p>If you didn't request this, you can ignore this email or let us know.</p>
            <p>Kind Regards<br/>SHEQ Aid</p>
        `
    });
};
// </editor-fold>
