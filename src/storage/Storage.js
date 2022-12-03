import moment from 'moment';
import {autorun, computed, observable, toJS} from 'mobx';
import firestore from '../firestore/Firestore';

import indexedStorage from '../utils/StorageCreator';

import * as storageUtils from './';

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

        firestore.start().then(res => {
            return Promise.all([
                load.loadCountries(),
            ]);
        }).catch(e => {
            console.log(e)
//            infoDialog.open("An error occurred. Please restart the application and ensure that you are connected to the internet.");
        });

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

        const onAuthChanged = (access_type) => {
            return currentUser => {
//                alert(`onAuthChanged: ${access_type} - ${currentUser}`)
                if (currentUser) {
//                    if(access_type === 'User' && currentUser.email === 'kheelet@gmail.com') {
//                        currentUser.unlink(firebase.auth.PhoneAuthProvider.PROVIDER_ID);
//                    }
                    this.attrs.set("loggedUserAuth", currentUser);
                    currentUser.getIdTokenResult(true).then(idTokenResult => {
                        this.idTokenResult = idTokenResult;
                    }).catch(async err => {
                        console.error(err)
                        const loggedUser = await indexedStorage.loggedUser.find(1);
                        if (loggedUser) {
                            const {access_type} = loggedUser;
                            this.idTokenResult = {
                                claims: {
                                    access_type,
                                    user_id: currentUser.uid
                                }
                            };
                        }
                    });
                } else {
                    this.attrs.delete("loggedUserAuth");
                    this.attrs.delete("idTokenResult");
//                    alert(access_type)
                }
            };
        };
        auth.onAuthStateChanged(onAuthChanged('User'));
        auth2.onAuthStateChanged(onAuthChanged('ContractorUser'));
    }

    get toJS() {
        const _toJS = toJS(this.attrs);
//        _toJS.bankDetailList = this.bankDetailListView.map(val => val.asJSON);
//        _toJS.cardDetailList = this.cardDetailListView.map(val => val.asJSON);
//        _toJS.eftDetailList = this.eftDetailListView.map(val => val.asJSON);
//        _toJS.paymentHistoryList = this.paymentHistoryListView.map(val => val.asJSON);
        return _toJS;
    }

    @computed
    get loggedUserAuth() {
        return this.attrs.get("loggedUserAuth");
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
    get idTokenResult() {
        return this.attrs.get("idTokenResult");
    }

    set idTokenResult(idTokenResult) {
        this.attrs.set("idTokenResult", idTokenResult);
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
                futureDate = startDate.addDays(trial_max_days || 5);
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
