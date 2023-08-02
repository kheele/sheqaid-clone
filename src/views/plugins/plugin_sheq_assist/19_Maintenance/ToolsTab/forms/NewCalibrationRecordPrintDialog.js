import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./NewCalibrationRecordPrintDialog.lazy.css";
import {Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

@observer
class NewCalibrationRecordPrintDialog extends ANewDialog {
	path = "plugin_sheq_assist/emergency-management/emergency-numbers/";
	pageKey = "NewCalibrationRecordPrintDialog";
	title = "Print Calibration Record Form";
	className = 'ANewTableFormDialog ANewPrintForm';
	
	constructor(props) {
        super(props);
    }
	
	componentWillMount() {
		style.use();
	}
	
	componentWillUnmount(){
		style.unuse();
	}
	
	get controls() {return Controls;}
}

@observer
class Controls extends React.Component {

	@observable state = {
		list: []
	};
	
    constructor() {
        super();
		
		for(var n = 1; n <= 32; n++) {
			this.state.list.push(n);
		}
		
		this.onLoadList = this.onLoadList.bind(this);
		this.renderItem = this.renderItem.bind(this);
    }
	
	onLoadList() {
		return Promise.resolve(this.state.list);
	}
	
	renderItem(n, onClick) {
		return <TRow key={"item-" + n} className="tr-readonly">
			<div className="td"></div>
			<div className="td"></div>
			<div className="td"></div>
			<div className="td"></div>
			<div className="td"></div>
			<div className="td"></div>
			<div className="td fixed-flex min-w-160"></div>
			<div className="td fixed-flex min-w-160"></div>
		</TRow>;
    }
	
	render() {
		return (<div className="controls-wrapper">
			<div className="controls">
					<Table>
						<THead>
							<div className="td">Equipment Name</div>
							<div className="td">Equipment/Reg. No.</div>
							<div className="td">Maintanace Type</div>
							<div className="td">Reference Standard</div>
							<div className="td">Certificate No.</div>
							<div className="td">Company Calibrating</div>
							<div className="td fixed-flex min-w-160">Calibration Date</div>
							<div className="td fixed-flex min-w-160">Next Calibration Date</div>
						</THead>
						<TBody ref="body" title="Equipment Calibration Record" renderItem={this.renderItem} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
					</Table>
			</div>
		</div>);
	}
}

export default NewCalibrationRecordPrintDialog;
