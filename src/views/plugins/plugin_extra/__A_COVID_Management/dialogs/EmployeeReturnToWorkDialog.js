import React from "react";
import {observer} from 'mobx-react';
import {AProfileDialog} from 'components/dialogs';
import {ProfilePic} from 'components/inputs';

import {EmployeeReturnToWorkCaseList} from './EmployeeLists';

import style from "./EmployeeReturnToWorkDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "EmployeeReturnToWorkDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Employee Return To Work Case(s)";
    }

    get topButtonsHiddenDelete() {
        return true;
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    constructor(props) {
        super(props);
    }

    get item() {
        return this.props.state.item;
    }
    
    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item: {_group: group, list}
        } = this;
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <ProfilePic profilePic="employees" id={group.id} readonly className="x60 hor-center margin-b-5"/>
                    <h3>{group.lname + " " + group.fname}</h3>
                </React.Fragment>)}
                <EmployeeReturnToWorkCaseList list={list}/>
            </div>
        </div>;
    }

}

export default ProfileDialog;
