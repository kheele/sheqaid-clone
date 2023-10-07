
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

self.convertIdToBigint = (encodedHasuraRelayID) => {
	try {
		const decodedRelayID = atob(encodedHasuraRelayID);
		const relayIdAsArray = JSON.parse(decodedRelayID);
		const actualDatabaseID = relayIdAsArray[3];
		// console.log(decodedRelayID); // "[1, \"lifeplan\", \"status_plan_header\", 1]"
		// console.log(relayIdAsArray); // [1, "lifeplan", "status_plan_header", 1]
		// console.log(actualDatabaseID); // 1  (the actual database ID)!
		return actualDatabaseID;
	} catch (e) {
		return encodedHasuraRelayID;
	}
};

self.convertMutations = convertMutations = (obj) => {
	if (isArray(obj)) {
		return obj.map(convertMutations);
	} else if (typeof obj === 'object' && !isNullable(obj)) {
		let newObj = {};
		const keys = Object.keys(obj);
		for (let n = 0; n < keys.length; n++) {
			const key = keys[n];
			let value = obj[key];
			if (isDate(value)) {
				value = Dates.parse(value);
			} else if (isArray(value)) {
				value = value.map(convertMutations);
			} else if (typeof value === 'object' && !isNullable(value)) {
				value = convertMutations(value);
			} else {
				if (key === 'id' || (key.endsWith('_id') && key !== 'auth_id')) {
					value = convertIdToBigint(value);
				} else if (key.endsWith('_list') && isNullable(value)) {
					value = [];
				}
			}
			if (key !== "__typename") {
				newObj[key] = value;
			}
		}
		return newObj;
	}
	return obj;
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

	static daysPrev(expiry_date) {
		if (!expiry_date) return null;
		const d = new Date();
		const otherD = expiry_date instanceof Date ? expiry_date : Dates.parse(expiry_date);
		console.log('ExpiryCodes.daysPrev', d.durationPrevDays(otherD))
		return d.durationPrevDays(otherD);
	}

	static daysNext(expiry_date) {
		if (!expiry_date) return null;
		const d = new Date();
		const otherD = expiry_date instanceof Date ? expiry_date : Dates.parse(expiry_date);
		console.log('ExpiryCodes.daysNext', d.durationNextDays(otherD))
		return d.durationNextDays(otherD);
	}

	static expiryDateWithDue(expiry_date) {
		if (expiry_date) {
			const days = Utils.daysPrev(expiry_date);
			if (days !== null) {
				let expiry_due;
				if (days !== null) {
					const exactDays = Math.floor(days);
					if (exactDays === 0) {
						expiry_due = 'Due today';
					} else if (exactDays > 0) {
						expiry_due = `${exactDays} days due`;
					} else if (exactDays < 0) {
						expiry_due = `Due in ${-exactDays} day${exactDays === -1 ? '' : 's'}`;
					}
					expiry_date = `${expiry_date.formatDate()}\n(${expiry_due})`
				}
			}
		}
		return expiry_date;
	}

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

	static async cookie(key) {
		return await Events.emit("cookie", key);
	}

	static async sendEmail(opts) {
		// console.log('callables-sendEmail', opts)
		// const sendEmail = functions.httpsCallable('callables-sendEmail');
		// const mailRes = await sendEmail(opts);
		const mailRes = await Utils.apiCallable({path: 'sendEmail', data: opts});
		console.log('mailRes', mailRes)
		return mailRes;
	}

	static async apiCallable({path, access_type = 'User', data}) {
		// const port = access_type === 'Staff' ? 5002 : access_type === 'ContractorUser' ? 5001 : 5000;

		return await fetch(`${SERVER_HOST}/api/callables/${path}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}).then(res => res.json());
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
                <p>Best Regards<br/>SHEQ Aid</p>`;
		}
		return `<p>Note: ${!isEmployee ? 'use the username and password provided to login' : 'login the application to setup your Password'}</p>
            ${!isEmployee ? '<p>You are strongly adviced to change your password as soon as you login in to SHEQ Aid account</p>' : ''} 
            <p>Please access the application from one of the following option:</p>
            <p>1. On Web/Cloud: use this <a target="_blank" href="https://web.sheqaid.com">https://web.sheqaid.com</a>.</p>
            <p>2. On Windows: download the application <a target="_blank" href="${path}updater/sheqassist-1.1.0.exe">here</a>.</p>
            <p>Best Regards<br/>SHEQ Aid</p>`;
	}
}