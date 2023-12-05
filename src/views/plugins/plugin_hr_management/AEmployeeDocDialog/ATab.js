// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import APageListReadWrite from "views/APageListReadWrite";
import Popover from 'components/popovers/Popover';
import {ConfirmDialog} from 'components/dialogs';
import {
	Button,
} from 'components/inputs';

import {renderLeftButtonsForExpiryOnly} from "utils/ComponentUtils";

import {computed, observable} from "mobx";
import {execWhen} from "utils/UtilsFuns";
import MKBox from "components/MK/MKBox";
import ViewByButtons from "components/ViewByButtons";
import SignatureDialog from "components/dialogs/SignatureDialog";
import {Dates} from "utils/Dates";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ATab">
@observer
class ATab extends React.Component {

	@observable
	state = {
		view: 'Employee',
		expiry_date: 'ALL',
	};

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.onLoadList = this.onLoadList.bind(this);

		this.setView = this.setView.bind(this);

		this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
		this.onSaveAsExcel = this.onSaveAsExcel.bind(this);

		this.onView && (this.onView = this.onView.bind(this));

		this.renderDefaultLeftButtons = this.renderDefaultLeftButtons.bind(this);
		this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
		this.renderFilterNode = this.renderFilterNode.bind(this);
		this.renderTHead = this.renderTHead.bind(this);
		this.renderItem = this.renderItem.bind(this);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="componentDidMount">
	componentDidMount() {
		const {view, expiry_date} = this.state;
		this.setView({view, expiry_date, load: false});
	}

	// </editor-fold>

	@computed get isEmployee() {
		return this.state.view === "Employee";
	}

	get removed() {
		return this.pageKey === "RemovedTab";
	}

	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {removed, state: {view, expiry_date: expiry_date_top_filter}} = this;

		const {onBuildQuery} = this.props;

		const {page, lastItem, filterData, filtered, isNew} = params;
		const {
			department_id,
			job_position_id,
			employee_id,
			team_id,
			supervisor_id,
			name,
			//
			expiry_date,
		} = filterData || {};

		const mon = Dates.formatDateSQL(new Date().addMonths(1));
		const mon2 = Dates.formatDateSQL(new Date().addMonths(2));
		const mon3 = Dates.formatDateSQL(new Date().addMonths(3));

		const limit = 50;

		const args = {
			removed,
			view,
			expiry_date: expiry_date || expiry_date_top_filter,
			mon, mon2, mon3,
			//
			department_id,
			job_position_id,
			employee_id,
			team_id,
			supervisor_id,
			name,
			//
			limit,
			//
			exact_orgs: true,
		};

		if (!isNew) {
			args.offset = this.refs.root.list.length;
		} else {
			args.offset = 0;
		}

		return onBuildQuery(args).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}

	//</editor-fold>

	//<editor-fold desc="setView">
	async setView({view = 'Employee', expiry_date = 'ALL', load = true}) {
		let ref;
		if (this.refs.viewButtonsRefBox) {
			ref = this.refs.viewButtonsRefBox;
		} else {
			ref = await execWhen(() => this.refs.viewButtonsRefBox);
		}

		const {view: old_view, expiry_date: old_expiry_date, } = this.state;

		console.log('setView', this);
		console.log('setView view', old_view, view);
		console.log('setView expiry_date', old_expiry_date, expiry_date);

		if(old_view !== view || old_expiry_date !== expiry_date) {
			const filterWrapper = await execWhen(() => this.refs.root.refs.filterWrapper);
			if (filterWrapper.isOpen) {
				await filterWrapper.close();
			}
		}

		ref.setView(view);
		this.state.view = view;
		this.state.expiry_date = expiry_date;

		this.props.onChangeViewExpiryDate(expiry_date);

		if (load) {
			this.refs.root.load();
		}
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onView">
	onView(e, el) {
		const {idx} = el.props;
		const {list} = this.refs.root;
		const item = list[idx];
		console.log("list", this.isEmployee, list.slice())
		const dialog = this.refs.root.getDialogByRef('profileDialog');
		if (dialog) {
			if (this.isEmployee) {
				dialog.open(item);
			} else {
				const {data: {employee: employeeItem}} = item;
				dialog.extraProp('activeId', item.id).open(employeeItem);
			}
		}
	}

	// </editor-fold>

	//<editor-fold desc="onSaveAsPDF">
	async onSaveAsPDF(e, btn) {
		// const {idx} = btn.props;
		// const item = this.refs.root.list[idx];
		// this.refs.pdfReader.open(item);
	}

	//</editor-fold>

	//<editor-fold desc="onSaveAsExcel">
	async onSaveAsExcel(e, btn) {
		// const {idx} = btn.props;
		// const item = this.refs.root.list[idx];
		// this.refs.pdfReader.open(item);
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="APageListReadWrite funs">
	// <editor-fold defaultstate="collapsed" desc="renderDefaultLeftButtons">
	renderDefaultLeftButtons() {
		const {onExport, onSignatures} = this.props;
		const {isContractorView} = storage.is;

//        const {permissions_other} = storage.loggedUser.user.data;
//        //
//        const permissions_other_Medicals = (permissions_other || []).find(v => v.key === "Medicals");
//        const c_Medicals = Permissions.allow(permissions_other_Medicals) ? "allowed" : "disallowed";

//        const writable = storage.is.isContractor || !isContractorView;
		return <>
			<Button className="btn btn-primary pull-right" onClick={onExport}>
				Export
			</Button>
			<Button className="btn btn-primary pull-right" onClick={onSignatures}>
				Signatures
			</Button>
		</>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
	// <editor-fold defaultstate="collapsed" desc="renderFilterNode">
	renderFilterNode(onChange) {
		const {renderFilterNode} = this.props;
		return renderFilterNode(onChange);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHead">
	renderTHead() {
		const {view} = this.state;
		const {renderTHead} = this.props;
		return renderTHead({view});
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItem">
	renderItem(idx, onClick) {
		const {renderItem} = this.props;
		const {view} = this.state;
		const item = this.refs.root.list[idx];
		return renderItem({item, idx, view, onClick});
	}

	// </editor-fold>
	// </editor-fold>
	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="render">
	render() {
		const {ProfileDialog, EditDialog, onNewDialog, onSignatures, titleSingular} = this.props;
		const {state, state: {expiry_date}} = this;
		return <>
			<ViewByButtonsBox
				ref="viewButtonsRefBox"
				state={state}
				titleSingular={titleSingular}
				expiry_date={expiry_date}
				onChange={this.setView}
			/>
			<APageListReadWrite
				ref="root"
				page={this}
				pageId={this.pageKey + "-tab"}
				onLoadList={this.onLoadList}
				hasCreateBtn={() => !this.removed && !!onNewDialog}
				createBtnRendered={!this.removed && !!onNewDialog}
				noAnimation={true}
				renderDefaultLeftButtons={this.renderDefaultLeftButtons}
				renderLeftButtons={renderLeftButtonsForExpiryOnly.bind(this)}
				renderRightButtons={this.renderRightButtons}
				renderPopoverOptions={this.renderPopoverOptions}
				renderFilterNode={this.renderFilterNode}
				renderTHead={this.renderTHead}
				renderItem={this.renderItem}
			>
				<ConfirmDialog ref="removeDialog"/>

				{ProfileDialog && <ProfileDialog ref="profileDialog"/>}
				{EditDialog && <EditDialog ref="editDialog" onSetSignatureSettings={onSignatures}/>}

				<Popover ref="popover"/>
			</APageListReadWrite>
		</>;
	}

	// </editor-fold>
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByButtonsBox">
@observer
class ViewByButtonsBox extends React.Component {

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.setView = this.setView.bind(this);
	}

	// </editor-fold>

	setView(value) {
		execWhen(() => this.viewButtonsRef).then(ref => {
			ref.setView(value);
		});
	}

	render() {
		const {state: {view}, expiry_date, titleSingular, onChange} = this.props;
		return <MKBox
			width="100%"
			display="flex"
			alignItems="center"
			justifyContent="center"
			margin='10px 0 0px'
			padding="0 0 10px"
			borderBottom="2px solid #ebebeb"
		>
			<ViewByButtons ref={ref => {
				this.viewButtonsRef = ref;
			}} text="Employee" expiry_date={expiry_date} value={view} name={titleSingular} onChange={onChange}/>
		</MKBox>
	}
}

// </editor-fold>

export default ATab;