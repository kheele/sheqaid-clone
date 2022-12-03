import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from '../../../../utils/Utils';
import {AProfileDialog} from '../../../../components/dialogs';
import {Button, ProfileField} from '../../../../components/inputs';

import style from "./PluginsPrivilegesDialog.lazy.css";

@observer
class PluginsPrivilegesDialog extends AProfileDialog {
    pageKey = "PluginsPrivilegesDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return 'Plugins Privileges';
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    
    @observable
    state = {
    };
    
    constructor(props) {
        super(props);
        
//        this.onClick = this.onClick.bind(this);
//        
//        this.form = new Form();
    }
    
    onClick(e){
//        this.refs.employeesDialog.open("job_position.name", this.item.data.name);
    }

    render() {
//        if (!this.item)
//            return null;
//        const {
//            props: {dialog: {renderProfileCover}},
//            item: {
//                id, data: {
//                    created_at, name, department, desc
//                }
//            }
//        } = this;
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{name}</h3>
                    <h5>{'Create On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <ProfileField title="Job Position" name="name" value={name} className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <div className="row">
                    <ProfileField title="Department" name="department" value={department} renderer={val => (val.name)} className="col-lg-12" type="select"/>
                </div>
                <div className="row">
                    <ProfileField title="Job Description" name="desc" value={desc} type="textarea" className="col-lg-12" onChange={this.form.onChange}/>
                </div>
                <Button className="btn btn-primary hor-center" onClick={this.onClick}>View Employees</Button>
            </div>
        </div>;
    }

}

export default PluginsPrivilegesDialog;
