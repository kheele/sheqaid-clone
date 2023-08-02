import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import Form from 'utils/Form';

import {execWhen} from 'utils/Utils';
import {ClearableInput} from 'components/inputs';
import Stats from "./Stats";
import listBy from "./Stats/Query/List/listAllDashboardByLogged";

//<editor-fold desc="DashboardAssets">
@observer
class DashboardAssets extends React.Component {
	key = 'DashboardAssets';

	@observable
	state = {
		lists: {years: []},
		dataLoaded: false,
		dataError: false,
		data: null,
		year: new Date().getFullYear(),
		employee_view: 'active',
		interval: 'Month',
	};

	constructor(props) {
		super(props);
		const start = this.state.year;
		const end = start - 2000;
		for (let value = start; value >= 2000; value--) {
			this.state.lists.years.push({label: value, value});
		}

		this.load = this.load.bind(this);

		this.form = new Form();

		this.onChangeYear = this.onChangeYear.bind(this);
		this.form.addChangeOne("year", this.onChangeYear);
	}

	componentDidMount() {
		this.load();
	}

	onChangeYear(el, val) {
		if (val) {
			this.state.year = parseInt(val);
		}
		this.load();
	}

	@computed get currY() {
		return this.state.year;
	}

	get defaultY() {
		const value = this.state.year;
		return {label: value, value};
	}

	//<editor-fold desc="setEmployees">
	async setEmployees(value, load = true) {
		let ref;
		if (this.trainingPlanEmployeesButtonsRef) {
			ref = this.trainingPlanEmployeesButtonsRef;
		} else {
			ref = await execWhen(() => this.trainingPlanEmployeesButtonsRef);
		}

		ref.setView(value);
		this.state.employee_view = value;

		// if (load) {
		//     this.refs.root.load();
		// }
	}

	//</editor-fold>

	//<editor-fold desc="setInterval">
	setInterval(value) {
		const {intervalButtons, stats} = this.refs;
		intervalButtons.setInterval(value);
		stats.setInterval(value);
	}

	//</editor-fold>

	async load() {
		//{year, month, date, day, am_pm}
		this.state.dataLoaded = false;

		listBy({company_id: 6,}).then(res => {
			this.state.data = res;
			this.state.dataLoaded = true;
			this.state.dataError = false;
		}).catch(e => {
			console.error(e)
			this.state.dataLoaded = true;
			this.state.dataError = true;
		});
	}

	update() {
		this.load();
	}

	render() {
		const {state: {value}} = this.props;
		if (value !== this.key) return null;

		const {
			state,
			state: {data},
		} = this;

		const {interval, employee_view} = state;

		return <React.Fragment>
			<div className="filter-input flex">
				<ClearableInput name="year" type="select" placeholder="Filter By Year"
				                className="fixed-flex min-w-140 margin-t-5 form-control" onChange={this.form.onChange}
				                defaultValue={this.defaultY} values={this.state.lists.years} returnValue/>
			</div>
			<Stats ref="stats" employee_view={employee_view} interval={interval} data={data}/>
		</React.Fragment>;
	}

}

//</editor-fold>

export default DashboardAssets;
