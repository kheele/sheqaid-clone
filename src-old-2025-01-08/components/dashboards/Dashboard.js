import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {execWhen} from 'utils/Utils';
import MKBox from "../MK/MKBox";
import TrainingPlanEmployeesButtons from "../Omni/TrainingPlanEmployeesButtons";
import IntervalButtons from "../Omni/IntervalButtons";
import Card from "@mui/material/Card";
import Stats from "./Stats";

//<editor-fold desc="Dashboard">
@observer
class Dashboard extends React.Component {
	key = 'Dashboard';

	//<editor-fold desc="state">
	@observable state = {
		view: 'active',
		interval: 'Month',
		range_start: '- All -',
		range_end: '- All -',
	};
	//</editor-fold>

	//<editor-fold desc="constructor">
	constructor(props) {
		super(props);

		this.onUpdate = this.onUpdate.bind(this);
	}

	//</editor-fold>

	// <editor-fold defaultstate="collapsed" desc="componentDidMount">
	componentDidMount() {
		const {view, interval, range_start, range_end} = this.state;
		this.onUpdate({view, interval, range_start, range_end});
	}

	// </editor-fold>

	//<editor-fold desc="onUpdate">
	onUpdate({view, interval, range_start, range_end}) {
		view && (this.state.view = view);
		interval && (this.state.interval = interval);
		range_start && (this.state.range_start = range_start);
		range_end && (this.state.range_end = range_end);

		execWhen(() => this.refs.viewButtonsRefBox).then(ref => {
			const {view, interval, range_start, range_end} = this.state;
			ref.update({view, interval, range_start, range_end});
			this.update();
		});
	}

	//</editor-fold>

	//<editor-fold desc="update">
	update() {
		const {view, interval, range_start, range_end} = this.state;
		execWhen(() => this.refs.stats).then(ref => {
			ref.update({view, interval, range_start, range_end});
		});
	}

	//</editor-fold>

	//<editor-fold desc="render">
	render() {
		const {
			noEmployees,
			listBy,
			path,
			GridCounter,
			GridDoughnutChart,
			GridCounterSide,
			GridReportsLineChart,
			GridFrequencyVerticalBarChart,
		} = this.props;

		return <div id="Dashboard" className="Dashboard">
			<div className="page-content grid-1 grid-gap-10 nice-scrollbars">
				<Card sx={{
					background: "#fff",
					mt: '10px',
					p: '20px',
					position: 'absolute',
					bottom: '10px',
					left: 0,
					right: 0,
					top: 0,
					overflowX: 'hidden',
					overflowY: 'auto',
				}}>
					<ViewByButtonsBox
						ref="viewButtonsRefBox"
						noEmployees={noEmployees}
						onUpdate={this.onUpdate}
					/>
					<Stats
						ref="stats"
						listBy={listBy}
						path={path}
						GridCounter={GridCounter}
						GridDoughnutChart={GridDoughnutChart}
						GridCounterSide={GridCounterSide}
						GridReportsLineChart={GridReportsLineChart}
						GridFrequencyVerticalBarChart={GridFrequencyVerticalBarChart}
					/>
				</Card>
			</div>
		</div>;
	}

	//</editor-fold>

}

//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewByButtonsBox">
@observer
class ViewByButtonsBox extends React.Component {

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props) {
		super(props);

		this.setView = this.setView.bind(this);
		this.setInterval = this.setInterval.bind(this);
		this.setRangeStart = this.setRangeStart.bind(this);
		this.setRangeEnd = this.setRangeEnd.bind(this);
		this.update = this.update.bind(this);
	}

	// </editor-fold>

	setView(view) {
		const {onUpdate} = this.props;
		onUpdate({view});
	}

	setInterval(interval) {
		const {onUpdate} = this.props;
		onUpdate({interval});
	}

	setRangeStart(range_start) {
		const {onUpdate} = this.props;
		onUpdate({range_start});
	}

	setRangeEnd(range_end) {
		const {onUpdate} = this.props;
		onUpdate({range_end});
	}

	update({view, interval, range_start, range_end}) {
		if (view) {
			const {noEmployees} = this.props;
			if(!noEmployees) {
				execWhen(() => this.viewButtonsRef).then(ref => {
					ref.setView(view);
				});
			}
		}
		if (interval) {
			execWhen(() => this.refs.intervalButtons).then(ref => {
				ref.setInterval(interval);
			});
		}
		if (range_start) {
			execWhen(() => this.refs.intervalButtons).then(ref => {
				ref.setRangeStart(range_start);
			});
		}
		if (range_end) {
			execWhen(() => this.refs.intervalButtons).then(ref => {
				ref.setRangeEnd(range_end);
			});
		}
	}

	render() {
		const {noEmployees} = this.props;
		return (
			<MKBox width="100%" display="flex" alignItems="flex-start" justifyContent="center" mb="15px" pb="70px"
			       sx={{
				       minHeight: '130px !important',
				       border: "1px dotted #ddd !important",
				       background: "#fafafa !important",
				       paddingTop: "20px !important",
				       borderRadius: "8px !important",
				       boxShadow: "0 0 3px #ccc !important",
			       }}
			>
				{!noEmployees && <TrainingPlanEmployeesButtons ref={ref => {
					this.viewButtonsRef = ref;
				}} onChange={this.setView}/>}
				<IntervalButtons
					ref="intervalButtons"
					onChange={this.setInterval}
					setMonthRangeStart={this.setRangeStart}
					setMonthRangeEnd={this.setRangeEnd}
					setQuarterRangeStart={this.setRangeStart}
					setQuarterRangeEnd={this.setRangeEnd}
					setBiannualRangeStart={this.setRangeStart}
					setBiannualRangeEnd={this.setRangeEnd}
					setAnnualRangeStart={this.setRangeStart}
					setAnnualRangeEnd={this.setRangeEnd}
				/>
			</MKBox>
		);
	}
}

// </editor-fold>

export default Dashboard;
