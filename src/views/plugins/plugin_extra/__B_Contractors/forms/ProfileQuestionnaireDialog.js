// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable, toJS} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import {execWhen} from 'utils/Utils';

import {createDoughnutChart} from 'utils/ChartUtils';
import {Button, ProfileField} from 'components/inputs';
import NavItem from 'components/navs/NavItem';
import {Chart, FormControls, Row} from 'components/FormComponents';
import {AProfileDialog} from 'components/dialogs';

import {TemplateQuestions} from 'components/templates';

import NewQuestionnaireDialog from './NewQuestionnaireDialog.js';
import EditQuestionnaireDialog from './EditQuestionnaireDialog.js';
import ProfileResponseDialog from './ProfileResponseDialog.js';

import ProfileQuestionnairePDFReader from '../printers/ProfileQuestionnairePDFReader';
import ProfileResponsePDFReader from '../printers/ProfileResponsePDFReader';

import style from "./ProfileQuestionnaireDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileQuestionnaireDialog";

    constructor(props) {
        super(props, style);
        
        this.onCopy = this.onCopy.bind(this);
        this.onViewResponses = this.onViewResponses.bind(this);
        this.onEdit = this.onEdit.bind(this);
        
        this.onExportOptions = this.onExportOptions.bind(this);
    }
    
    onCopy(evt, el) {
        this.refs.controls.onCopy(evt, el);
    }
    
    onViewResponses(evt, el) {
        this.refs.controls.onViewResponses(evt, el);
    }
    
    onEdit(evt, el) {
        this.refs.controls.onEdit(evt, el);
    }

    onExportOptions(e, btn) {
        this.refs.controls.onExportOptions(e, btn);
    }
    
    title() {
        return "Contractor's Questionnaire";
    }
    
    @computed get topButtons() {
        const {item} = this.state;
        if(!item) return null;
        const {data: {
                status = "New", status_answered_by_sender, answered_by = 'Recipient',
            }
        } = item;
        
        const {isContractor} = storage.is;
        
        const isWritable = status !== "CompleteAccepted";
        
        return <React.Fragment>
            {!isContractor && isWritable && <Button className="btn btn-primary" onClick={this.onDelete}>
                <i className="fa fa-ban icon-left"/>Delete
            </Button>}
            {!isContractor && isWritable && <Button className="btn btn-primary" onClick={this.onEdit}>
                <i className="fa fa-pen icon-left"/>Edit
            </Button>}
            <Button className="btn btn-primary" onClick={this.onExportOptions}>
                Export <i className="fa fa-angle-down icon-right font-size-16"/>
            </Button>
            {!isContractor && <Button className="btn btn-primary" onClick={this.onCopy}>
                <i className="fa fa-copy icon-left"/>Copy
            </Button>}
            <Button className="btn btn-primary" onClick={this.onViewResponses}>
                <i className="fa fa-eye icon-left"/>Responses
            </Button>
        </React.Fragment>;
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/contractors/questionnaires/";
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onExportOptions = this.onExportOptions.bind(this);
        this.onExport = this.onExport.bind(this);
        this.onSaveAs = this.onSaveAs.bind(this);
        
        this.getDialogDOM = this.getDialogDOM.bind(this);
    }
    // </editor-fold>
    
    onViewResponses(evt, el) {
        this.refs.responseDialog.open(this.item);
    }
    
    onCopy(evt, elem) {
        const copy = toJS(this.item);
        this.refs.newDialog.open(this.item);
    }
    
    onEdit(evt, el) {
        this.refs.editDialog.open(this.item);
    }
    
    // <editor-fold defaultstate="collapsed" desc="onExportOptions, onExport, onSaveAs">
    onExportOptions(e, btn) {
//        this.refs.pdfReader.open(this.item);
        const jqElem = $(btn.getDOMNode());
        const {left, top} = jqElem.offset();
        const style = {
            left, 
            top: top + jqElem.height() + 25, 
            width: "auto", 
            minWidth: 200
        };
        popover.settings({
            style,
            isDialog: true,
            contentNode: <div>
                <NavItem type="Questionnaire" onClick={this.onExport} faIconLeft="file-pdf-o" title="Export Questionnaire"/>
                <NavItem type="Response" onClick={this.onExport} faIconLeft="file-pdf-o" title="Export Responses"/>
            </div>
        }).open();
    }
    
    onExport(e, el) {
        const {idx, type, title} = el.props;
        setTimeout(() => {
            popover.settings({
                style: {width: 'auto', minWidth: 200},
                isDialog: true,
                contentNode: <div>
                    <p className="padding-t-10 text-center">{title}</p>
                    <hr className="margin-t-0 margin-b-0"/>
                    <NavItem idx={idx} type='PDF' refName={`profile${type}PDFReader`} onClick={this.onSaveAs} title='Save As PDF'/>
                    <NavItem idx={idx} type='Excel' onClick={this.onSaveAs} title='Save As Spreadsheet'/>
                </div>
            }).open();
        }, 1000);
    }
    
    async onSaveAs(e, el) {
        const {idx, type, refName} = el.props;
        const {[refName] : dialog} = this.refs;
        if(type === 'PDF') {
            dialog.open(this.item);
        } else if(type === 'Excel') {
            
        }
    }
    // </editor-fold>

    getDialogDOM() {
        const {props: {dialog}} = this;
        return dialog.getDOMNode();
    }

    get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            },
            item: {
                id, data: {
                    created_at,
                    name,
                    desc,
                    status = "New",
                    status_answered_by_sender,
                    answered_by = 'Recipient',
                    is_template,
                    visibility,
                    page_title_list,
                    question_list,
                    //
                    contractor: {name: contractorName, username},
                }
            }
        } = this;
        
        return <FormControls lazyLoad>
            <Row 
                rendered  
                activeAlways
                idx={1}
                title="1. Contractor Details" 
                onFormOpen={onFormOpen} 
            >
                <ProfileField name="contractor" value={contractorName} placeholder="Contractor" className="col-lg-6"/>
                <ProfileField name="email" value={username} placeholder="Email Address" className="col-lg-6"/>
            </Row>
            <Row 
                rendered 
                active
                idx={2}
                title="2. Who Should Answer Questionnaire" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                <ProfileField name="answered_by" value={answered_by} placeholder="Needs Answers From" className="col-lg-12"/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Contractor Questionnaire" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <TemplateQuestions 
                    ref="questions" 
                    readonly
                    getDialogDOM={this.getDialogDOM} 
                    defaultType="Questions"
                    mainTitle="Contractor Questionnaire"
                    item={this.item}
                />
            </Row>
            <NewQuestionnaireDialog ref="newDialog"/>
            <EditQuestionnaireDialog ref="editDialog"/>
            <ProfileResponseDialog ref="responseDialog"/>
            
            <ProfileQuestionnairePDFReader ref="profileQuestionnairePDFReader"/>
            <ProfileResponsePDFReader ref="profileResponsePDFReader"/>
        </FormControls>;
    }
    // </editor-fold>

}

function questionHasChat(ques) {
    return !(!ques.message_list || (ques.message_list && !isArray(ques.message_list) && !isObservableArray(ques.message_list)));
}

// <editor-fold defaultstate="collapsed" desc="Stats">
@observer
class Stats extends React.Component {

    @observable
    state = {
        charts: null,
        dataLoaded: false
    };
    
    componentDidMount() {
        this.load();
    }
    
    componentWillUpdate() {
//        this.load();
    }

    async load() {
        const {title, data_points} = this.props;
        let charts = createDoughnutChart(title, "Y", "###0", data_points, {
            legend: {itemWidth: 100},
            exportEnabled: false,
            responsive: true
        });
        this.state.charts = charts;
        this.state.dataLoaded = true;
        execWhen(() => this.refs.chart).then(chart_ref => {
            chart_ref.update();
        });

    }
    
    render() {
        const {state: {charts, dataLoaded}, props: {title}} = this;
        return <div className="Statistics padding-10 margin-r-10 margin-t-5">
            <label className="text-center w-full margin-b-10">{title}</label>
            {!dataLoaded && <div className="fixed-center"><CircularProgress/><br />Loading...</div>}
            {dataLoaded && <div className="content">
                <Chart ref="chart" options={charts}/>
                <div className="chart-hider"/>
            </div>}
        </div>;
    }
}
// </editor-fold>

export default ProfileDialog;
