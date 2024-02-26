import React from "react";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import {Clickable, ProfileField} from 'components/inputs';
import {NavButtons} from 'components/FormComponents';
import {NewEmployeeListTable} from 'components/FormTableComponents';

import AuditItemTable from './AuditItemTable';

import style from "./ProfileAuditDialog.lazy.css";
import updateAudit from "mutations/all/AuditsAndInspections/Audit/updateAudit";
import findByIdAudit from "mutations/all/AuditsAndInspections/Audit/findByIdAudit";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileAuditDialog";
    className = 'ANewTableFormDialog';
    findById = findByIdAudit;
    removeById = updateAudit;
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Audit Profile";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    
    @observable
    state = {
        lists: {}
    };
    
    constructor(props) {
        super(props);
        
        this.onFormChange = this.onFormChange.bind(this);        
    }

    onFormChange(idx) {
        const {list} = this.refs;
        if(idx - 1 === 5 && list) {
            this.refs.list.refresh();
        }
    }
    
    @computed get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item){
            return <CircularProgress className="fixed-center"/>;
        }
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at, 
                    client, project, site,
                    scope, date, type, 
                    representative_list,
                    auditor_list,
                    definition_list, list
                }
            }
        } = this;
        
        const {isConsultant} = storage.is;
//        list.sort((a, b) => a.element.localeCompare(b.element));
//        console.log('ProfileAuditDialog', representative_list, auditor_list, definition_list, list)
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<>
                    <h5>{'Conducted On ' + Dates.formatDate(date)}</h5>
                </>)}
                <div className="row active">
                    <label>
                        1. General Details
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">   
                        <div className="flex"> 
                            <div className="margin-r-20">
                                {isConsultant && <ProfileField name="client" placeholder="Company" value={client} renderer={v => v.name || v.data.name} className="col-lg-12"/>}
                                <ProfileField name="scope" placeholder="Scope Of Audit" value={scope} className="col-lg-12"/>
                            </div>
                            <div className="margin-l-20">
                                <ProfileField name="date" type="date" placeholder="Audit Date" value={date} className="col-lg-12"/>
                                <ProfileField name="type" placeholder="Audit Type" value={type} className="col-lg-12"/>
                            </div>
                        </div>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row row-representatives">
                    <label>
                        2. Company Representative(s)
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <NewEmployeeListTable name="representative_list" defaultValue={representative_list || []} readonly/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-auditors">
                    <label>
                        3. Auditor(s)
                        <Clickable idx={3} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <NewEmployeeListTable name="auditor_list" defaultValue={auditor_list || []} readonly/>
                    </div>
                    <NavButtons idx={3} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-definitions">
                    <label>
                        4. Definitions
                        <Clickable idx={4} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <DefinitionsTable name="definition_list" defaultValue={definition_list || []} readonly/>
                    </div>
                    <NavButtons idx={4} onBack={onFormBack} onNext={onFormNext}/>
                </div>
                <div className="row row-table">
                    <label>
                        5. Findings
                        <Clickable idx={5} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group row-findings">
                        <AuditItemTable ref="list" name="list" defaultValue={list} readonly/>
                    </div>
                    <NavButtons idx={5} onBack={onFormBack}/>
                </div>
            </div>
        </div>;
    }

}

@observer
class DefinitionsTable extends ATableSavable {

    @observable
    selfState = {
    };

    constructor(props) {
        super(props);
    }

    renderItem(n, onClick) {
        const item = this.state.list[n];
        const {title, desc} = item;
        return <TRow key={"item-" + n} className="tr-readonly">
            <div className="td fixed-flex min-w-300">{title}</div>
            <div className="td">{desc}</div>
            <div className="td fixed-flex padding-0"/>
        </TRow>;
    }

    render() {
        return (<Table className="DefinitionsTable">
            <THead className="align-left">
                <div className="td fixed-flex min-w-300">Title</div>
                <div className="td">Description</div>
                <div className="td fixed-flex padding-0"/>
            </THead>
            <TBody ref="body" title="Definitions" renderItem={this.renderItem} onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
        </Table>);
    }
}

export default ProfileDialog;
