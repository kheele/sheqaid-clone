// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import 'react-alice-carousel/lib/alice-carousel.css';
import MKBox from "components/MK/MKBox";
import {ButtonGroup, CircularProgress,} from "@mui/material";
import {Button} from "components/inputs";
import AliceCarousel from "react-alice-carousel";
import {computed, observable} from "mobx";
// </editor-fold>

//<editor-fold desc="HasWarnings">
@observer
class HasWarnings extends React.Component {
	render() {
		const {item, view, idx, onClick} = this.props;

		let hasWarnings = false;

		if (view === 'Employee') {
			// const {
			//     group: {data: {fname, lname, optional_details = {}}},
			//     list,
			//     cost,
			//     attendanceRate,
			//     results,
			//     status,
			//     courseList,
			//     yearList
			// } = item;
			const {
				id,
				data: {
					lname,
					fname,
					profile_pic,
					job_position,
					course_list_count,
					training_cost,
					year_list,
					completion_status_not_started_list_count: {aggregate: {count: status_not_started}},
					completion_status_outstanding_list_count: {aggregate: {count: status_outstanding}},
					completion_status_in_progress_list_count: {aggregate: {count: status_in_progress}},
					completion_status_completed_list_count: {aggregate: {count: status_completed}},
					// results_passed_list_count: {aggregate: {count: results_passed}},
					// results_failed_list_count: {aggregate: {count: results_failed}},
					results_status_passed_list_count: {aggregate: {count: results_passed}},
					results_status_failed_list_count: {aggregate: {count: results_failed}},
					results_average_list_count: {aggregate: {avg: {result: results_average}}},
				}
			} = item;
			hasWarnings = !(status_not_started && status_outstanding && status_in_progress && status_completed) ||
				!(results_passed && results_failed) ||
				// !training_cost.aggregate.sum.cost ||
				!job_position;
		} else if (view === 'Job Position') {
			const {group, list, cost, attendanceRate, results, status, employeeList, courseList, yearList} = item;
			hasWarnings = !status || !results || !cost || employeeList.isEmpty();
		} else if (view === 'Course') {
			// const {group, list, cost, attendanceRate, results, status, employeeList, jobPositionList, yearList} = item;
			const {
				id,
				data: {
					name,
					job_position_list_count,
					training_cost,
					employee_list_count,
					year_list,
					completion_status_not_started_list_count: {aggregate: {count: status_not_started}},
					completion_status_outstanding_list_count: {aggregate: {count: status_outstanding}},
					completion_status_in_progress_list_count: {aggregate: {count: status_in_progress}},
					completion_status_completed_list_count: {aggregate: {count: status_completed}},
					// results_passed_list_count: {aggregate: {count: results_passed}},
					// results_failed_list_count: {aggregate: {count: results_failed}},
					results_status_passed_list_count: {aggregate: {count: results_passed}},
					results_status_failed_list_count: {aggregate: {count: results_failed}},
					results_average_list_count: {aggregate: {avg: {result: results_average}}},
				}
			} = item;
			hasWarnings = !(status_not_started && status_outstanding && status_in_progress && status_completed) ||
				!(results_passed && results_failed) ||
				!training_cost.aggregate.sum.cost ||
				!job_position_list_count.aggregate.count ||
				!employee_list_count.aggregate.count;
		} else if (view === 'Year') {
			const {
				group,
				list,
				cost,
				attendanceRate,
				results,
				status,
				employeeList,
				jobPositionList,
				courseList
			} = item;
			hasWarnings = !status || !results || !cost || jobPositionList.isEmpty() || employeeList.isEmpty();
		}

		if (!hasWarnings) return null;

		return <i className="fa fa-warning" idx={idx} onClick={onClick}/>;
	}
}

//</editor-fold>

//<editor-fold desc="CostBtn">
@observer
class CostBtn extends React.Component {

	@observable state = {
		value: null,
	};

	async componentDidMount() {
		let {cost} = this.props;
		if (cost instanceof Promise) {
			cost = await cost;
		}
		if (cost) {
			if (isString(cost)) {
				cost = cost.replace('$', 'R');
			} else if (isNumber(cost)) {
				cost = cost.toCurrency("R");
			} else {
				cost = "N/A";
			}
		} else {
			cost = "N/A";
		}

		this.state.value = cost;
	}

	@computed get value() {
		return this.state.value;
	}

	render() {
		const {value} = this;
		return <Button
			style={{
				fontWeight: "600",
				color: "rgba(255, 255, 255, 0.8) !important",
				border: "4px solid #9ccb27 !important",
				cursor: "default",
				background: "#7ba931",
				padding: "4px",
			}}
			className="btn btn-primary pull-right no-text-shadow no-border min-w-100 padding-h-10 h-35 font-size-14"
		>
			{value || <CircularProgress size="1em"/>}
		</Button>;
	}
}

//</editor-fold>

//<editor-fold desc="YearDot">
@observer
class YearDot extends React.Component {
	render() {
		const {year, onViewTarget} = this.props;
		let bg, currY = new Date().getFullYear();
		if (year === currY) {
			bg = 'green';
		} else if (year < currY) {
			bg = 'aaa';
		} else {
			bg = 'orange';
		}

		return <Button
			id={year}
			item={year}
			target="year"
			text={year}
			onClick={onViewTarget}
			className={`padding-0 font-size-11 min-w-35 w-35 h-35 no-text-shadow no-border circled color-white bg-${bg}`}
		/>;
	}
}

//</editor-fold>

//<editor-fold desc="YearsTD">
@observer
class YearsTD extends React.Component {
	render() {
		const {value, onViewTarget} = this.props;

		if(!value || value.isEmpty()) return <div className="td fixed-flex min-w-250">N/A</div>;

		const responsive = {
			0: {items: 3},
		};

		const items = value.map(({year}) => <YearDot year={year} onViewTarget={onViewTarget}/>);

		return <div className="td fixed-flex min-w-250">
			<AliceCarousel
				mouseTracking
				items={items}
				responsive={responsive}
				controlsStrategy="alternate"
			/>
		</div>;
	}
}

//</editor-fold>

//<editor-fold desc="StatusTD">
@observer
class StatusTD extends React.Component {
	render() {
		const {item, isViewJobPosition, isViewYear} = this.props;
		let status_not_started, status_outstanding, status_in_progress, status_completed;
		if (isViewJobPosition || isViewYear) {
			const {
				status_not_started: _status_not_started,
				status_outstanding: _status_outstanding,
				status_in_progress: _status_in_progress,
				status_completed: _status_completed,
			} = item;
			status_not_started = _status_not_started;
			status_outstanding = _status_outstanding;
			status_in_progress = _status_in_progress;
			status_completed = _status_completed;
		} else {
			const {
				completion_status_not_started_list_count: {aggregate: {count: _status_not_started}},
				completion_status_outstanding_list_count: {aggregate: {count: _status_outstanding}},
				completion_status_in_progress_list_count: {aggregate: {count: _status_in_progress}},
				completion_status_completed_list_count: {aggregate: {count: _status_completed}},
			} = item.data;
			status_not_started = _status_not_started;
			status_outstanding = _status_outstanding;
			status_in_progress = _status_in_progress;
			status_completed = _status_completed;
		}

		const sxValue = {
			background: "#fff",
			padding: '2px',
			minWidth: '20px',
			height: '20px',
			width: '28px',
			margin: '3px auto 0',
			fontSize: '13px',
			borderRadius: '50%',
		};

		return <div className="td fixed-flex min-w-320">
			<ButtonGroup variant="contained" color="white" className="no-shadow" ariaLabel="elevation buttons"
			             sx={{height: '52px', overflow: "hidden", borderRadius: "8px"}}>
				<Button className="padding-10 font-size-11 no-text-shadow bg-grey no-border grid-1">
					<MKBox sx={{color: '#fff'}}>Not Started</MKBox>
					<MKBox
						sx={{color: 'grey', ...sxValue}}>{status_not_started ? (status_not_started + (status_not_started > 99 ? '+' : '')) : '0'}</MKBox>
				</Button>
				<Button className="padding-10 font-size-11 no-text-shadow bg-red no-border grid-1">
					<MKBox sx={{color: '#fff'}}>Outstanding</MKBox>
					<MKBox
						sx={{color: 'red', ...sxValue}}>{status_outstanding ? (status_outstanding + (status_outstanding > 99 ? '+' : '')) : '0'}</MKBox>
				</Button>
				<Button className="padding-10 font-size-11 no-text-shadow bg-orange no-border grid-1">
					<MKBox sx={{color: '#fff'}}>In Progress</MKBox>
					<MKBox
						sx={{color: 'orange', ...sxValue}}>{status_in_progress ? (status_in_progress + (status_in_progress > 99 ? '+' : '')) : '0'}</MKBox>
				</Button>
				<Button className="padding-10 font-size-11 no-text-shadow bg-green no-border grid-1">
					<MKBox sx={{color: '#fff'}}>Completed</MKBox>
					<MKBox
						sx={{color: 'green', ...sxValue}}>{status_completed ? (status_completed + (status_completed > 99 ? '+' : '')) : '0'}</MKBox>
				</Button>
			</ButtonGroup>
		</div>;
	}
}

//</editor-fold>

//<editor-fold desc="ResultsTD">
@observer
class ResultsTD extends React.Component {
	render() {
		const {item, isViewJobPosition, isViewYear} = this.props;
		let results_passed, results_failed, results_average;
		if (isViewJobPosition || isViewYear) {
			const {
				results_passed: _results_passed,
				results_failed: _results_failed,
				results_average: _results_average,
			} = item;
			results_passed = _results_passed;
			results_failed = _results_failed;
			results_average = _results_average;
		} else {
			const {
				// results_passed_list_count: {aggregate: {count: _results_passed}},
				// results_failed_list_count: {aggregate: {count: _results_failed}},
				results_status_passed_list_count: {aggregate: {count: _results_passed}},
				results_status_failed_list_count: {aggregate: {count: _results_failed}},
				results_average_list_count: {aggregate: {avg: {result: _results_average}}},
			} = item.data;
			results_passed = _results_passed;
			results_failed = _results_failed;
			results_average = _results_average;
		}

		const sxValue = {
			background: "#fff",
			padding: '2px',
			minWidth: '20px',
			height: '20px',
			width: '28px',
			margin: '3px auto 0',
			fontSize: '13px',
			borderRadius: '50%',
		};

		return <div className="td fixed-flex min-w-220">
			<ButtonGroup variant="contained" color="white" className="no-shadow" ariaLabel="elevation buttons"
			             sx={{height: '52px'}}>
				<Button className="padding-10 font-size-11 no-text-shadow bg-red no-border grid-1" style={{
					borderRadius: "8px 0 0 8px"
				}}>
					<MKBox sx={{color: '#fff'}}>Failed</MKBox>
					<MKBox
						sx={{color: 'red', ...sxValue}}>{results_failed ? (results_failed + (results_failed > 99 ? '+' : '')) : 'N/A'}</MKBox>
				</Button>
				<Button className="padding-10 font-size-11 no-text-shadow bg-green no-border grid-1" style={{
					borderRadius: "0 8px 8px 0"
				}}>
					<MKBox sx={{color: '#fff'}}>Passed</MKBox>
					<MKBox
						sx={{color: 'green', ...sxValue}}>{results_passed ? (results_passed + (results_passed > 99 ? '+' : '')) : 'N/A'}</MKBox>
				</Button>
				<Button
					className={`padding-10 margin-l-10 font-size-11 no-text-shadow bg-${!isNumber(results_average) ? "grey" : results_average >= 50 ? "green" : "red"} no-border grid-1`}
					style={{
						borderRadius: "8px"
					}}>
					<MKBox sx={{color: '#fff'}}>Average</MKBox>
					<MKBox sx={{color: 'grey', ...sxValue}}>{results_average || 'N/A'}</MKBox>
				</Button>
			</ButtonGroup>
		</div>;
	}
}

//</editor-fold>

export {HasWarnings, CostBtn, YearsTD, StatusTD, ResultsTD};
