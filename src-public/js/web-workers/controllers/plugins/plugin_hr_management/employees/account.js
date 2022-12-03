
(function () {
    class Controller extends AAccountsCntr {
        // <editor-fold defaultstate="collapsed" desc="constructor">
        //name, desc, approvers_manager, approvers_others, minimum_approval, options
        constructor(events, db) {
            super(events, db, {singular: "Employee", plural: "Employees"}, "plugin_sheq_assist/employees/accounts/");

            this.tbl = TBL_EMPLOYEES;

            const {addAction} = this;
        }
        // </editor-fold>

        getDB() {
            return db_hr;
        }

        get isStaff() {
            return true;
        }

        get access_type() {
            return 'Staff';
        }

        get auth() {
            return auth_hr;
        }
        
        get functions() {
            return functions_hr;
        }
        
    }

    const staffCntr = new Controller(events, db);

    // <editor-fold defaultstate="collapsed" desc="auth.onAuthStateChanged">
    auth_hr.onAuthStateChanged((staff) => {
        const {accountStatus, accountStatusNewUser} = staffCntr;
//        console.log('staff', staff);
//        console.log('accountStatus', accountStatus);
//        console.log('accountStatusNewUser', accountStatusNewUser);

        if (staff) {
            if (accountStatus === 'CREATING') {
                execWhen(() => staffCntr.accountStatus === 'CREATED').then(() => {
                    staffCntr.onLogin();
                    Events.emit(staffCntr.root + 'create', accountStatusNewUser);
                    delete staffCntr.accountStatus;
                    delete staffCntr.accountStatusNewUser;
                });
            } else {
            }
        } else if (self.session.isLoggedIn()) {
        }
    });
    // </editor-fold>

})();//296