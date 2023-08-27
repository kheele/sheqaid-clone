//<editor-fold desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, observable, toJS} from 'mobx';

import Form from 'utils/Form';
import {getRiskRatingConsequenceList, getRiskRatingLikelihoodList} from 'views/plugins/utils';

import {Dates, execWhen, ShouldUpdate} from "utils/Utils";
import {
	Button,
	ClearableInput,
	SelectEmployeeInput,
} from 'components/inputs';
import {ATableSavable, Table, TBody, THead, TRow} from 'components/tables';
import {FormControls, RiskRating, Row} from 'components/FormComponents';
import {ANewDialog} from 'components/dialogs';

import style from "../../RAComponents/NewRiskAssessmentItemDialog.lazy.css";
import updateBaselineRA from "../../../../../../mutations/all/HIRA_And_Opportunities/BaselineRA/updateBaselineRA";
import updateTaskbasedRA from "../../../../../../mutations/all/HIRA_And_Opportunities/TaskbasedRA/updateTaskbasedRA";
import updateTaskbasedRAListItem
	from "../../../../../../mutations/all/HIRA_And_Opportunities/TaskbasedRAListItem/updateTaskbasedRAListItem";
import insertTaskbasedRA from "../../../../../../mutations/all/HIRA_And_Opportunities/TaskbasedRA/insertTaskbasedRA";
import insertTaskbasedRAListItem
	from "../../../../../../mutations/all/HIRA_And_Opportunities/TaskbasedRAListItem/insertTaskbasedRAListItem";
//</editor-fold>

//<editor-fold desc="Dialog">
@observer
class NewRiskAssessmentItemTaskBasedDialog extends ANewDialog {
	pageKey = "NewRiskAssessmentItemDialog";
	title = "Add Task Based Risk Assessment Item";

	constructor(props) {
		super(props, style);
	}

	@computed
	get topButtonsHiddenSave() {
		if (!this.props.mainItem) return false;
		if (!this.state.item) return false;
		return !!this.state.item.id;
	}

	get controls() {
		return Controls;
	}

	get topButtons() {
		return <React.Fragment>
			<Button className="btn btn-primary cancel" onClick={this.onCancel}>Cancel</Button>
			<Button className="btn btn-primary save" onClick={this.onSubmit}>
				<i className="fa fa-check icon-left"/>{this.state.item ? "Edit" : "Add"} Item
			</Button>
		</React.Fragment>;
	}
}

//</editor-fold>

@observer
class Controls extends React.Component {

	//<editor-fold desc="fields">
	@observable
	state = {
		lists: {
			risk_type: ["Safety", "Health", "Environmental", "Quality", "Financial"].map(text => text + " Risk").map(text => {
				return {text, value: text, checked: false};
			}),
			consequence_1: getRiskRatingConsequenceList(),
			consequence_2: getRiskRatingConsequenceList(),
			likelihood_1: getRiskRatingLikelihoodList(),
			likelihood_2: getRiskRatingLikelihoodList()
		},
		riskRatingSelected_1: {
			consequence: null,
			likelihood: null
		},
		riskRatingSelected_2: {
			consequence: null,
			likelihood: null
		}
	};
	//</editor-fold>

	//<editor-fold desc="constructor">
	constructor() {
		super();

		this.onNext = this.onNext.bind(this);

		this.form = new Form();
		this.form.addChangeMany(["consequence_1", "consequence_2"], this.onChangeConsequence.bind(this));
		this.form.addChangeMany(["likelihood_1", "likelihood_2"], this.onChangeLikelihood.bind(this));
		this.form.addChangeMany(["risk_rating_1", "risk_rating_2"], this.onChangeRiskRating.bind(this));
	}

	//</editor-fold>

	//<editor-fold desc="onChangeConsequence">
	onChangeConsequence(el, name, val) {
		if (val) {
			const num = name.split('_').getLastElement();
			execWhen(() => this.refs['likelihood_' + num] || this.refs['risk_rating_' + num]).then(() => {
				const {
					['likelihood_' + num]: likelihood_ref,
					['risk_rating_' + num]: risk_rating_ref
				} = this.refs;

				const riskRatingSelected = this.state['riskRatingSelected_' + num];
				riskRatingSelected.consequence = val;
				if (likelihood_ref.hasValue) {
					riskRatingSelected.likelihood = likelihood_ref.value;
				}
			});
		}
	}

	//</editor-fold>

	//<editor-fold desc="onChangeLikelihood">
	onChangeLikelihood(el, name, val) {
		if (val) {
			const num = name.split('_').getLastElement();
			execWhen(() => this.refs['consequence_' + num] || this.refs['risk_rating_' + num]).then(() => {
				const {
					['consequence_' + num]: consequence_ref,
					['risk_rating_' + num]: risk_rating_ref
				} = this.refs;

				const riskRatingSelected = this.state['riskRatingSelected_' + num];
				riskRatingSelected.likelihood = val;
				if (consequence_ref.hasValue) {
					riskRatingSelected.consequence = consequence_ref.value;
				}
			});
		}
	}

	//</editor-fold>

	//<editor-fold desc="onChangeRiskRating">
	onChangeRiskRating(el, name, val) {
		if (val) {
			const num = name.split('_').getLastElement();
			execWhen(() => this.refs['consequence_' + num] || this.refs['likelihood_' + num]).then(() => {
				const {
					['consequence_' + num]: consequence_ref,
					['likelihood_' + num]: likelihood_ref
				} = this.refs;

				const riskRatingSelected = this.state['riskRatingSelected_' + num];
				riskRatingSelected.consequence = val.consequence;
				riskRatingSelected.likelihood = val.likelihood;

				const {
					['consequence_' + num]: consequence_list,
					['likelihood_' + num]: likelihood_list
				} = this.state.lists;

				const consequence = consequence_list.find(item => item.value === val.consequence);
				const likelihood = likelihood_list.find(item => item.value === val.likelihood);

				consequence && consequence_ref.onChange(consequence);
				likelihood && likelihood_ref.onChange(likelihood);
			});
		}
	}

	//</editor-fold>

	//<editor-fold desc="onNext">
	onNext(e, btn) {
		const {form} = this;
		const {idx} = btn.props;
		if (idx === 2) {
			if (!form.isValid('task_step')) {
				infoDialog.open('Basic Task Step is required');
				return;
			}
			// if (!form.isValid('hazard')) {
			// 	infoDialog.open('Hazard / Potential Hazard is required');
			// 	return;
			// }
			// if (!form.isValid('risk')) {
			// 	infoDialog.open('Risk / Potential Risk is required');
			// 	return;
			// }
			// if (!form.isValid('risk_type')) {
			// 	infoDialog.open('Risk Type(s) is/are required');
			// 	return;
			// }
		}
		if (idx === 3) {
			// if (!form.isValid('consequence_1')) {
			// 	infoDialog.open('Consequence / Severity is required');
			// 	return;
			// }
			// if (!form.isValid('likelihood_1')) {
			// 	infoDialog.open('Likelihood / Probability is required');
			// 	return;
			// }
		}

		return true;
	}

	//</editor-fold>

	//<editor-fold desc="onFormSave">
	onFormSave(e, btn) {
		const {
			form,
			item: {id, data: old_data},
		} = this;
		const {is: {isContractor}, loggedContractor} = storage;
		const {item, mainItem} = this;

		const onSubmit = (data, onSaved) => {
			if (Object.keys(data).isEmpty()) {
				infoDialog.open("Nothing changed!");
				return;
			}

			console.log(data)

			btn.text("Saving...").disabled();
			progressDialog.open();
			updateTaskbasedRAListItem({id: this.item.id, ...data}).then(res => {
				console.log("res", res)
				onSaved && onSaved(res);
				infoDialog.open("Record successfully updated.");
				infoDialog.close(2000);
			}).finally(() => {
				btn.text("Save").enabled();
				setTimeout(() => progressDialog.close());
			});
		};

		const {idx} = btn.props;

		if (idx === 1) {
			const {
				//1
				responsible_person,
				target_date,
				due_date,
			} = form.data;

			const data = {};
			ShouldUpdate.checkEmployee(data, old_data, responsible_person, 'responsible_person');
			ShouldUpdate.checkDate(data, old_data, target_date, 'target_date');
			ShouldUpdate.checkDate(data, old_data, due_date, 'due_date');

			onSubmit(data);
			return;
		}

		if (idx === 2) {
			if (!form.isValid('task_step')) {
				infoDialog.open('Basic Task Step is required');
				return;
			}

			const {
				//2
				task_step,
				hazard,
				risk,
				risk_type,
			} = form.data;

			const data = {};
			ShouldUpdate.check(data, old_data, task_step, 'task_step');
			ShouldUpdate.check(data, old_data, hazard, 'hazard');
			ShouldUpdate.check(data, old_data, risk, 'risk');
			ShouldUpdate.check(data, old_data, risk_type, 'risk_type');

			onSubmit(data);
			return;
		}

		if (idx === 3) {
			const {
				//3
				consequence_1,
				likelihood_1,
			} = form.data;

			const data = {};
			ShouldUpdate.check(data, old_data, consequence_1, 'consequence_1');
			ShouldUpdate.check(data, old_data, likelihood_1, 'likelihood_1');

			onSubmit(data);
			return;
		}

		if (idx === 4) {
			const {
				//4
				control_measure_list,
				consequence_2,
				likelihood_2,
			} = form.data;

			const data = {};
			ShouldUpdate.checkJson(data, old_data, control_measure_list, 'control_measure_list');
			ShouldUpdate.check(data, old_data, consequence_2, 'consequence_2');
			ShouldUpdate.check(data, old_data, likelihood_2, 'likelihood_2');

			onSubmit(data);
			return;
		}

		return true;
	}

	//</editor-fold>

	//<editor-fold desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form, item, mainItem} = this;

		if (!form.isValid('task_step')) {
			infoDialog.open('Basic Task Step is required');
			return;
		}
		// if (!form.isValid('hazard')) {
		// 	infoDialog.open('Hazard / Potential Hazard is required');
		// 	return;
		// }
		// if (!form.isValid('risk')) {
		// 	infoDialog.open('Risk / Potential Risk is required');
		// 	return;
		// }
		// if (!form.isValid('risk_type')) {
		// 	infoDialog.open('Risk Type(s) is/are required');
		// 	return;
		// }
		//
		// if (!form.isValid('consequence_1')) {
		// 	infoDialog.open('Consequence / Severity is required');
		// 	return;
		// }
		// if (!form.isValid('likelihood_1')) {
		// 	infoDialog.open('Likelihood / Probability is required');
		// 	return;
		// }

		const {
			//1
			responsible_person,
			target_date,
			due_date,
			//2
			task_step,
			hazard,
			risk,
			risk_type,
			//3
			consequence_1,
			likelihood_1,
			//4
			control_measure_list,
			consequence_2,
			likelihood_2,
		} = form.data;

		let data = {};
		if (!this.item || !this.item.id) {
			data = {
				//1
				responsible_person_id: responsible_person && responsible_person.id,
				target_date: Dates.formatDateSQL(target_date),
				due_date: Dates.formatDateSQL(due_date),
				//2
				task_step,
				hazard,
				risk,
				risk_type,
				//3
				consequence_1,
				likelihood_1,
				//4
				control_measure_list: (control_measure_list || []).filter(v => v !== null),
				consequence_2,
				likelihood_2,
			};
		}

		if (mainItem) {
			if (this.item && this.item.id) {
				// if (Object.keys(data).isEmpty()) {
				// 	infoDialog.open("Nothing changed!");
				// 	return;
				// }
				//
				// console.log(data)
				//
				// btn.text("Saving...").disabled();
				// progressDialog.open();
				// updateTaskbasedRAListItem({id: this.item.id, ...data}).then(res => {
				// 	console.log("res", res)
				// 	onSaved && onSaved(res);
				// 	infoDialog.open("Record successfully updated.");
				// 	infoDialog.close(2000);
				// }).finally(() => {
				// 	btn.text("Save").enabled();
				// 	setTimeout(() => progressDialog.close());
				// });
			} else {
				data.taskbased_ra_id = mainItem.id;

				console.log(data)

				btn.text("Saving...").disabled();
				progressDialog.open();
				insertTaskbasedRAListItem(data).then(res => {
					console.log("res", res)
					onSaved && onSaved(res);
					infoDialog.open("Record successfully saved.");
					infoDialog.close(2000);
					this.props.close();
				}).finally(() => {
					btn.text("Save").enabled();
					setTimeout(() => progressDialog.open());
				});
				// onSaved(data);
				// this.props.close();
			}
			return;
		}

		console.log(data)

		onSaved(data);
		this.props.close();
	}

	//</editor-fold>

	get mainItem() {
		return this.props.dialog.props.mainItem;
	}

	get item() {
		return this.props.state.item;
	}

	//<editor-fold desc="render">
	render() {
		const {onFormNext, onFormBack, onFormOpen} = this.props;
		const {item, mainItem} = this;

		const canEdit = !!mainItem && item && item.id;

		return <FormControls>
			<Row
				rendered
				active
				idx={1}
				title="1. General Details"
				sectionClassName="-margin-r-10"
				onFormOpen={onFormOpen}
				onFormNext={onFormNext}
				onFormSave={canEdit && this.onFormSave}
			>
				<SelectEmployeeInput name="responsible_person" placeholder="Responsible Person..." required
				                     defaultValue={item && item.responsible_person} className="col-lg-4 form-control"
				                     onChange={this.form.onChange}/>
				<ClearableInput name="target_date" type="date" placeholder="Target Date..."
				                defaultValue={item && item.target_date} required className="col-lg-4 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="due_date" type="date" placeholder="Due Date..." defaultValue={item && item.due_date}
				                required className="col-lg-4 form-control" onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={2}
				title="2. Hazard & Risk Details"
				className="row-photos"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
				onFormSave={canEdit && this.onFormSave}
			>
				<ClearableInput name="task_step" type="text" placeholder="Basic Task Step"
				                defaultValue={item && item.task_step} required className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="hazard" type="text" placeholder="Hazard / Potential Hazard"
				                defaultValue={item && item.hazard} required className="col-lg-6 form-control"
				                onChange={this.form.onChange}/>
				<ClearableInput name="risk" type="text" placeholder="Risk / Potential Risk" defaultValue={item && item.risk}
				                required className="col-lg-12 form-control" onChange={this.form.onChange}/>
				<ClearableInput name="risk_type" type="checkbox" placeholder="Risk Type(s)"
				                defaultValue={item && item.risk_type} required vertical className="col-lg-12 form-control"
				                onChange={this.form.onChange} values={this.state.lists.risk_type} returnValue/>
			</Row>
			<Row
				rendered
				idx={3}
				title="3. Risk Rating Without Control Measures"
				className="row-photos"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormNext={onFormNext}
				onFormSave={canEdit && this.onFormSave}
			>
				<ClearableInput ref="consequence_1" name="consequence_1" type="radio" placeholder="Consequence / Severity"
				                defaultValue={item && item.consequence_1} className="col-lg-6 form-control" vertical
				                onChange={this.form.onChange} values={this.state.lists.consequence_1}/>
				<ClearableInput ref="likelihood_1" name="likelihood_1" type="radio" placeholder="Likelihood / Probability"
				                defaultValue={item && item.likelihood_1} className="col-lg-6 form-control" vertical
				                onChange={this.form.onChange} values={this.state.lists.likelihood_1}/>
				<label className="margin-t-10 hor-center w-full">Risk Rating Index</label>
				<RiskRating selected={this.state.riskRatingSelected_1} ref="risk_rating_1" name="risk_rating_1"
				            onChange={this.form.onChange}/>
			</Row>
			<Row
				rendered
				idx={4}
				title="4. Risk Control Measures"
				onFormOpen={onFormOpen}
				onFormBack={onFormBack}
				onFormSave={canEdit && this.onFormSave}
			>
				<NewRiskControlMeasureListTable name="control_measure_list"
				                                defaultValue={item && [...item.control_measure_list, null]}
				                                onChange={this.form.onChange}/>
				<label className="w-full margin-t-10 margin-b-0">Risk Rating With Control Measures</label>
				<ClearableInput ref="consequence_2" name="consequence_2" type="radio" placeholder="Consequence / Severity"
				                defaultValue={item && item.consequence_2} className="col-lg-6 form-control" vertical
				                onChange={this.form.onChange} values={this.state.lists.consequence_2}/>
				<ClearableInput ref="likelihood_2" name="likelihood_2" type="radio" placeholder="Likelihood / Probability"
				                defaultValue={item && item.likelihood_2} className="col-lg-6 form-control" vertical
				                onChange={this.form.onChange} values={this.state.lists.likelihood_2}/>
				<label className="margin-t-10 hor-center w-full">Risk Rating Index</label>
				<RiskRating selected={this.state.riskRatingSelected_2} ref="risk_rating_2" name="risk_rating_2"
				            onChange={this.form.onChange}/>
			</Row>
		</FormControls>;
	}

	//</editor-fold>
}

//<editor-fold desc="NewRiskControlMeasureListTable">
@observer
class NewRiskControlMeasureListTable extends ATableSavable {
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
				<div className="td">
					<span className="counter">{n + 1}</span>
					<span>{item.text}</span>
				</div>
				<div className="td fixed-flex min-w-60">
					<Button idx={n} action="delete" className="btn btn-primary pull-right w-40" onClick={onClick}>
						<i className="fa fa-times-circle"/>
					</Button>
				</div>
			</TRow>;
		} else {
			return <TRow key="item-new" className="padding-l-0">
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
			<THead>
				<div className="td">Risk Control Measure</div>
				<div className="td fixed-flex text-center padding-l-0 padding-r-0 min-w-60"></div>
			</THead>
			<TBody ref="body" title="Risk Control Measures" renderItem={this.renderItem} onClick={this.onClick}
			       state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
		</Table>);
	}
}

//</editor-fold>

export default NewRiskAssessmentItemTaskBasedDialog;
