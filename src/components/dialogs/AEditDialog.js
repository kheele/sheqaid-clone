import React from "react";
import {observer} from 'mobx-react';
import {computed} from 'mobx';
import {CircularProgress} from "@mui/material";

import {Button} from '../inputs';
import Dialog from './Dialog';

import AFormDialog from './AFormDialog';

@observer
class AEditDialog extends AFormDialog {

	constructor(props, style) {
		super(props, style);

		this.onView && (this.onView = this.onView.bind(this));
		this.onDelete = this.onDelete.bind(this);
		this.onRemoved = this.onRemoved.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();
		this.execWhen(() => {
			if (!this.topButtons) return false;
			return this.refs.dialog;
		}).then(dialog => {
			dialog.setTopButtons(this.topButtons);
		});
	}

	open(item) {
		this.execWhen(() => this.state.item).then(() => {
			const {submit, deleteB, hr} = this.refs;
			if (!this.topButtonsHiddenSave) {
				submit && submit.show();
			}
			if (!this.topButtonsHiddenDelete && !storage.is.isEmployee) {
				deleteB && deleteB.show();
			}
			if (!this.topButtonsHiddenCancel) {
				this.execWhen(() => this.refs.cancel).then(cancel => {
					cancel.show();
				});
			}

			const hideHR = () => {
				return (this.topButtonsHiddenDelete || storage.is.isEmployee) && !this.onView;
			};
			if (!hideHR()) {
				hr && (hr.style.display = 'none');
			}
		});
		return super.open(item);
	}
	
	get parentListPage() {
		const {stateNode} = this._reactInternals._debugOwner;
		return stateNode;
	}
	
	onRemoved(item) {
		if(!item || !item.id) return;
		
		const {parentListPage} = this;
		if(parentListPage) {
			const {root} = parentListPage.refs || {};
			if(root && root.list) {
				root.list.removeIf((v, n) => v.id === item.id);
			}
		}
	}
	
	onDelete(e, btn) {
//        this.refs.controls.onDelete(e, btn);
		confirmDialog.open("Are you sure you want to remove the record?").then(async res => {
			if (res === 1) {
				const {item} = this.state;
				let {removeById, props:{softDeleteAttrs, onSoftDelete, onSoftDeleteProhibit}} = this;
				const onDelete = onSoftDelete || removeById;
				if (onDelete) {
					if(onSoftDeleteProhibit) {
						let prohibit = onSoftDeleteProhibit(item);
						if(prohibit instanceof Promise) {
							prohibit = await prohibit;
						}
						if(prohibit) {
							return;
						}
					}

					progressDialog.open();
					let args = {id: item.id};
					if(softDeleteAttrs) {
						args = {...args, ...softDeleteAttrs};
					} else {
						args.removed = true;
					}

					onDelete(args).then(res => {
						this.onRemoved(item);
						
						infoDialog.open("Record successfully removed.");
						setTimeout(function () {
							infoDialog.close();
							this.close();
						}.bind(this), 2000);
					}).finally(() => {
						progressDialog.close();
					});
				}
			}
		});
	}

	@computed get topButtons() {
		if (this.topButtonsHidden) return null;
		return <React.Fragment>
			{!storage.is.isEmployee &&
				<Button ref={ref => this.refs.deleteB = ref} shouldRender={false} className="btn btn-primary"
				        onClick={this.onDelete}>
					<i className="fa fa-ban icon-left"/>Delete
				</Button>}
			{this.onView && <Button className="btn btn-primary" onClick={this.onView}>
				<i className="fa fa-eye icon-left"/>View
			</Button>}
			<hr ref={ref => this.refs.hr = ref} className="h-full"/>
			<Button ref={ref => this.refs.cancel = ref} shouldRender={false} className="btn btn-primary cancel"
			        onClick={this.onCancel}>
				<i className="fa fa-times icon-left"/>Cancel
			</Button>
			<Button ref={ref => this.refs.submit = ref} shouldRender={false} className="btn btn-primary save"
			        onClick={this.onSubmit}>
				<i className="fa fa-check icon-left"/>Save
			</Button>
		</React.Fragment>;
	}

	renderProfileCover(val) {
		return <div className="row row-profile-cover">
			{isString(val) && <h3>{val}</h3>}
			{!isString(val) && val}
		</div>;
	}

	render() {
		let className = this.pageKey + '-profile-dialog';
		!!this.className && (className += ' ' + this.className);
		const Controls = this.controls;
		return (<Dialog
			key={this.pageKey + '-profile-dialog'}
			ref="dialog"
			className={className + ' AProfileDialog'}
			noBackAction={this.noBackAction || this.props.noBackAction}
			preventEsc={this.preventEsc || this.props.preventEsc}
			topButtons={this.topButtons}
			onCancel={this.onCancel}
			onClose={this.onClose}
			dialog={this}
		>
			<CircularProgressWrapper state={this.state}/>
			<Controls
				ref="controls"
				dialog={this}
				state={this.state}
				path={this.props.path}
				extraProps={this.extraProps}
				close={this.close}
				onFormGoto={this.onFormGoto}
				onFormGotoNext={this.onFormGotoNext}
				onFormGotoPrev={this.onFormGotoPrev}
				onFormNext={this.onFormNext}
				onFormBack={this.onFormBack}
				onFormOpen={this.onFormOpen}
				execWhen={this.execWhen}
			/>
		</Dialog>);
	}
}

@observer
class CircularProgressWrapper extends React.Component {
	
	render() {
		const {item} = this.props.state;
		if(!item) return <CircularProgress className="fixed-center"/>;
		
		return null;
	}
}

export default AEditDialog;
//192
