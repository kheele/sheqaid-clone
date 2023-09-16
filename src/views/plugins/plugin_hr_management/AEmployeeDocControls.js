import React from "react";
import {observer} from 'mobx-react';
import {Carousel} from 'components/lists';
import MKBox from "components/MK/MKBox";
import {computed, extendObservable, observable} from "mobx";
import {Tabs} from "components/tabs";
import DashboardTab from "./AEmployeeDocDialog/ADashboardTab";
import {CircularProgress} from "@mui/material";
import {execWhen} from "utils/Utils";
import CreateAndEditBar from "./CreateAndEditBar";

@observer
class AEmployeeDocControls extends React.Component {

	@observable
	state = {
		index: 0,
		list: [],
		item: null,
	};

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.onRemove = this.onRemove.bind(this);
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
		execWhen(() => this.refs.createAndEditBar).then(ref => {
			if (index === 0) {
				ref.hideEditableButtons();
			} else {
				ref.showEditableButtons();
			}
		});
	}
	//</editor-fold>

	//<editor-fold desc="loadDashboard">
	async loadDashboard() {
		const {isNewEmployee} = this.props;
		if(isNewEmployee) {
			return {
				topStats: {data: null},
				bottomStats: [],
			};
		}

		const item = await execWhen(() => this.item);

		const {id} = item;
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
		const {isNewEmployee, onChange} =this.props;
		if(isNewEmployee) {
			this.refs.newDialog.open().then(newItem => {
				const {list} = this;

				list.push(newItem);
				onChange && onChange(list, this.listName, this);

				const {tabWrapper, tabWrapper: {index}} = this.refs;
				if (index === 0) {
					// tabWrapper.moveToSlide(1);
				} else if (index === 1) {
					tabWrapper.moveToSlide(list.indexOf(newItem));
				}
			});
		} else {
			this.refs.newDialog.open(this.item).then(newItem => {
				const newData = newItem.data;

				const {item: {data, data: {[this.listName]: list}}} = this;
				if (list) {
					list.push(newData);
				} else {
					extendObservable(data, {[this.listName]: [newData]});
				}

				const {tabWrapper, tabWrapper: {index}} = this.refs;
				if (index === 0) {
					tabWrapper.updateDashboard();
				} else if (index === 1) {
					tabWrapper.moveToSlide(list.indexOfWithPredicate(v => v.id === newData.id));
				}
			});
		}
	}

	//</editor-fold>

	//<editor-fold desc="onEdit">
	onEdit() {
		const {isNewEmployee, onChange} =this.props;
		const {tabWrapper, tabWrapper: {index}} = this.refs;
		if (index === 0) {
			return;
		}

		if(isNewEmployee) {
			const {list} = this.state;

			const sliderIndex = tabWrapper.sliderIndex || 0;
			let updateItem = list[sliderIndex];

			this.refs.editDialog.open({data: updateItem}).then(editedItem => {
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
		} else {
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
	}

	//</editor-fold>

	//<editor-fold desc="onRemove">
	onRemove(evt, btn) {
		const {onUpdate} = this;
		const {isNewEmployee, onChange} =this.props;
		const {tabWrapper, tabWrapper: {index}} = this.refs;
		if (index === 0) {
			return;
		}

		confirmDialog.open('Are you sure you want to remove the record').then(res => {
			if (res) {
				const sliderIndex = tabWrapper.sliderIndex || 0;

				if (isNewEmployee) {
					const {list} = this.state;

					list.removeAt(sliderIndex);
					infoDialog.open("Record successfully removed.");
					infoDialog.close(2000);
				} else {
					const {[this.listName]: list = []} = this.item.data;

					const removeItem = list[sliderIndex];

					onUpdate && onUpdate({id: removeItem.id, removed: true}).then(res => {
						if (res) {
							list.removeAt(sliderIndex);
							infoDialog.open("Record successfully removed.");
							infoDialog.close(2000);
						} else {
							infoDialog.open("Sorry! The record couldn't be removed. Please try again later.");
						}
					});
				}
			}
		});
	}
	//</editor-fold>

	@computed get item() {
		return this.state.item;
	}

	@computed get list() {
		if(!this.item) return this.state.list;

		const {item: {data: {[this.listName]: list = []}}} = this;
		return list || [];
	}

	//<editor-fold desc="render">
	render() {
		const {
			NewDialog,
			EditDialog,
			listName,
			list,
			props: {tabsHeight, isEmbedded: __isEmbedded, isNewEmployee}
		} = this;

		const {isEmployee} = storage.is;

		const isEmbedded = __isEmbedded || !!this.props.item;

		if (!isEmbedded && !this.item) {
			return <CircularProgress className="fixed-center"/>;
		}

		const slider = (activeId, isEmbedded, list) => {
			const sliderIndex = activeId ? list.indexOfWithPredicate(item => item.id === activeId) : 0;
			const tabIndex = activeId ? 1 : 0;
			return <>
				<MKBox
					className={isEmbedded ? 'EmbeddedBtnBar' : ''}
					sx={{
						background: "none",
						borderBottom: "1px solid #ddd",
						p: isEmbedded ? '3px' : '10px',
						mb: isEmbedded ? '-40px' : '0',
						height: "40px",
						// position: isEmbedded ? 'absolute' : 'relative',
						// top: isEmbedded ? '0' : 'unset',
						// right: isEmbedded ? '0' : 'unset',
					}}>
					{!isEmployee && <CreateAndEditBar
						ref="createAndEditBar"
						onRemove={this.onRemove}
						onEdit={this.onEdit}
						onCreate={this.onCreate}
						list={list}
						isEmbedded={isEmbedded}
						isContained
					/>}
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
				{NewDialog && <NewDialog ref="newDialog" isNewEmployee={isNewEmployee} embeddedEmployee={this.item}/>}
				{EditDialog && <EditDialog ref="editDialog" isNewEmployee={isNewEmployee} embeddedEmployee={this.item}/>}
			</>;
		};

		if (isEmbedded) {
			const {props: {activeId},} = this;
			return <>
				{slider(activeId, isEmbedded, list)}
			</>;
		}

		const {
			props: {
				dialog, dialog: {renderProfileCover},
			},
			ProfilePDFReader,
			item: {
				id,
				data: {
					fname, lname,
				},
			},
		} = this;

		const activeId = dialog.extraProp('activeId');

		return <div className="controls-wrapper">
			<div className="controls">
				{renderProfileCover(<>
					<h3>{lname + ' ' + fname}</h3>
					<h5>{this.list.length + ' Competency Certificates'}</h5>
				</>)}
				{slider(activeId, false, list)}
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
