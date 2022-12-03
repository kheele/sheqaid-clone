
exports.createPDF = async ($this, ctx, id) => {
    const drive = await onDriver();
    console.log('createPDF: ' + $this.find_by_id)
    const item = await $this.find_by_id(ctx, id);
    let {
        data: {
            created_at,
            profile_pic,
            fname, lname, id_num, passport_num, dob, sex,
            client, project, site,
            access_type, phone, email
        }
    } = item;
    //1Npjk-oPYrc_mhlJQFsJHZF6y8qgz6ZCpFVS1EqddHAQ
    //1mbris4JK4yKQkMHjdyTNuYPb-Xp2k-o5pC-MXnSnlwQ
    //11p8yP1Xz9IMJKQIuVPwF2i6LAjg6f-T2beYnC-HVNFE
    //1F5ftN635ntJAuFV8I_mGPPi1L6Xw87Gd
    //153-x2I9MOY0SvWdN2R4P9t4QHOHK2bP8MomFpxDpTMM
    return await $this.onCreateHTMLImpl(path.join(__dirname + "/employee-profile.ejs"), {
        created_at,
        profile_pic,
        fname, lname, id_num, passport_num, dob, sex,
        client, project, site,
        access_type, phone, email
    }).then(data => {
        return DriveUtils.createDocFromHTML(drive, "Employee-Profile-" + id, data);
    });
};