exports.sendEmail = async ({snapshot, email, notifMsg}) => {
    console.log('sendEmail', email);

    const opts = {
        from: '"SHEQ Aid" <no-reply@sheqsolve.com>',
        to: email,
        subject: 'SHEQ Aid Notifications',
        html: `<h3><b>Dear SHEQ Aid User</b></h3>\n
                            <p>SHEQ Aid would like to notify you of the following:</p>\n
                            ${notifMsg}\n
                            <p>Kind Regards<br/>SHEQ Aid</p>`
    };
    //TODO: send them well to avoid blocking
    await EmailUtils.send(opts);
    // await snapshot.ref.set({email_sent: true}, {merge: true});//TODO: uncomment once tested
};