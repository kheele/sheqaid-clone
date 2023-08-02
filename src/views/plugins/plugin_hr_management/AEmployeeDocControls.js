import React from "react";
import {observer} from 'mobx-react';
import {Carousel} from 'components/lists';
import {Button} from "components/inputs";
import MKBox from "components/MK/MKBox";
import {computed, extendObservable, observable} from "mobx";
import {Tabs} from "components/tabs";
import DashboardTab from "./AEmployeeDocDialog/ADashboardTab";
import {CircularProgress} from "@mui/material";
import {execWhen} from "utils/Utils";

@observer
class AEmployeeDocControls extends React.Component {

	@observable
	state = {
		index: 0,
		item: null,
	};

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.loadDashboard = this.loadDashboard.bind(this);
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="componentDidMount">
	async componentDidMount() {
		const {dialog, item} = this.props;

		if (item) {
			this.state.item = item;
		}

		if (dialog) {
			try {
				const node = await dialog.execWhen(() => dialog.getDOMNode());
				const jqEl = $(node.querySelector('.dialog-header h3'));

				if (this.item.data.removed) {
					jqEl.removeClass('active');
				} else {
					jqEl.addClass('active');
				}
			} catch (e) {

			}
		}
	}

	// </editor-fold>

	//<editor-fold desc="onChange">
	onChange(index) {
		const {state} = this;
		state.index = index;

		execWhen(() => this.refs.editB).then(ref => {
			if (index === 0) {
				ref.hide();
			} else {
				ref.show();
			}
		});
	}
	//</editor-fold>

	//<editor-fold desc="loadDashboard">
	async loadDashboard() {
		const {id} = this.item;
		const topStats = await this.loadDashboardTopStats(id);
		const bottomStats = await this.loadDashboardBottomStats(id);//[{id, month_year: date.formatMonthYear(), count}]
		return {topStats, bottomStats};
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
	onSaveAsPDF(e, btn) {
		this.refs.pdfReader.open(this.item);
	}

	// </editor-fold>

	//<editor-fold desc="onCreate">
	onCreate() {
		this.refs.newDialog.open(this.item).then(newItem => {
			const {[this.listName]: list = []} = this.item.data;

			const newData = newItem.data;
			list.push(newData);

			const {tabWrapper, tabWrapper: {index}} = this.refs;
			if (index === 0) {
				tabWrapper.updateDashboard();
			} else if (index === 1) {
				tabWrapper.moveToSlide(list.indexOfWithPredicate(v => v.id === newData.id));
			}
		});
	}

	//</editor-fold>

	//<editor-fold desc="onEdit">
	onEdit() {
		const {tabWrapper, tabWrapper: {index}} = this.refs;
		if (index === 0) {
			return;
		}

		const {[this.listName]: list = []} = this.item.data;

		const sliderIndex = tabWrapper.sliderIndex || 0;
		let updateItem = list[sliderIndex];
		updateItem = {id: updateItem.id, data: updateItem};

		this.refs.editDialog.open(updateItem).then(editedItem => {
			extendObservable(updateItem, editedItem);
			// const editData = editItem.data;
			// list.push(newData);

			const {tabWrapper, tabWrapper: {index}} = this.refs;
			if (index === 0) {
				tabWrapper.updateDashboard();
			} else if (index === 1) {
				// tabWrapper.moveToSlide(list.indexOfWithPredicate(v => v.id === editData.id));
			}
		});
	}

	//</editor-fold>

	@computed get item() {
		return this.state.item;
	}

	//<editor-fold desc="render">
	render() {
		if (!this.item) {
			return <CircularProgress className="fixed-center"/>;
		}

		const {
			NewDialog,
			EditDialog,
			item: {
				id,
				data: {
					fname, lname,

					[this.listName]: list = [],
				},
			},
			listName,
			props: {tabsHeight}
		} = this;

		const {isEmployee} = storage.is;

		const isEmbedded = !!this.props.item;

		const slider = (activeId, isEmbedded) => {
			const sliderIndex = activeId ? list.indexOfWithPredicate(item => item.id === activeId) : 0;
			const tabIndex = activeId ? 1 : 0;
			return <>
				<MKBox
					className={isEmbedded ? 'EmbeddedBtnBar' : ''}
					sx={{
						background: "none",
						borderBottom: "1px solid #ddd",
						p: "10px",
						height: "40px",
					}}>
					{!isEmployee && <Button
						ref="editB"
						className="btn btn-primary pull-right btn-edit border-radius-20 padding-v-5 padding-h-15 margin-r-15"
						onClick={this.onEdit}>
						Edit
					</Button>}
					{!isEmployee && <Button
						className="btn btn-primary pull-right btn-create border-radius-20 padding-v-5 padding-h-15 margin-r-15"
						onClick={this.onCreate}>
						Create
					</Button>}
				</MKBox>
				<TabWrapper
					ref="tabWrapper"
					onChange={this.onChange}
					loadDashboard={this.loadDashboard}
					renderItem={this.renderItem}
					onSliderClick={this.onClick}
					list={list}
					tabIndex={tabIndex}
					sliderIndex={sliderIndex}
					listName={listName}
					tabsHeight={tabsHeight}
					isEmbedded={isEmbedded}
				/>
				{NewDialog && <NewDialog ref="newDialog"/>}
				{EditDialog && <EditDialog ref="editDialog"/>}
			</>;
		};

		if (isEmbedded) {
			const {props: {activeId},} = this;
			return <>
				{slider(activeId, isEmbedded)}
			</>;
		}

		const {
			props: {
				dialog, dialog: {renderProfileCover},
			},
			ProfilePDFReader,
		} = this;

		const activeId = dialog.extraProp('activeId');

		return <div className="controls-wrapper">
			<div className="controls">
				{renderProfileCover(<React.Fragment>
					<h3>{lname + ' ' + fname}</h3>
					<h5>{list.length + ' Competency Certificates'}</h5>
				</React.Fragment>)}
				{slider(activeId)}
			</div>
			{ProfilePDFReader && <ProfilePDFReader ref="pdfReader"/>}
		</div>;
	}

	//</editor-fold>

}

// <editor-fold defaultstate="collapsed" desc="TabWrapper">
@observer
class TabWrapper extends React.Component {

	@observable
	state = {
		index: 0,
		sliderIndex: null,
	};

	constructor() {
		super();

		this.onChange = this.onChange.bind(this);
		this.onCarouselChange = this.onCarouselChange.bind(this);
		this.updateDashboard = this.updateDashboard.bind(this);
		this.moveToSlide = this.moveToSlide.bind(this);
	}

	componentDidMount() {
		this.onChange(this.props.tabIndex || 0);
	}

	onChange(index) {
		const {state, props: {onChange}} = this;
		state.index = index;
		onChange && onChange(index);
	}

	onCarouselChange(index) {
		this.state.sliderIndex = index;
	}

	get index() {
		return this.state.index;
	}

	@computed get sliderIndex() {
		return this.state.sliderIndex;
	}

	updateDashboard() {
		setTimeout(() => {
			const ref = this.refs.mainTabs.getTabByRef("dashboard");
			ref && ref.update();
		});
	}

	moveToSlide(index) {
		setTimeout(() => {
			const ref = this.refs.mainTabs.getTabByRef("slider");
			ref && ref.move(index);
		});
	}

	render() {
		const {
			permissionKey,
			loadDashboard,
			listName,
			renderItem,
			list,
			sliderIndex,
			onSliderClick,
			tabsHeight,
			isEmbedded,
		} = this.props;

		return (
			<Tabs key="tabs" ref="mainTabs" tabsHeight={tabsHeight} permissionKey={permissionKey} index={this.state.index} className={isEmbedded ? "Embedded-Tabs" : ""}
			      onChange={this.onChange}>
				<DashboardTab
					ref="dashboard"
					title="Dashboard"
					loadDashboard={loadDashboard}
					topStatsSize={120}
				/>
				<Carousel
					ref="slider"
					title="Details"
					sliderIndex={sliderIndex}
					renderer={renderItem}
					list={list}
					splitBy={1}
					colSize="col-lg-12"
					onClick={onSliderClick}
					onChange={this.onCarouselChange}
				/>
			</Tabs>);
	}
}

// </editor-fold>

export default AEmployeeDocControls;
