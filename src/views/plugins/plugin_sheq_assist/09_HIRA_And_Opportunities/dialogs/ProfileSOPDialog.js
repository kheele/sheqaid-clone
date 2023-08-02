import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

import style from "./ProfileSOPDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileSOPDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Safety Operating Procedure";
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
    }

    get item() {
        return this.props.state.item;
    }
    
    render() {
        if (!this.item)
            return null;
        let {
            props: {dialog: {renderProfileCover}},
             item, item: {
                id, data: {
                    created_at,
                    category, risk_level, location, 
                    prepared_by, date_created, date_revised,
                    photo,
                    risk_list, close_down_list, safety_pre_requesite_list, custom_safety_pre_requesite_list, procedure_list, key_point_list, operation_list,
                    other
                }
            }
        } = this;
        if(safety_pre_requesite_list) {
            safety_pre_requesite_list = safety_pre_requesite_list.filter(({checked}) => checked);
        }
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row col-lg-6 min-h-480">
                    <div className="row sec-group">
                        <ProfileField name="category" type="radio" placeholder="Category" value={category} required className="col-lg-12"/>
                        <ProfileField name="risk_level" type="radio" placeholder="Risk Level" value={risk_level} required className="col-lg-12"/>
                        <ProfileField name="location" type="select" placeholder="Risk Task Location" value={location} required className="col-lg-12"/>
                        
                        <ProfileField name="prepared_by" type="select" placeholder="Prepared By" value={prepared_by} renderer={v => v.fname + ' ' + v.lname} required className="col-lg-12"/>
                        <ProfileField name="date_created" type="date" placeholder="Date Created" value={date_created} required className="col-lg-6"/>
                        <ProfileField name="date_revised" type="date" placeholder="Date Revised" value={date_revised} required className="col-lg-6"/>
                    </div>
                </div>
                <div className="row col-lg-6 h-480 pull-right">
                    <ProfileField name="photo" type="file" placeholder="Picture" value={photo} className="col-lg-12 w-full h-full"/>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Risks Associated With The Equipment / Procedure</label>
                    <div className="row sec-group">
                        <NewRiskListTable name="risk_list" defaultValue={risk_list || []}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Close Down</label>
                    <div className="row sec-group">
                        <NewCloseDownListTable name="close_down_list" defaultValue={close_down_list || []}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Safety Pre-requesites</label>
                    <div className="row sec-group">
                        <NewSafetyPreRequesiteListTable name="safety_pre_requesite_list" defaultValue={safety_pre_requesite_list || []}/>
                    </div>
                    <label className="margin-t-10">Custom Safety Pre-requesites</label>
                    <div className="row sec-group">
                        <NewCustomSafetyPreRequesiteListTable name="custom_safety_pre_requesite_list" defaultValue={custom_safety_pre_requesite_list || []}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>Procedures</label>
                    <div className="row sec-group">
                        <NewProcedureListTable name="procedure_list" defaultValue={procedure_list || []}/>
                    </div>
                    <div className="row sec-group">
                        <NewKeyPointListTable name="key_point_list" defaultValue={key_point_list || []}/>
                    </div>
                    <div className="row sec-group">
                        <NewOperationListTable name="operation_list" defaultValue={operation_list || []}/>
                    </div>
                </div>
                <div className="row col-lg-12 w-full">
                    <label>OTHER - Exit text</label>
                    <div className="row sec-group">
                        <ProfileField name="other" type="textarea" value={other} className="col-lg-12"/>
                    </div>
                </div>
            </div>
        </div>;
    }

}

@observer
class ANewListTable extends ATableSavable {
    @observable
    selfState = {
    };
    constructor(props) {
        super(props);
    }
    
    renderItem(n, onClick) {
        const item = this.list[n];
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td fixed-flex min-w-20"><span>{n + 1}</span></div>
            <div className="td padding-l-0 padding-r-0">{item.text || item.desc}</div>
        </TRow>;
    }

    render() {
        return (<Table className="w-full padding-0 margin-0 min-h-130">
            <THead className="align-left">
                <div className="td fixed-flex min-w-20"></div>
                <div className="td padding-l-0 padding-r-0">{this.title}</div>
            </THead>
            <TBody ref="body" title={this.title} renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

@observer
class NewRiskListTable extends ANewListTable {
    title = "Risk Associated With The Equipment / Procedure";
    constructor(props) {
        super(props);
    }
}
@observer
class NewCloseDownListTable extends ANewListTable {
    title = "Close Down";
    constructor(props) {
        super(props);
    }
}
@observer
class NewSafetyPreRequesiteListTable extends ANewListTable {
    title = "Safety Pre-requesite";
    constructor(props) {
        super(props);
    }
}
@observer
class NewCustomSafetyPreRequesiteListTable extends ANewListTable {
    title = "Custom Safety Pre-requesites";
    constructor(props) {
        super(props);
    }
}
@observer
class NewProcedureListTable extends ANewListTable {
    title = "Pre-start Check";
    constructor(props) {
        super(props);
    }
}
@observer
class NewKeyPointListTable extends ANewListTable {
    title = "Key Points";
    constructor(props) {
        super(props);
    }
}
@observer
class NewOperationListTable extends ANewListTable {
    title = "Operations";
    constructor(props) {
        super(props);
    }
}

export default ProfileDialog;
