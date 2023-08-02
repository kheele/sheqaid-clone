import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import style from "./NewMaintanancePlanPrintDialog.lazy.css";

import {Dates} from 'utils/Utils';
import {Table, TBody, THead, TRow} from 'components/tables';
import ANewDialog from 'components/dialogs/ANewDialog';

@observer
class NewMaintanancePlanPrintDialog extends ANewDialog {
	path = "plugin_sheq_assist/emergency-management/emergency-numbers/";
	pageKey = "NewMaintanancePlanPrintDialog";
	title = "Print Maintanance Plan Form";
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
			<div className="td fixed-flex min-w-500 flex td-maintenance_term no-padding no-border">
				{Array.from(Dates.monthsStr.values()).map((val, n) => <div className="td"></div>)}
			</div>
		</TRow>;
    }
	
	render() {
		return (<div className="controls-wrapper">
			<div className="controls">
					<Table>
						<THead>
							<div className="td">Equipment Type</div>
							<div className="td">Equipment Name</div>
							<div className="td">Equipment/Reg. No.</div>
							<div className="td">Maintenance Type</div>
							<div className="td fixed-flex min-w-500 td-maintenance_term no-padding">
								<div className="tr text-center">
									Maintenance Term
								</div>
								<div className="tr flex">
									{Array.from(Dates.monthsStr.values()).map((val, n) => <div className="td">{val}</div>)}
								</div>
							</div>
						</THead>
						<TBody ref="body" title="Equipment Maintanance Plan" renderItem={this.renderItem} state={this.state} onLoadList={this.onLoadList} disablePullToRefresh={true}/>
					</Table>
			</div>
		</div>);
	}
}

export default NewMaintanancePlanPrintDialog;
