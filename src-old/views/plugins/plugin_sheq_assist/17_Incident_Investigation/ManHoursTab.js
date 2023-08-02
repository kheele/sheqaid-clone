// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates, monthArray} from "../../../../utils/Utils";

import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import NewDialog from "./dialogs/NewManHourDialog";
import EditDialog from "./dialogs/EditManHourDialog";
import ProfileDialog from './dialogs/ProfileManHourDialog';

//import ExportIncidentsDialog from './dialogs/ExportIncidentsDialog.js';
//import ProfilePDFReader from './printers/ProfilePDFReader';
import style from "./ManHoursTab.lazy.css";
// </editor-fold>

//SHE Rep., Safety Officer, Safety Manager, Manager, Executive, Safety Committee 

@observer
class ManHoursTab extends React.Component {
    path;
    pageKey = "ManHoursTab";
    
    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
            monthArray: monthArray.map(value => {
                return {label: value, value}; 
            })
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor, componentMount">
    constructor(props) {
        super(props);

        this.path = props.path + "man-hours/";

        this.onExport = this.onExport.bind(this);
        
        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        this.onViewReport = this.onViewReport.bind(this);
        
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="actions">
    onExport(e, btn) {
        this.refs.exportIncidentsDialog.open();
    }
    
    async onSaveAsPDF(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }
    
    onViewReport(e, el) {
        const {idx} = el.props;
        const item = this.refs.root.list[idx];
        this.refs.pdfReader.open(item);
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderLeftButtons">
    renderLeftButtons() {
        const {isEmployee, isContractorView} = storage.is;
        const isReadonly = isEmployee || isContractorView;
        return null;
        /*return !isReadonly && <div className="left-buttons pull-left">
            <Button className="btn btn-primary pull-right" onClick={this.onExport}>
                Export
            </Button>
        </div>;*/
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        
        const {id, data: {}} = item;
        
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
            {/*<hr action="writable"/>
            <NavItem action="print" idx={idx} onClick={this.onViewReport} faIconLeft="file-text" title="View Report"/>
            <NavItem action="print" idx={idx} onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>*/}
        </Options>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls">
            <ClearableInput name="year" type="number" placeholder="Year" className="col-lg-4 form-control" onChange={onChange}/>
            <ClearableInput name="month" type="select" placeholder="Month..." className="col-lg-4 form-control" onChange={onChange} values={this.state.lists.monthArray} returnValue/>
            <ClearableInput name="fiscal_year" type="date" placeholder="Fiscal Year..." className="col-lg-4 form-control fixed-flex fiscal_year" onChange={onChange}/>
        </div>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Year</div>
            <div className="td">Month</div>
            <div className="td">Fiscal Year</div>
            <div className="td"># Of Incidents</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {id, data: {created_at, year, month, fiscal_year, incident_list = []}} = item;
        console.log(n, id, item)
        return <TRow key={id}>
            <div className="td fixed-flex min-w-120">{Dates.formatDate(created_at)}</div>
            <div className="td">{year}</div>
            <div className="td">{month}</div>
            <div className="td">{Dates.formatDate(fiscal_year)}</div>
            <div className="td">{(incident_list && incident_list.length) || 0}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
//        const {permissions_other} = storage.loggedUser.user.data;
//        const permissions_other_ContractorForms = (permissions_other || []).find(v => v.key === "Contractor Forms");
        return <APageListReadWrite 
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Man Hours"
            pageTitleSingular="man hour"
            path={this.path}
            noAnimation={true}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>            
            <ConfirmDialog ref="removeDialog"/>
            
            <NewDialog ref="newDialog"/>
            <EditDialog ref="editDialog"/>
            <ProfileDialog ref="profileDialog"/>
            
            {/*<ProfilePDFReader ref="pdfReader"/>
            <ExportIncidentsDialog ref="exportIncidentsDialog"/>*/}
        </APageListReadWrite>;
    }
    // </editor-fold>
}

export default ManHoursTab;
