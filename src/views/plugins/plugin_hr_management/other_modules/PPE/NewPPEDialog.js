// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {ANewDialog} from 'components/dialogs';
import {
    ClearableInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput,
    UploadButton
} from 'components/inputs';
import {
    NewDepartmentListTable,
    NewJobPositionListTable,
    NewTeamListTable
} from 'components/FormTableComponents';
import {Row} from 'components/FormComponents';

import style from "./NewPPEDialog.lazy.css";
import insertPPE from "mutations/all/PPE/insertPPE";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewPPEDialog";
    title = "Create PPE Item";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/employees/ppe/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            duration_type: [
                {text: "Years", value: "Years", checked: false}, 
                {text: "Months", value: "Months", checked: false},
                {text: 'Weeks', value: 'Weeks', checked: false},
                {text: 'Days', value: 'Days', checked: false}
            ]
        },
        duration_type: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("qty_received", this.onChangeQtyReceived.bind(this));
        this.form.addChangeOne("qty_issued", this.onChangeQtyIssued.bind(this));
        this.form.addChangeOne("duration_type", this.onChangeDurationType.bind(this));
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeQtyReceived(el, val) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.qty_received && this.refs.qty_issued && this.refs.qty_in_stock).then(list_ref => {
            const {qty_issued, qty_in_stock} = this.refs;
            val = val || 0;
            const res = val - (qty_issued.hasValue ? qty_issued.value : 0);
            qty_in_stock.setEditable(true);
            qty_in_stock.onChange(res);
            qty_in_stock.setEditable(false);
        });
    }
    
    onChangeQtyIssued(el, val) {
        const {execWhen} = this.props;
        execWhen(() => this.refs.qty_received && this.refs.qty_issued && this.refs.qty_in_stock).then(list_ref => {
            const {qty_received, qty_in_stock} = this.refs;
            val = val || 0;
            const res = (qty_received.hasValue ? qty_received.value : 0) - val;
            qty_in_stock.setEditable(true);
            qty_in_stock.onChange(res);
            qty_in_stock.setEditable(false);
        });
    }
    
    onChangeDurationType(el, val) {
        this.state.duration_type = val;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
            // if (!form.isValid('project')) {
            //     infoDialog.open('Project is required');
            //     return;
            // }
            // if (!form.isValid('site')) {
            //     infoDialog.open('Site is required');
            //     return;
            // }
        }
        if(idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Item Description is required');
                return;
            }
            if (!form.isValid('unit')) {
                infoDialog.open('Item Unit is required');
                return;
            }
            if (form.isValid('duration_type') && !form.isValid('duration_value')) {
                infoDialog.open('Duration Value is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;

        //1
        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        // if (!form.isValid('project')) {
        //     infoDialog.open('Project is required');
        //     return;
        // }
        // if (!form.isValid('site')) {
        //     infoDialog.open('Site is required');
        //     return;
        // }
        
        //2
        if (!form.isValid('name')) {
            infoDialog.open('Item Description is required');
            return;
        }
        if (!form.isValid('unit')) {
            infoDialog.open('Item Unit is required');
            return;
        }
        if (form.isValid('duration_type') && !form.isValid('duration_value')) {
            infoDialog.open('Duration Value is required');
            return;
        }
        
        const {
            site,
            project,
            client,
            //
            name,
            unit,
            qty_received,
            qty_issued,
            qty_in_stock,
            duration_type,
            duration_value,
            notes,
            profile_pic,
            //
            team_list,
            department_list,
            job_position_list
        } = form.data;
        const data = {
            name,
            unit,
            qty_received,
            qty_issued,
            qty_in_stock,
            duration_type,
            duration_value: isNumber(duration_value) && duration_value,
            notes,
            profile_pic: profile_pic && profile_pic.path,

            client_id: client && client.id,
            project_id: project && project.id,
            site_id: site && site.id,

            team_list: {
                data: (team_list || []).map(v => {
                    if(v.team) {
                        return {team_id: v.team.id};
                    } else {
                        return {team_id: v.id};
                    }
                }),
            },
            department_list: {
                data: (department_list || []).map(v => {
                    if(v.department) {
                        return {department_id: v.department.id};
                    } else {
                        return {department_id: v.id};
                    }
                }),
            },
            job_position_list: {
                data: (job_position_list || []).map(v => {
                    if(v.job_position) {
                        return {job_position_id: v.job_position.id};
                    } else {
                        return {job_position_id: v.id};
                    }
                }),
            },
        };
        
        console.log(data)

        btn.text("Saving...").disabled();
        progressDialog.open();
        insertPPE(data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
            setTimeout(() => progressDialog.close());
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row 
                    active
                    rendered 
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={1}
                    title="1. Item Details" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext} 
                    onFormBack={onFormBack} 
                >
                    <ClearableInput name="name" type="text" placeholder="Item Description" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="unit" type="text" placeholder="Item Unit" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="qty_received" name="qty_received" type="number" placeholder="Quantity Received" defaultValue={0} isClearable={false} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="qty_issued" name="qty_issued" type="number" placeholder="Quantity Issued" defaultValue={0} isClearable={false} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    <ClearableInput ref="qty_in_stock" name="qty_in_stock" type="number" placeholder="Quantity In Stock" defaultValue={0} isClearable={false} isEditable={false} className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    <ClearableInput name="duration_type" type="radio" placeholder="Duration Type" vertical className="col-lg-12 form-control" onChange={this.form.onChange} values={this.state.lists.duration_type} returnValue/>
                    <DurationValueWrapper state={this.state} onChange={this.form.onChange}/>
                    <ClearableInput name="notes" type="textarea" placeholder="Notes" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                    <UploadButton 
                        name="profile_pic" 
                        buttonTitle="PPE Item Photo" 
                        type={['Photo']}
                        showOnlyIcon 
                        className="col-lg-6 col-xs-12 hor-center"
                        onChange={this.form.onChange}
                    />
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Teams / Departments / Job Positions" 
                    onFormOpen={onFormOpen}  
                    onFormBack={onFormBack} 
                >
                    <NewTeamListTable name="team_list" title="Team(s)" onChange={this.form.onChange}/>
                    <hr className="pull-left margin-t-5 margin-b-15"/>
                    <NewDepartmentListTable name="department_list" title="Department(s)" onChange={this.form.onChange}/>
                    <hr className="pull-left margin-t-5 margin-b-15"/>
                    <NewJobPositionListTable name="job_position_list" title="Job Position(s)" onChange={this.form.onChange}/>
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="DurationValueWrapper">
@observer
class DurationValueWrapper extends React.Component {
    
    render() {
        const {state, onChange} = this.props;
        if(!state.duration_type) return null;
        return <ClearableInput name="duration_value" type="number" placeholder="Duration Value" required className="col-lg-12 form-control" onChange={onChange}/>;
    }
}
// </editor-fold>

export default NewDialog;
