import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from 'utils/Utils';
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import {ConfirmDialog} from 'components/dialogs';
import {ActionsButton, ClearableInput, SelectEmployeeInput} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import NewVaccineCertificateDialog from './VaccineCertificates/NewVaccineCertificateDialog';
import EditVaccineCertificateDialog from './VaccineCertificates/EditVaccineCertificateDialog';
import ProfileVaccineCertificateDialog from './VaccineCertificates/ProfileVaccineCertificateDialog';

import style from "./VaccineCertificatesTab.lazy.css";

@observer
class VaccineCertificatesTab extends React.Component {
    path;
    pageKey = "VaccineCertificatesTab";

    @observable
    state = {
        lists: {
            vaccinated: [{text: "Yes", value: "Yes", checked: false}, {text: "No", value: "No", checked: false}]
        }
    };
    
    constructor(props) {
        super(props);

        this.path = props.path + 'vaccine-certificates/';

        this.renderItem = this.renderItem.bind(this);
//        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
/*    renderLeftButtons() {
//	return <div className="left-buttons pull-left">
	</div>//;
//    }*/
    // </editor-fold>
    
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
    }

    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <SelectEmployeeInput name="employee" placeholder="Employee..." className="form-control" onChange={onChange}/>
            <ClearableInput name="vaccinated" type="radio" placeholder="Vaccinated" className="form-control" onChange={onChange} values={this.state.lists.vaccinated}/>
        </div>;
    }

    renderTHead() {
        return  <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Employee</div>
            <div className="td">Vaccinated</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        let {id, data: {
                fname, lname, 
                optional_info, client, project, site, client_id, project_id, site_id,
                
                employee_vaccine_list, sub_collection_keys: {
                    employee_vaccine_list: {latest, id: ids}
                }
            }
        } = item;
        
        const last = employee_vaccine_list[latest.id];
        const {created_at, vaccinated} = last;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{lname + ' ' + fname}</div>
            <div className="td">{vaccinated}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    render() {
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Vaccine Certificates"
            pageTitleSingular="vaccine certificate"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog"/>
            
            <NewVaccineCertificateDialog ref="newDialog"/>
            <EditVaccineCertificateDialog ref="editDialog"/>
            <ProfileVaccineCertificateDialog ref="profileDialog"/>
        </APageListReadWrite>;
    }
}

export default VaccineCertificatesTab;
