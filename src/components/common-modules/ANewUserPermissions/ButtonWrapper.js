// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';
import {Button} from '../../inputs';
import {CircularProgress} from "@mui/material";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ButtonWrapper">
@observer
class ButtonWrapper extends React.Component {

	@observable state = {
		processing: false,
		groupChecked: false,
	};

	constructor(props) {
		super(props);

		this.selectAll = this.selectAll.bind(this);
		this.unselectAll = this.unselectAll.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	selectAll() {
		this.state.groupChecked = true;
	}

	unselectAll() {
		this.state.groupChecked = false;
	}

	onChange(e, btn) {
		let {group, action, onChange, disableOneChange} = this.props;
		if(group) {
			if(disableOneChange) {
				this.state.groupChecked = !this.state.groupChecked;
				onChange(action, this.state.groupChecked);
			} else {
				// this.processing = true;
				// setTimeout(() => {
				// 	extendObservable(actions, {[action]: newVal});
				// 	onChange({
				// 		item: toJS(item),
				// 		action,
				// 		oldVal,
				// 		newVal,
				// 		onComplete: savedItem => {
				// 			// console.log('res', savedItem)
				// 			this.state.groupChecked = !this.state.groupChecked;
				// 			this.processing = false;
				// 		},
				// 	});
				// });
			}
		} else {
			let {item, item: {actions}} = this.props;
			const oldVal = actions[action];
			const newVal = !oldVal;

			if (disableOneChange) {
				actions[action] = newVal;
				onChange();
			} else {
				this.processing = true;
				setTimeout(() => {
					extendObservable(actions, {[action]: newVal});
					onChange({
						item: toJS(item),
						action,
						oldVal,
						newVal,
						onComplete: savedItem => {
							// console.log('res', savedItem)
							if (savedItem && savedItem.data) {
								extendObservable(item, savedItem.data);
							}
							this.processing = false;
						},
					});
				});
			}
		}
	}

	set processing(val) {
		this.state.processing = val;
	}

	@computed
	get isChecked() {
		let {group, action} = this.props;
		if(group) {
			return this.state.groupChecked;
		} else {
			let {item: {actions}} = this.props;
			return actions[action];
		}
	}

	render() {
		let {group, readonly, action} = this.props;
		let key;
		if(group) {
			key = action;
		} else {
			const {item: {id}} = this.props;
			key = id || new Date().getTime();
		}
		if (this.state.processing) {
			return <Button key={key} readonly={true}
			               className="btn btn-primary hor-center flex-center padding-0 padding-t-3 w-40 h-30">
				<CircularProgress size={20} color="white"/>
			</Button>;
		}
		return <Button key={key} readonly={readonly} className={`btn btn-${group?'default':'primary'} hor-center w-40`} onClick={this.onChange}>
			{this.isChecked ? <i className="fa fa-check"/> : <i className="fa fa-times"/>}
		</Button>;
	}
}

// </editor-fold>

export default ButtonWrapper;