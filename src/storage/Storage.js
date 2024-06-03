import moment from 'moment';
import {autorun, computed, observable, toJS} from 'mobx';

// import indexedStorage from '../utils/StorageCreator';

import * as storageUtils from './';
import {execWhen} from "../utils/UtilsFuns";

const {is, load} = storageUtils;

class Storage {

    attrs = observable.map({});
    isLoaded = false;

    constructor() {
        Object.keys(storageUtils).forEach(key => {
            const obj = storageUtils[key];
            obj.storage = this;
            this[key] = obj;
        });

        // load.loadCountries();

        autorun(() => {
            if (is.isLoggedIn) {
                if (isAdminApp) {
                    document.title = "SHEQ Aid - Admin";
                } else {
                    const {trialDaysLeft} = this;
                    const {isConsultant, isTrial} = is;
                    const clientType = isConsultant ? 'Consultant' : 'Client';

                    if (isTrial) {
                        document.title = "SHEQ Aid (" + clientType + ") - Trial Version [" + trialDaysLeft + " days left]";
                    } else {
                        document.title = "SHEQ Aid (" + clientType + ") - Premium Version";
                    }
                }
            }
        });

        const onLogin = async (currentUser) => {
            if (currentUser) {
                this.onLogin(currentUser);
            } else {
                this.attrs.delete("loggedUserAuth");
                this.attrs.delete("idTokenResult");
            }
        };

        const listenAuth = () => {
            Promise.all([
                new Promise(function (resolve, reject) {
                    auth.onAuthStateChanged(currentUser => {
                        // onLogin(currentUser);
                        resolve(currentUser);
                    });
                }),
                new Promise(function (resolve, reject) {
                    auth2.onAuthStateChanged(currentUser => {
                        // onLogin(currentUser);
                        resolve(currentUser);
                    });
                }),
            ]).then(list => {
                const currentUser = list.find(item => !!item);
                return onLogin(currentUser);
            }).then(() => {
                this.loggedUserAuthChecked = true;
            });
        };
        listenAuth();
        
        // workers.on("getIdTokenResult", () => {
        //     this.loggedUserAuth.getIdTokenResult(true).then(idTokenResult => {
        //         this.idTokenResult = idTokenResult;
        //     }).catch(async err => {
        //         console.error(err)
        //     });
        // });
    }

    get toJS() {
        const _toJS = toJS(this.attrs);
//        _toJS.bankDetailList = this.bankDetailListView.map(val => val.asJSON);
//        _toJS.cardDetailList = this.cardDetailListView.map(val => val.asJSON);
//        _toJS.eftDetailList = this.eftDetailListView.map(val => val.asJSON);
//        _toJS.paymentHistoryList = this.paymentHistoryListView.map(val => val.asJSON);
        return _toJS;
    }

    async onLogin(currentUser) {
//                    if(access_type === 'User' && currentUser.email === 'kheelet@gmail.com') {
//                        currentUser.unlink(firebase.auth.PhoneAuthProvider.PROVIDER_ID);
//                    }
	    if(currentUser) {
		    this.attrs.set("loggedUserAuth", currentUser);
		    return this.updateIdTokenResult(currentUser);
	    }
    }
    
    async updateIdTokenResult(currentUser) {
        if(currentUser) {
            return currentUser.getIdTokenResult(true).then(idTokenResult => {
                this.idTokenResult = idTokenResult;
                return idTokenResult;
            }).catch(async err => {
                console.error(err)
            });
        }
    }

    set loggedUserAuthChecked(val) {
        this.attrs.set("loggedUserAuthChecked", val);
    }

    @computed
    get loggedUserAuth() {
        return this.attrs.get("loggedUserAuth");
    }

    set loggedUserAuth(val) {
        this.attrs.set("loggedUserAuth", val);
    }

    @computed
    get loggedUser() {
        return this.attrs.get("loggedUser");
    }

    @computed
    get accountLastBilling() {
        const {account_billing_list = []} = this.loggedUser.company.data;
//        account_billing_list.push({date: '', amount: 500});
        return account_billing_list.getLastElement();
    }

    @computed
    get loggedContractor() {
        return this.attrs.get("contractor");
    }

    @computed
    get loggedContractorClient() {
        return this.attrs.get("loggedContractorClient");
    }

    @computed
    get loggedContractorSite() {
        return this.attrs.get("loggedContractorSite");
    }

    @computed
    get idTokenResult() {
        return this.attrs.get("idTokenResult");
    }

    set idTokenResult(idTokenResult) {
        this.attrs.set("idTokenResult", idTokenResult);
    }
    
    set isNewContractorUserOTPStatus(val) {
        this.attrs.set("isNewContractorUserOTPStatus", val);
    }

    setIsNewContractorUserOTPStatusVerified() {
        this.isNewContractorUserOTPStatus = 'Verified';
    }

    setIsNewContractorUserOTPStatusSent() {
        this.isNewContractorUserOTPStatus = 'Sent';
    }

    @computed
    get access_type() {
        if (!this.attrs.has("idTokenResult"))
            return null;
        const {claims: {access_type}} = this.idTokenResult;
        return access_type;
    }

    @computed
    get trialDaysLeft() {
        if (is.isTrial) {
            let {data: {created_at, trial_start_date, trial_max_days}} = this.loggedUser.company;
//            trial_start_date = "01/03/2021".toDate();
//            console.log(this.loggedUser.company)
            const startDate = (trial_start_date || created_at).toDayEndDate();
            let futureDate;
            if (is.isConsultant) {
                futureDate = startDate.addDays(trial_max_days || 7);
                const futureMonthEnd = futureDate.toMonthEndDate();
                if (startDate.getDate() !== futureDate.getDate() && moment(futureDate).isSame(moment(futureMonthEnd).format('YYYY-MM-DD'))) {
                    futureDate = futureDate.addDays(1);
                }
            } else if (is.isClient) {
                futureDate = startDate.addDays(trial_max_days || 30);
                const futureMonthEnd = futureDate.toMonthEndDate();
                if (startDate.getDate() !== futureDate.getDate() && moment(futureDate).isSame(moment(futureMonthEnd).format('YYYY-MM-DD'))) {
                    futureDate = futureDate.addDays(1);
                }
            }
            let d = new Date().toDayEndDate();
            let {_data, _data: {months, days, hours, minutes, seconds}} = d.durationNext(futureDate);
            if (months > 0) {
                d = d.addDays(1);
                days = d.durationNextDays(futureDate) + 1;
            }
            return days;
        }
        return 0;
    }

}

const storage = new Storage();
window.storage = storage;
export default storage;
