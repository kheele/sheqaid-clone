// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from '../../../../../utils/Form';
import {ANewDialog} from '../../../../../components/dialogs';
import {
    Button,
    ClearableInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput
} from '../../../../../components/inputs';
import {Table, TBody, THead, TRow} from '../../../../../components/tables';
import {Row} from '../../../../../components/FormComponents';

import style from "./PPEMatrixDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "PPEMatrixDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "PPE Matrix";
    }
    
    get topButtons() {
        return null;
    }
    
    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            type: ['Teams', 'Departments', 'Job Positions'].map(text => {
                return {text, value: text, checked: false};
            })
        },
        type: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.form = new Form();
        this.form.addChangeOne("client", this.onChangeCompany.bind(this));
        this.form.addChangeOne("project", this.onChangeProject.bind(this));
        this.form.addChangeOne("site", this.onChangeSite.bind(this));
        this.form.addChangeOne("type", this.onChangeType.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onLoad() {
        const {state: {type}, refs: {viewByNotSelected, viewByTeams, viewByDepartments, viewByJobPositions}} = this;
        
        viewByNotSelected.load();
        
        if(type === 'Teams') {
            viewByTeams.load();
        } else if(type === 'Departments') {
            viewByDepartments.load();
        } else if(type === 'Job Positions') {
            viewByJobPositions.load();
        }
    }
    
    onChangeCompany(el, val) {
        this.onLoad();
    }
    
    onChangeProject(el, val) {
        this.onLoad();
    }
    
    onChangeSite(el, val) {
        this.onLoad();
    }
    
    onChangeType(el, val) {
        this.state.type = val;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            },
            state,
            form
        } = this;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                <Row 
                    activeAlways
                    rendered 
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                >
                    <SelectClientInput name="client" placeholder="Company..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-4 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    activeAlways
                    rendered 
                    idx={1}
                    title="PPE Matrix" 
                    onFormOpen={onFormOpen}
                >
                    <ClearableInput name="type" type="radio" placeholder="View By" className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange} values={this.state.lists.type} returnValue/>
                    
                    <hr className="pull-left margin-t-5 margin-b-15"/>
                    
                    <AViewByNotSelected ref='viewByNotSelected' state={state} form={form}/>
                    <ViewByTeams ref='viewByTeams' state={state} form={form}/>
                    <ViewByDepartments ref='viewByDepartments' state={state} form={form}/>
                    <ViewByJobPositions ref='viewByJobPositions' state={state} form={form}/>
                </Row>
            </div>
        </div>;
    }
    // </editor-fold>

}

@observer
class AViewByNotSelected extends React.Component {
    @observable state = {
        client: null
    };
    
    load() {
        const {form} = this.props;
        this.state.client = form.get('client');
    }
    
    render() {
        const {state, form} = this.props;
        if(state.type !== null) return null;
        if(!this.state.client) {
            return <div className="AViewBy -margin-l-10">
                <h4 className='w-full pull-left margin-0 border-radius-20 padding-10 text-center font-size-15'>
                    Please select <b>Company</b>, <b>Project</b> or <b>Site</b>
                </h4>
            </div>;
        }
        
        return <div className="AViewBy -margin-l-10">
            <h4 className='w-full pull-left margin-0 border-radius-20 padding-10 text-center font-size-15'>
                Please select <b>Teams</b>, <b>Departments</b> or <b>Job Positions</b> on options above
            </h4>
        </div>;
    }
}

@observer
class AViewBy extends React.Component {
    @observable state = {
        list: []
    };
    
    constructor(props) {
        super(props);
        
        this.renderItem = this.renderItem.bind(this);
    }
    
    load() {
        const {form, form: {client, project, site}} = this.props;
        alert(client)
        if(!form.isValid('client')) {
//            infoDialog.open('Company is required');
            return;
        }
        
        const data = {
            client_id: client.id
        };
        if(project) {
            data.project_id = project.id;
        }
        if(site) {
            data.site_id = site.id;
        }
        
        progressDialog.open();
        neonBinding.events.emit(this.path + "list/ppe-matrix", data).then(res => {
            this.state.list = res;
            
        }).finally(() => {
            setTimeout(() => progressDialog.close());
        });
    }
    
    render() {
        const {isRendered, state, renderItem, title} = this;
        if(!isRendered) return null;
        
        return <div className="AViewBy -margin-l-10">
            <Table className="w-full pull-left min-h-160">
                <AViewByHeader ref="header" state={state}/>
                <AViewByBody state={state} renderItem={renderItem} title={title}/>
            </Table>
        </div>;
    }
}

@observer
class AViewByHeader extends React.Component {
    
    @computed get ppe_list() {
        return this.props.state.list.map(v => v.data.ppe_list).reduce((a1, a2) => [...a1, ...a2], []);
    }
    
    @computed get colTitles() {
        const list = this.ppe_list.map(v => v.data.name).distinct();
        list.sort();
        return list;
    }
    
    renderItem(val) {
        return <div className="td">{val}</div>;
    }
    
    render() {
        const {colTitles} = this;        
        return <THead className="w-full pull-left align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td fixed-flex min-w-160"></div>
            {colTitles.map(this.renderItem)}
        </THead>;
    }
}

@observer
class AViewByBody extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.onLoadList = this.onLoadList.bind(this);
    }

    onLoadList() {
        return Promise.resolve(this.props.state.list);
    }
    
    render() {
        const {state, title, renderItem} = this.props;
        return <TBody 
            ref="body" 
            title={title} 
            renderItem={renderItem} 
            state={state} 
            onLoadList={this.onLoadList}
            disablePullToRefresh={true}
        />;
    }
}

@observer
class RenderItemCols extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.renderItemCols = this.renderItemCols.bind(this);
    }
    
    @computed presentList() {
        const {item: {data: {ppe_list}}} = this.props;
        return ppe_list.map(v => v.data.name);
    }
    
    renderItemCols(title) {
        const {presentList, props: {header, item: {data: {ppe_list}}}} = this;
        const icon = presentList.contains(title) ? 'check' : 'square';
        return <div className="td">
            <Button readonly={true} className='btn btn-primary pull-right margin-t-5 w-40'>
                <i className={`fa fa-${icon}`}/>
            </Button>
        </div>
    }
    
    render() {
        const {header} = this.props;
        return <React.Fragment>
            {header.colTitles.map(this.renderItemCols)}
        </React.Fragment>;
    }
}

// <editor-fold defaultstate="collapsed" desc="ViewByTeams">
@observer
class ViewByTeams extends AViewBy {
    path = "plugin_sheq_assist/employees/teams/";
    title = "View By Teams";
    
    renderItem(item, n) {
        const {header} = this.refs;        
        const {id, data: {created_at, supervisor: {lname, fname, data}, name, list, ppe_list}} = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-30">{n + 1}</div>
            <div className="td fixed-flex min-w-160">{name}</div>
            <RenderItemCols header={header} item={item}/>
        </TRow>;
    }
    
    @computed get isRendered() {
        const {state} = this.props;
        return state.type === 'Teams';
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByDepartments">
@observer
class ViewByDepartments extends AViewBy {
    path = "plugin_sheq_assist/employees/departments/";
    title = "View By Departments";
    
    renderItem(item) {
        const {header} = this.refs;
        const {id, data: {created_at, name, ppe_list}} = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-30">{n + 1}</div>
            <div className="td fixed-flex min-w-160">{name}</div>
            <RenderItemCols header={header} item={item}/>
        </TRow>;
    }
    
    @computed get isRendered() {
        const {state} = this.props;
        return state.type === 'Departments';
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByJobPositions">
@observer
class ViewByJobPositions extends AViewBy {
    path = "plugin_sheq_assist/employees/job-positions/";
    title = "View By Job Positions";
    
    renderItem(item) {
        const {header} = this.refs;
        const {id, data: {created_at, job_category, name, desc, doc, client, ppe_list}} = item;
        return <TRow key={id}>
            <div className="td fixed-flex min-w-30">{n + 1}</div>
            <div className="td fixed-flex min-w-160">{name}</div>
            <RenderItemCols header={header} item={item}/>
        </TRow>;
    }
    
    @computed get isRendered() {
        const {state} = this.props;
        return state.type === 'Job Positions';
    }
}
// </editor-fold>

export default NewDialog;
