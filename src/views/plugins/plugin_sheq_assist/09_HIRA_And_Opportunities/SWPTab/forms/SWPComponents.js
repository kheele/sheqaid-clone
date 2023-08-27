import React from "react";
import {observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import {
	Button,
	ClearableInput,
	SelectEmployeeInput,
	SelectUserInput
} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';

@observer
class SelectWrapper extends React.Component {

	render() {
		const {state, name, placeholder, className, onChange, values} = this.props;
		if (!state.loadedSelectLists) return null;
		return <ClearableInput name={name} type="select" placeholder={placeholder} required className={className}
		                       onChange={onChange} values={state.lists[values]} returnValue add/>;
	}
}

@observer
class ANewListTable extends ATableSavable {
	@observable
	selfState = {};

	constructor(props) {
		super(props);
		this.insertAt = this.insertAt.bind(this);
	}

	insertAt(list, form) {
		list.insertAt(list.length - 1, form);
	}

	renderItem(n, onClick) {
		const item = this.state.list[n];
		if (item) {
			return <TRow key={"item-" + n} className="tr-readonly">
				<div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
				<div className="td"><span>{item.text}</span></div>
				<div className="td fixed-flex min-w-60">
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new" className="padding-l-0">
				<div className="td fixed-flex min-w-20"></div>
				<div className="td">
					<ClearableInput ref={this.onSetRef} name="text" type="text" placeholder="Type here" required
					                className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td fixed-flex min-w-60">
					<Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10" onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
	}

	render() {
		return (<Table className="w-full padding-0 margin-0">
			<THead className="align-left">
				<div className="td fixed-flex min-w-20"></div>
				<div className="td">{this.title}</div>
				<div className="td fixed-flex min-w-70 padding-0"></div>
			</THead>
			<TBody ref="body" title={this.title} renderItem={this.renderItem} onClick={this.onClick} state={this.state}
			       onLoadList={this.onLoadList} disablePullToRefresh={true}/>
		</Table>);
	}
}

@observer
class NewSignSheetListTable extends ATableSavable {
	@observable
	selfState = {};

	constructor(props) {
		super(props);

		this.insertAt = this.insertAt.bind(this);
	}

	insertAt(list, form) {
		list.insertAt(list.length - 1, form);
	}

	renderItem(n, onClick) {
		const item = this.state.list[n];
		if (item) {
			const {id, data: {fname, lname}} = item.employee;
			return <TRow key={"item-" + n} className="tr-readonly">
				<div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
				<div className="td"><span>{lname + ' ' + fname}</span></div>
				<div className="td fixed-flex min-w-60">
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new" className="padding-l-0">
				<div className="td fixed-flex min-w-20"></div>
				<div className="td">
					<SelectEmployeeInput ref={this.onSetRef} name="employee" type="select" placeholder="Select..." required
					                     className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td fixed-flex min-w-60">
					<Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10" onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
	}

	render() {
		return (<Table className="w-full padding-0 margin-0">
			<THead className="align-left">
				<div className="td fixed-flex min-w-20"></div>
				<div className="td">Employee</div>
				<div className="td fixed-flex min-w-70 padding-0"></div>
			</THead>
			<TBody ref="body" title="Names To Appear On WSWP Sign Sheet" renderItem={this.renderItem} onClick={this.onClick}
			       state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
		</Table>);
	}
}

@observer
class NewPotentialHazardAndPossibleCauseListTable extends ATableSavable {
	@observable
	selfState = {
		lists: {
			ratings: [
				{text: 'Low', value: 'Low', checked: false},
				{text: 'Medium', value: 'Medium', checked: false},
				{text: 'High', value: 'High', checked: false}
			]
		}
	};

	constructor(props) {
		super(props);

		this.onChangeInternal = this.onChangeInternal.bind(this);

		this.state.list = [
			{hazard: "Loose handle / rough handle", cause: "Poor maintanance or wear and tear", rating: "Medium"},
			{hazard: "Impact with other workers", cause: "Working too close together", rating: "High"},
			{hazard: "Underground obstacles", cause: "Preliminary investigation not done", rating: "High"},
			{hazard: "Strike with foot", cause: "Worker distracted by others", rating: "Medium"},
			{hazard: "Back or body strain", cause: "Incorrect posture, worker not suitable", rating: "Medium"},
			{hazard: "Respiratory impairment", cause: "Dust, fine, coarse, toxic", rating: "Medium"},
			{hazard: "Injury by spades in transit", cause: "Spades not secured to vehicle", rating: "Low"},
			{hazard: "Hand impact / repetitive strain", cause: "Ground too hard, worker not taking breaks", rating: "Medium"},
			{hazard: "Heat fatigue", cause: "Outdoor exposure", rating: "Medium"},
			null
		];

		this.insertAt = this.insertAt.bind(this);
	}

	onChangeInternal() {
		const {name} = this.props;
		const list = toJS(this.list);
		this.onChange(list, name, this);
		this.props.onChange && this.props.onChange(list, name, this);
	}

	insertAt(list, form) {
		list.insertAt(list.length - 1, form);
	}

	renderItem(n, onClick) {
		const item = this.state.list[n];
		if (item) {
			return <TRow key={"item-" + n} className="tr-readonly">
				<div className="td fixed-flex min-w-20"><span>{n + 1}.</span></div>
				<div className="td"><span>{item.hazard}</span></div>
				<div className="td"><span>{item.cause}</span></div>
				<div className="td fixed-flex min-w-295"><span>{item.rating}</span></div>
				<div className="td fixed-flex min-w-60">
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new" className="padding-l-0">
				<div className="td fixed-flex min-w-20"></div>
				<div className="td">
					<ClearableInput ref={this.onSetRef} name="hazard" type="text" placeholder="Type here" required
					                className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td">
					<ClearableInput ref={this.onSetRef} name="cause" type="text" placeholder="Type here" required
					                className="form-control" onChange={this.onChange}/>
				</div>
				<div className="td fixed-flex min-w-295">
					<ClearableInput ref={this.onSetRef} name="rating" type="radio" required className="form-control"
					                onChange={this.onChange} values={this.selfState.lists.ratings}/>
				</div>
				<div className="td fixed-flex min-w-60">
					<Button idx={n} action="save" className="btn btn-primary pull-right w-40 margin-t-10" onClick={onClick}>
						<i className="fa fa-check"/>
					</Button>
				</div>
			</TRow>;
		}
	}

	render() {
		return (<Table className="w-full padding-0 margin-0">
			<THead className="align-left">
				<div className="td fixed-flex min-w-20"></div>
				<div className="td">Potential Hazard</div>
				<div className="td">Possible Cause</div>
				<div className="td fixed-flex min-w-295">Risk Rating</div>
				<div className="td fixed-flex min-w-70 padding-0"></div>
			</THead>
			<TBody ref="body" title="Potential Hazards and Possible Causes" renderItem={this.renderItem}
			       onClick={this.onClick} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
		</Table>);
	}
}

@observer
class NewPPERequiredListTable extends ANewListTable {
	title = "PPE Required";

	constructor(props) {
		super(props);
	}
}

@observer
class NewStepsToPerformTaskListTable extends ANewListTable {
	title = "Steps To Perform This Task Safely";

	constructor(props) {
		super(props);
	}
}

@observer
class NewTrainingRequirementListTable extends ANewListTable {
	title = "Training Requirement and Reference Information";

	constructor(props) {
		super(props);
	}
}

export {
	SelectWrapper,
	NewSignSheetListTable,
	NewPotentialHazardAndPossibleCauseListTable,
	NewPPERequiredListTable,
	NewStepsToPerformTaskListTable,
	NewTrainingRequirementListTable,
};
