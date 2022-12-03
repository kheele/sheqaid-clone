
(() => {
    const nodemailer = self.require('nodemailer');

    const mailOptions = {
//    from: '"KompareVS" <no-reply@komparevs.com>', // sender address 
//            to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers 
//            subject: 'KompareVS, Password Reset', // Subject line 
//            text: 'Hello world ?', // plaintext body 
//            html: '<b>Hello world ?</b>' // html body 
    };

    const smtpConfig = {
//    host: 'togepi.aserv.co.za', //komparevs.com',
        host: "smtp-mail.outlook.com", //komparevs.com',
        port: 587, //465,
        secureConnection: false,
//        secure: true, // use SSL 
        auth: {
            user: 'Support@sheqsolve.com',
            pass: 'Hus39898'
        },
        tls: {
            ciphers: 'SSLv3'
        }
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    class EmailUtils {

        constructor() {
        }

        static send(mailOptions) {
            // send mail with defined transport object 
            return new Promise(function (resolve, reject) {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info.response);
                    }
                });
            });
        }

        static async sendResetPasswordMessage(email, pass) {
            return await new Promise(function (resolve, reject) {
                global.request.post('http://www.komparevs.com/rpc.php?c=Emails&m=sendResetPassword', {form: {to_email: email, password: pass}}, (err, response, result) => {
                    if (result) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        }

        static async sendUserFeedbackMessage(_data) {
            return await new Promise(function (resolve, reject) {
                const data = {message: _data.message, toEmail: 'feedback@komparevs.com'};
                if (_data.name) {
                    data.name = _data.name;
                }
                if (_data.email) {
                    data.email = _data.email;
                }

                global.request.post('http://www.komparevs.com/rpc.php?c=Emails&m=sendEmail', {form: data}, (err, response, result) => {
                    if (result) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        }

        static async sendUserHelpMessage(_data) {
            return await new Promise(function (resolve, reject) {
                const data = {email: _data.email, message: _data.message, toEmail: 'support@komparevs.com'};
                if (_data.name) {
                    data.name = _data.name;
                }

                global.request.post('http://www.komparevs.com/rpc.php?c=Emails&m=sendEmail', {form: data}, (err, response, result) => {
                    if (result) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        }
    }

    self.EmailUtils = EmailUtils;
})();