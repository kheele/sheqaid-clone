self.execWhen = (test) => {
    return new Promise((resolve, reject) => {
        const exec = async () => {
            let res = test();
            if (res instanceof Promise) {
                res = await res;
            }
            if (res) {
                resolve(res);
            } else {
                if (self.setImmediate) {
                    setImmediate(exec);
                } else {
                    setTimeout(exec, 0);
                }
            }
        };
        exec();
    });
};

class ExpiryCodes {
    static color(expiry_date) {
        const d = new Date();
        const {_data: {months, days, hours, minutes, seconds}} = d.durationNext(Dates.parse(expiry_date));

        let color;
        if (months <= 0 && days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
            color = 'grey';
        } else if (months === 0) {
            color = 'red';
        } else if (months === 1) {
            color = 'orange';
        } else if (months === 2) {
            color = 'yellow';
        } else {
            color = 'green';
        }
        return color;
    }

    static colorCode(expiry_date) {
        let color = ExpiryCodes.color(expiry_date);
        return {'grey': -1, 'red': 1, 'orange': 2, 'yellow': 3, 'green': 4}[color];
    }

    static colorClassName(expiry_date) {
        return ExpiryCodes.color(expiry_date) + ' color-light';
    }
}

Number.prototype.rangeExpiryCodes = function (val) {
    return ExpiryCodes.colorCode(this) === val;
};

class Utils {
    static toArray(args) {
        const array = [];
        for (let n in args) {
            array.push(args[n]);
        }
        return array;
    }

    static onLogout() {
        const {lists, observers} = self;
        Object.keys(lists).forEach(key => {
            delete lists[key];
        });
        Object.keys(observers).forEach(tbl => {
            const observer = observers[tbl];
//        observer remove
            delete observers[tbl];
        });
    }

    static onLogin() {
        const {callbacks} = self;
        Object.keys(callbacks).distinct().forEach(key => {
            callbacks[key]();
        });
    }

    static getAppDownloadOptionMsg(params = {}) {
        const {isEmployee = false, isContractor = false} = params || {};
        
        //<p>1) <a target="_blank" href="https://forms.sheqaid.com">https://forms.sheqaid.com</a><br/></p>\n\
        const path = self.locationRoot.contains('localhost:') ? 'https://web.sheqaid.com/' : self.locationRoot;
        if (isContractor) {
            return `<p>
                    Note: <br/>
                    1. Use the <b>username</b> provided above to log in,<br/>
                    2. We will send you <b>One-Time Password (OTP)</b>,<br/>
                    3. You will be required to <b>verify</b> the <b>OTP</b> sent to you,<br/>
                    4. Then set up the <b>administrator</b> of your account,<br/>
                    5. You can add <b>additional users</b> in the system if needed<br/>
                </p>
                <p>Please access the application from one of the following option:</p>
                <p>1. On Web/Cloud: use this <a target="_blank" href="https://web.sheqaid.com">https://web.sheqaid.com</a>.</p>
                <p>2. On Windows: download the application <a target="_blank" href="${path}updater/sheqassist-1.1.0.exe">here</a>.</p>
                <p>Kind Regards<br/>SHEQ Aid</p>`;
        }
        return `<p>Note: ${!isEmployee ? 'use the username and password provided to login' : 'login the application to setup your Password'}</p>
            ${!isEmployee ? '<p>You are strongly adviced to change your password as soon as you login in to SHEQ Aid account</p>' : ''} 
            <p>Please access the application from one of the following option:</p>
            <p>1. On Web/Cloud: use this <a target="_blank" href="https://web.sheqaid.com">https://web.sheqaid.com</a>.</p>
            <p>2. On Windows: download the application <a target="_blank" href="${path}updater/sheqassist-1.1.0.exe">here</a>.</p>
            <p>Kind Regards<br/>SHEQ Aid</p>`;
    }
}