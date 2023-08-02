// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../utils/Form';
import {
    ActionsButton,
    Button,
    ClearableInput,
    SelectClientInput,
    SelectContractorQuestionnaireTemplateCategoryInput,
    SelectProjectInput
} from '../inputs';
import {SelectTable, THead} from '../tables';
import ANewDialog from '../dialogs/ANewDialog';

import {
    TemplatesTabTableRow
} from '../../views/plugins/plugin_extra/__B_Contractors/dialogs/QuestionnaireAnswersComponents';
// </editor-fold>
import style from "./SelectTemplateDocDialog.lazy.css";

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class SelectTemplateDocDialog extends ANewDialog {
    pageKey = "SelectTemplateDocDialog";
//    className = 'ANewTableFormDialog';

    constructor(props) {
        super(props, style);
    }

    get title() {
        return "Select Template";
    }
    
    get topButtons() {
        return <React.Fragment>
            <Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
            <Button className="btn btn-primary save" onClick={this.onSubmit}>
                <i className="fa fa-check icon-left"/>Done
            </Button>
        </React.Fragment>;
    }

    get controls() {
        return Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = 'plugin_sheq_assist/contractors/questionnaires/templates/';

    @observable
    state = {
        list: []
    };
    filterData;

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();
                
        this.onSearch = this.onSearch.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onRenderActionCell = this.onRenderActionCell.bind(this);
        this.renderItemFrom = this.renderItemFrom.bind(this);
        
        this.form = new Form();
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSearch">
    onSearch(){
        const {form} = this;
        if (!form.isValid('client_from')) {
            infoDialog.open('Company is required');
            return;
        }
        const {
            client_from, project_from,
            name, doc_num, category
        } = form.data;
        this.filterData = {client_id: client_from.id};
        if(project_from) {
            this.filterData.project_id = project_from.id;
        }
        if(name) {
            this.filterData.name = name;
        }
        if(doc_num) {
            this.filterData.doc_num = doc_num;
        }
        if(category) {
            this.filterData.category = category;
        }
        
        neonBinding.events.emit(this.path + 'list/filter', this.filterData).then(list => {
            this.state.list.clear(); 
            this.state.list.push(...list);
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {selectedTable: {selectedList}} = this.refs;
        if(selectedList.isEmpty()) {
            infoDialog.open('Please select a Template');
        } else {
            onSaved && onSaved(selectedList[0]);
            this.props.close();
        }
    }
    // </editor-fold>
    
    onClick(evt, btn) {
        const {item} = btn.props;
        const {selectedTable, selectedTable: {selectedList}} = this.refs;
        if(selectedList.map(v => v.id).contains(item.id)) {
            selectedList.clear();
        } else {
            selectedTable.selectedList = item;
        }
    }
    
    onRenderActionCell(item, idx) {
        const icon = this.refs.selectedTable.selectedList.map(v => v.id).contains(item.id) ? 'check' : 'square';
        return <div className="td fixed-flex padding-l-0 padding-r-0 min-w-40">
            <ActionsButton item={item} className="btn btn-primary pull-right min-w-40" icon={icon} onClick={this.onClick}/>
        </div>;
    }
    
    renderTHeadFrom() {
        return <THead>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td fixed-flex min-w-120">Document No.</div>
            <div className="td">Document Title</div>
            <div className="td">Category</div>
            <div className="td fixed-flex min-w-120">Review Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-50"></div>
        </THead>;
    }

    renderItemFrom(item, n, onClick, renderActionsCol){
        return <TemplatesTabTableRow item={item} idx={n} noDescription onRenderActionCell={this.onRenderActionCell}/>;
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        return (<div className="controls-wrapper h-full">
            <div className="controls h-full">
                <div className="row col-lg-3 h-full padding-0">
                    <label className="heading text-center"><h4>Find Template(s) To Select:</h4></label>
                    <div className="row sec-group margin-t-10 padding-l-10 padding-r-10">    
                        <SelectClientInput name="client_from" group="orgs1" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectProjectInput name="project_from" group="orgs1" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="name" type="text" placeholder="Document Title" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <ClearableInput name="doc_num" type="text" placeholder="Document No." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                        <SelectContractorQuestionnaireTemplateCategoryInput name="category" placeholder="Category..." className="col-lg-12 margin-b-15 form-control" onChange={this.form.onChange}/>
                        <Button className="btn btn-primary hor-center" onClick={this.onSearch}>
                            Find Template(s)
                        </Button>
                    </div>
                </div>
                <div className="row col-lg-9 h-full pull-right padding-0">
                    <label className="heading text-center"><h4>Template(s):</h4></label>
                    <SelectTable ref="selectedTable" 
                        name="template" 
                        desc="Templates" 
                        title="Template(s)" 
                        className={"col-lg-12 no-padding SelectedTemplateTable Table-Select"}
                        renderTHead={this.renderTHeadFrom} 
                        renderItem={this.renderItemFrom} 
                        list={this.state.list}
                        isSingleSelect
                        replaceOnlyActions
                        isChecked={(item, selectedList) => selectedList.map(v => v.id).contains(item.id)}/>
                </div>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default SelectTemplateDocDialog;
