// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {Permissions} from 'utils/Utils';
import {execWhen} from "utils/UtilsFuns";

import {ClearableInput, ProfilePic, SelectEmployeeInput} from 'components/inputs';
// </editor-fold>

//<editor-fold desc="UserDetails">
@observer
class UserDetails extends React.Component {

    showPasswords() {
        if (!this.props.isNewContractorUser) return;

        execWhen(() => this.refs.password).then(ref => ref.show());
        execWhen(() => this.refs.conf_password).then(ref => ref.show());
    }

    hidePasswords() {
        if (!this.props.isNewContractorUser) return;

        execWhen(() => this.refs.password).then(ref => ref.hide());
        execWhen(() => this.refs.conf_password).then(ref => ref.hide());
    }

    //<editor-fold desc="renderEmployeeNames">
    get renderEmployeeNames() {
        const {isNewContractorUser, onChange} = this.props;
        if (!isNewContractorUser && Permissions.hasModule('Employees')) {
            return <React.Fragment>
                <SelectEmployeeInput ref="fname" name="fname" type="select" placeholder="First Name"
                                     footerDesc="enter existing employee" required className="col-lg-6 form-control"
                                     onChange={onChange} add/>
                <SelectEmployeeInput ref="lname" name="lname" type="select" placeholder="Last Name"
                                     footerDesc="enter existing employee" required className="col-lg-6 form-control"
                                     onChange={onChange} add/>
            </React.Fragment>;
        }
        return <React.Fragment>
            <ClearableInput ref="fname" name="fname" type="text" placeholder="First Name" required
                            className="col-lg-6 form-control" onChange={onChange}/>
            <ClearableInput ref="lname" name="lname" type="text" placeholder="Last Name" required
                            className="col-lg-6 form-control" onChange={onChange}/>
        </React.Fragment>;
    }

    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {usernameStatus: {valid, required, duplicate, exist, username, loading, uid}, onChange} = this.props;
        if (!(valid && (uid || (!duplicate && !exist))) || loading) {
            return null;
        }

        return <React.Fragment>
            <ProfilePic ref="profile_pic" name="profile_pic" onChange={onChange}/>
            {this.renderEmployeeNames}
            <div className="clearfix"/>
            <ClearableInput ref="password" name="password" type="password" placeholder="Password" rendered={false}
                            className="col-lg-12 form-control" onChange={onChange}/>
            <ClearableInput ref="conf_password" name="conf_password" type="password" placeholder="Confirmation Password"
                            rendered={false} className="col-lg-12 form-control" onChange={onChange}/>
        </React.Fragment>;
    }

    // </editor-fold>
}
//</editor-fold>

export default UserDetails;
