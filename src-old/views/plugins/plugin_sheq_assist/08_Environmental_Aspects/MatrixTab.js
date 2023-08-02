import React from "react";
import {observer} from 'mobx-react';

import style from "./MatrixTab.lazy.css";
import NavItem from '../../../../components/navs/NavItem';
import {ActionsButton, ClearableInput} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';
//import ProfileBaselineRiskAssessmentDialog from './dialogs/ProfileBaselineRiskAssessmentDialog';
//import EditBaselineRiskAssessmentDialog from './dialogs/EditBaselineRiskAssessmentDialog';

@observer
class MatrixTab extends React.Component {
	path;
	pageKey = "MatrixTab";
	
    constructor(props) {
        super(props);
		
		this.path = props.path + 'matrix/';
		
		this.renderItem = this.renderItem.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
    }
	
	componentWillMount() {
		style.use();
	}
	
    componentWillUnmount(){
		style.unuse();
	}
	
	renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        return <Options idx={idx} permissionModKey={this.props.permissionKey}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>
            <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>
        </Options>;
	}
	
	renderFilterNode(onChange) {
		return <div className="col-lg-12 controls">
			<ClearableInput name="hr" type="text" placeholder="HR..." className="form-control" onChange={onChange}/>
			<ClearableInput name="job_title" type="text" placeholder="Job Title..." className="form-control" onChange={onChange}/>
		</div>;
	}
	
	renderTHead() {
		return  <THead>
			<div className="td fixed-flex">ID</div>
			<div className="td fixed-flex td-hr">HR</div>
			<div className="td fixed-flex td-job_title">Job Title</div>
			<div className="td">Job Description</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}
	
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		return <TRow key={"item-" + n}>
			<div className="td fixed-flex">{item.id}</div>
			<div className="td fixed-flex td-hr">{item.hr}</div>
			<div className="td fixed-flex td-job_title">{item.job_title}</div>
			<div className="td">{item.job_desc}</div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
		</TRow>;
    }
	
	render() {
		return <div>later</div>;/*<APageListReadWrite 
			hasBackBtn={false}
			ref="root"
			page={this}
			createBtnTitle="Create"
			pageId={this.pageKey + "-tab"}
			pageTitle="Matrix"
			pageTitleSingular="matrix"
			path={this.path}
			noAnimation={true}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}>
				<ConfirmDialog ref="removeDialog"/>
				<NewMatrixDialog ref="newDialog"/>
		</APageListReadWrite>;*/
	}
}

export default MatrixTab;
