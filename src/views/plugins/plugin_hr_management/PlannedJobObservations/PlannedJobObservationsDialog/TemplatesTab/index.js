import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import {ActionsButton, ClearableInput, Clickable} from 'components/inputs';
import {THead, TRow} from 'components/tables';

import {NewTemplateDialog, EditTemplateDialog, ProfileTemplateDialog,} from './forms';
import {EditResponseDialog, NewQuestionnaireDialog} from '../ObservationsTab/forms';

import style from "./TemplatesTab.lazy.css";
import byLogged from "./Query/List/listAllJobObservationTemplatesByLogged";
import TemplateTableRow from "./TemplateTableRow";
import updateJobObservationsQuestionnaireTemplate
    from "mutations/all/Questionnaires/JobObservationsQuestionnaireTemplate/updateJobObservationsQuestionnaireTemplate";

@observer
class TemplatesTab extends React.Component {
    pageKey = "TemplatesTab";
    
    @observable
    state = {
        lists: {
            scheduled: [{text: "Yes", value: "Yes"}, {text: "No", value: "No"}],
        }
    }

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);
        
        this.onRemoved = this.onRemoved.bind(this);

        this.onCopy = this.onCopy.bind(this);
        this.onCreateQuestionnaire = this.onCreateQuestionnaire.bind(this);
        // this.onSchedule = this.onSchedule.bind(this);
        // this.onStart = this.onStart.bind(this);
        
        this.renderItem = this.renderItem.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
    }
    //</editor-fold>

    //<editor-fold desc="componentWillMount, componentWillUnmount">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    //</editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;
        const {
            name,
        } = filterData || {};

        const limit = 50;

        const args = {
            name,
            //
            limit,
            //
            exact_orgs: true,
        };

        if(!isNew) {
            args.offset = this.refs.root.list.length;
        } else {
            args.offset = 0;
        }

        return byLogged(args).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>
    
    onRemoved(item) {
        this.refs.root.list.removeIf((v, n) => v.id === item.id);
    }
    
    //<editor-fold desc="actions">
    onCopy(evt, elem) {
        const {idx, action} = elem.props;
        const {list, onNew} = this.refs.root;
        const copy = toJS(list[idx]);
        onNew(evt, elem, copy);
    }

    onCreateQuestionnaire(evt, elem) {
        const {idx, action} = elem.props;
        const item = this.refs.root.list[idx];
        this.refs.newQuestionnaireDialog.extraProp('template', item).open(item);
    }

    // onSchedule(evt, elem) {
    //     const {idx, action} = elem.props;
    //     const item = this.refs.root.list[idx];
    //     this.refs.newScheduleDialog.open(item);
    // }
    //
    // onStart(evt, elem) {
    //     const {idx, action} = elem.props;
    //     const item = this.refs.root.list[idx];
    //     this.refs.editResponseDialog.open(item);
    // }
    //</editor-fold>

    //<editor-fold desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const item = this.refs.root.list[idx];
        const {
            id,
            data: {
                created_at,
                name,
                desc,
                status,
                status_answered_by_sender,
                answered_by = 'Sender',
                is_template,
                visibility,
                page_title_list,
                question_list,
            }
        } = item;

        const isPrivate = visibility === "Private";

        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {isPrivate && <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>}
            {isPrivate && <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onCopy} faIconLeft="copy" title="Copy"/>
            <hr action="writable"/>
            <NavItem action="writable" idx={idx} onClick={this.onCreateQuestionnaire} faIconLeft="plus" title={"Create Job Observation"}/>
            {/*<NavItem action="writable" idx={idx} onClick={this.onSchedule} faIconLeft="plus" title={"Schedule Job Observation"}/>*/}
            {/*<NavItem action="writable" idx={idx} onClick={this.onStart} faIconLeft="plus" title={"Start Job Observation"}/>*/}
        </Options>;
    }
    //</editor-fold>

    //<editor-fold desc="renderFilterNode">
    renderFilterNode(onChange) {
        return <div className="col-lg-12 controls flex">
            <ClearableInput name="name" type="text" placeholder="Name" className="form-control" onChange={onChange}/>
            <ClearableInput name="scheduled" type="radio" placeholder="Scheduled" className="form-control" onChange={onChange} values={this.state.lists.scheduled}/>
        </div>;
    }
    //</editor-fold>

    //<editor-fold desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-40">ID</div>
            <div className="td fixed-flex min-w-120">Date Created</div>
            <div className="td">Job Position</div>
            <div className="td">Name</div>
            <div className="td">Description</div>
            <div className="td fixed-flex min-w-180">Questionnaires Used</div>
            <div className="td fixed-flex min-w-100">Questions</div>
            <div className="td fixed-flex min-w-80">Visibility</div>
            <div className="td fixed-flex min-w-80">Scheduled</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }
    //</editor-fold>

    //<editor-fold desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        return <TemplateTableRow key={item.id} idx={n} item={item} onClick={onClick}/>;
    }
    //</editor-fold>

    //<editor-fold desc="render">
    render() {
//        const {permissions_other} = storage.loggedUser.user.data;
//        const permissions_other_ContractorForms = (permissions_other || []).find(v => v.key === "Contractor Forms");
        return <APageListReadWrite
            hasBackBtn={false}
            ref="root"
            page={this}
            createBtnTitle="Create"
            pageId={this.pageKey + "-tab"}
            pageTitle="Templates"
            pageTitleSingular="template"
            onLoadList={this.onLoadList}
            noAnimation={true}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>
            <ConfirmDialog ref="removeDialog" onSoftDelete={updateJobObservationsQuestionnaireTemplate}/>
            
            <NewTemplateDialog ref="newDialog"/>
            <EditTemplateDialog ref="editDialog" onRemoved={this.onRemoved}/>
            <ProfileTemplateDialog ref="profileDialog" onRemoved={this.onRemoved}/>
            
            <NewQuestionnaireDialog ref="newQuestionnaireDialog"/>
            {/*<EditResponseDialog ref="editResponseDialog"/>*/}
        </APageListReadWrite>;
    }
    //</editor-fold>
}

export default TemplatesTab;
