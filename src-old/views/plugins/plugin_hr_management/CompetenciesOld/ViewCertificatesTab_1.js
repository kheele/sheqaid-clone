import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Button} from '../../../../components/inputs';
import {Table, TBody, THead} from '../../../../components/tables';
import NewCompetencyCertificateDialog from './firestore_forms/NewCompetencyCertificateDialog';
import NewMedicalFitnessCertificateDialog from '../Medicals/NewMedicalFitnessCertificateDialog';

import AListTab from './AListTab';

@observer
class CertificatesTab extends AListTab {
    pageKey = "CertificatesTab";

    @observable
    state = {
        listOHSMedical: [],
        listCompetencies: []
    };
    
    constructor(props) {
        super(props);
        const {item: {data: {ohs_medical_certifictes, competency_certifictes}}} = this.props;
        this.state.listOHSMedical = ohs_medical_certifictes || [];
        this.state.listCompetencies = competency_certifictes || [];
        
        this.onAddMedicalFitnessCertificate = this.onAddMedicalFitnessCertificate.bind(this);
        this.onAddCompetencyCertificate = this.onAddCompetencyCertificate.bind(this);
        
        this.onLoadListOHSMedical = this.onLoadListOHSMedical.bind(this);
        this.onLoadListCompetencies = this.onLoadListCompetencies.bind(this);
        
        this.renderOHSMedicalItem = this.renderOHSMedicalItem.bind(this);
        this.renderCompetenciesItem = this.renderCompetenciesItem.bind(this);
    }
    
    onAddMedicalFitnessCertificate() {
        this.refs.newMedicalFitnessCertificateDialog.extraProp("employee", this.props.item).open();
    }
    
    onAddCompetencyCertificate() {
        this.refs.newCompetencyCertificateDialog.extraProp("employee", this.props.item).open();
    }

    onLoadListOHSMedical() {
        return Promise.resolve(this.state.listOHSMedical);
    }

    onLoadListCompetencies() {
        return Promise.resolve(this.state.listCompetencies);
    }

    renderOHSMedicalItem(n, onClick) {
        const item = this.refs.root.list[n];
        return this.renderItem(n, item, onClick, <React.Fragment>
            <div className="td">{item.medical_valid}</div>
            <div className="td fixed-flex min-w-150">{item.medical_expiry}</div>
        </React.Fragment>);
    }

    renderCompetenciesItem(n, onClick) {
        const item = this.refs.root.list[n];
        return this.renderItem(n, item, onClick, <React.Fragment>
            <div className="td">{item.competency}</div>
            <div className="td fixed-flex min-w-150">{item.expiry_date}</div>
        </React.Fragment>);
    }

    render() {
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                <div className="row">
                    <label>OHS Medical <Button className="btn btn-primary pull-right" onClick={this.onAddMedicalFitnessCertificate}>Add Medical Fitness Certificate</Button></label>
                    <Table>
                        <THead>
                        <div className="td">Medical Valid</div>
                        <div className="td">Medical Expiry</div>
                        <div className="td fixed-flex"></div>
                        </THead>
                        <TBody ref="body" title="OHS medicals" renderItem={this.renderOHSMedicalItem} onClick={this.onClick} listName="listOHSMedical" state={this.state} onLoadList={this.onLoadListOHSMedical} disablePullToRefresh={true}/>
                    </Table>
                </div>
                <div className="row">
                    <label>Competencies <Button className="btn btn-primary pull-right" onClick={this.onAddCompetencyCertificate}>Add Competency Certificate</Button></label>
                    <Table>
                        <THead>
                        <div className="td">Competency</div>
                        <div className="td">Expiry Date</div>
                        <div className="td fixed-flex"></div>
                        </THead>
                        <TBody ref="body" title="Competencies" renderItem={this.renderCompetenciesItem} onClick={this.onClick} listName="listCompetencies" state={this.state} onLoadList={this.onLoadListCompetencies} disablePullToRefresh={true}/>
                    </Table>
                </div>
            </div>
            <NewCompetencyCertificateDialog ref="newCompetencyCertificateDialog"/>
            <NewMedicalFitnessCertificateDialog ref="newMedicalFitnessCertificateDialog"/>
        </div>;
    }
}

export default CertificatesTab;