// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Grid, Chip } from "@mui/material";

import ADialogList from "views/ADialogList";
import APageListReadWrite from "views/APageListReadWrite";
import NavItem from 'components/navs/NavItem';
import ConfirmDialog from 'components/dialogs/ConfirmDialog';
import { UploadButton, ClearableInput, ActionsButton } from 'components/inputs';
import { TRow, THead } from 'components/tables';

import { NewDialog, ProfileDialog} from './forms';

import style from "./OHSDocListDialog.lazy.css";

// </editor-fold>

@observer
class OHSDocListDialog extends ADialogList {
	// <editor-fold defaultstate="collapsed" desc="fields">
	pageKey = "OHSDocListDialog";
	title = "OHS Documents";

	@observable
	selfState = {
		lists: {
			type: ["Standards", "Policies", "Procedures", "Guidelines", "Legal Register", "OHS Act", "Best Practices"],
		},
		source: null,
	};
	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.renderFilterNode = this.renderFilterNode.bind(this);
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="mounts">
	componentWillMount() {
		style.use();
	}

	componentWillUnmount() {
		style.unuse();
	}

	// </editor-fold>

	//<editor-fold desc="onLoadList">
	onLoadList(params = {}) {
		const {plugin, module} = this.props;
		// const _source = this.extraProp('source');
		// this.selfState.source = _source;

		const { page, lastItem, filterData, filtered, isNew } = params;
		const {
			type,
			title,
			// module,
		} = filterData || {};

		const listByLogged = sockets.of('documents/ohs-docs').fn('listAll');

		return listByLogged({
			type,
			title,
			module,
			//
			exact_orgs: false,
			excCompany: true,
			//
			offset: isNew ? 0 : this.refs.root.list.length,
		}).then((res) => {
			console.log('onLoadList res', res)
			return res;
		});
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
	renderPopoverOptions(idx, { onView, onEdit, onRemove, Options }) {
		const { permissionKey } = this.props;
		const item = this.refs.root.list[idx];
		const {
			type,
			title,
			desc,
			doc,
			module_list,
		} = item.data;

		return <Options idx={idx} permissionModKey={permissionKey}>
			<NavItem action="view" onClick={onView} faIconLeft="eye" title="View" />
			{/* <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit" />
			<NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove" /> */}
		</Options>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderFilterNode">
	renderFilterNode(onChange) {
		const {
			type,
		} = this.selfState.lists;
		return <div className="col-lg-12 controls grid-2 grid-gap-10 -margin-b-35">
			<ClearableInput
				name="type"
				type="select"
				placeholder="Type..."
				className="form-control"
				onChange={onChange}
				values={type}
				returnValue
			/>
			<ClearableInput
				name="title"
				type="text"
				placeholder="Title"
				className="form-control"
				onChange={onChange}
				returnValue
			/>
		</div>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderDefaultLeftButtons">
	renderDefaultLeftButtons() {
		// const { isEmployee, isContractorView } = storage.is;
		// const isReadonly = isEmployee;// || isContractorView;
		// return !isReadonly && <div className="left-buttons pull-left padding-l-10">
		// 	<Button className="btn btn-primary pull-right" onClick={this.onExport}>
		// 		Export
		// 	</Button>
		// </div>;
		return null;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderTHead">
	renderTHead() {
		return <THead>
			<div className="td fixed-flex min-w-50">#</div>
			<div className="td fixed-flex min-w-180">Document Type</div>
			<div className="td">Document Title</div>
			<div className="td">Description</div>
			<div className="td">Applicable Modules</div>
			<div className="td fixed-flex min-w-200">Document</div>
			<div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
		</THead>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderItem">
	renderItem(n, onClick) {
		const item = this.refs.root.list[n];
		let {
			id,
			data: {
				created_at,
				type,
				title,
				desc,
				doc,
				module_list,
			}
		} = item;

		return <TRow key={id} className="w-fulls">
			<div className="td fixed-flex min-w-50">{id}</div>
			<div className="td fixed-flex min-w-180">{type}</div>
			<div className="td">{title}</div>
			<div className="td">{desc}</div>
			<div className="td">
				{module_list ? <Grid container spacing={1} columns={4}>{
					module_list.map(({module:{title}}) => <Grid item><Chip label={title} size="small" /></Grid>)}
				</Grid> : 'N/A'}
			</div>
			<div className="td fixed-flex min-w-200">
				<UploadButton
					name="doc"
					type={['PDF', 'Word', 'Excel', 'PowerPoint']}
					defaultValue={doc}
					showOnlyIcon
					readonly
					className="col-lg-12"
				/>
			</div>
			<div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
				<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick} />
			</div>
		</TRow>;
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="renderPage">
	renderPage() {
		const { plugin, module } = this.props;

		return <APageListReadWrite
			ref="root"
			page={this}
			createBtnTitle="Create"
			pageId={this.pageKey + '-page'}
			listCountTopTitle="non-conformance"
			pageTitleSingular="non-conformance"
			noAnimation={true}
			onLoadList={this.onLoadList}
			renderLeftButtons={this.renderDefaultLeftButtons}
			renderPopoverOptions={this.renderPopoverOptions}
			renderFilterNode={this.renderFilterNode}
			renderTHead={this.renderTHead}
			renderItem={this.renderItem}
		>
			{/* <TitlePanel state={this.selfState} /> */}

			<ConfirmDialog ref="removeDialog" />

			<NewDialog ref="newDialog" plugin={plugin} module={module} />
			{/* <EditDialog ref="editDialog" plugin={plugin} module={module} /> */}
			<ProfileDialog ref="profileDialog" />

			{/* <ExportNCRDialog ref="exportNCRDialog" /> */}
		</APageListReadWrite>;
	}

	// </editor-fold>
}

export default OHSDocListDialog;