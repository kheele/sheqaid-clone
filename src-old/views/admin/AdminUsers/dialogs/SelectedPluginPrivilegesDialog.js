import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {AProfileDialog} from '../../../../components/dialogs';

import style from "./SelectedPluginPrivilegesDialog.lazy.css";

@observer
class SelectedPluginPrivilegesDialog extends AProfileDialog {
    pageKey = "SelectedPluginPrivilegesDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return pluginManager.selected.title + ' Privileges';
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
//        this.refs.employeesDialog.open("department.name", this.item.data.name);
    }

    get item() {
//        return this.props.state.item;
    }

    render() {
//        if (!this.item)
//            return null;
        const {
            props: {dialog: {renderProfileCover}},
//            item: {
//                id, data: {
//                    created_at, name, manager, parent_department
//                }
//            }
        } = this;
        
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h3>{/*name*/}</h3>
                    <h5>{/*'Create On ' + Dates.formatDate(created_at)*/}</h5>
                </React.Fragment>)}
            </div>
        </div>;
    }

}

export default SelectedPluginPrivilegesDialog;
