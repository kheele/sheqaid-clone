// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, isObservableObject, observable} from 'mobx';
import {Checkbox, FormControlLabel, Grid, Icon, Radio, RadioGroup} from '@material-ui/core';

import * as Utils from 'utils/Utils';
import MKBox from "components/MK/MKBox";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RadioItemImpl, RadioGroupImpl">
@observer
class RadioItemImpl extends React.Component {

	@observable state = {
		checked: false
	};

	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		const {item, idx} = this.props;
		this.state.checked = item.checked;
	}

	onChange() {
		const {item, idx, onChange} = this.props;
		this.state.checked = item.checked = !item.checked;
		onChange(item);
	}

	render() {
		const {item, idx} = this.props;
		return <FormControlLabel
			key={idx + '-' + new Date().getTime()}
			value={item.value}
			control={<Radio key={idx + '-Radio-' + new Date().getTime()}
			                idx={idx}
			                checked={this.state.checked}
			                onChange={this.onChange}/>}
			label={item.text || item.label}
		/>;
	}
}

@observer
class RadioGroupImpl extends React.Component {

	@observable _refresh = false;
	@observable state = {
		checkedItem: null
	};

	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.renderGroup = this.renderGroup.bind(this);
	}

	componentDidMount() {
		const {values} = this.props;
		const checkedItem = values.find((item) => item.checked);
		this.checkedItem = checkedItem;
	}

	refresh() {
		this._refresh = true;
		setTimeout(() => this._refresh = false);
	}

	onChange(item) {
		this.checkedItem = item;
	}

	renderItem(item, idx) {
		return <RadioItemImpl key={idx} item={item} idx={idx} onChange={this.onChange}/>;
	}

	set checkedItem(_item) {
		const {props: {values}} = this;
		if (values && _item) {
			const checkedItem = values.find((item, n) => item.value === _item.value);
			checkedItem && (this.state.checkedItem = checkedItem.value);
		}
	}

	renderGroup({group, list}, idx) {
		return <>
			<MKBox
				sx={{
					padding: '10px',
					width: 'calc(100% + 12px)',
					display: 'block',
					background: '#f3f3f3',
					float: 'left',
				}}
			>{group}</MKBox>
			{list.map(this.renderItem)}
		</>;
	}

	render() {
//        if(this._refresh) return null;
		const {state: {checkedItem}} = this;
		const {name, className, values, groupBy, inputProps = {}} = this.props;
//        console.log('RadioGroupImpl', checkedItem, inputProps)
		if (isFunction(groupBy)) {
			const groups = values.groupBy(groupBy);
			return <React.Fragment key={new Date().getTime()}>
				{Object.keys(groups).map(key => ({group: key, list: groups[key]})).map(this.renderGroup)}
			</React.Fragment>;
		}
		return <RadioGroup
			key={new Date().getTime()}
			aria-label={name}
			name={name}
			className={className}
			{...inputProps}
			defaultValue={checkedItem}
		>
			{values.map(this.renderItem)}
		</RadioGroup>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="CheckboxItemImpl, CheckboxGroupImpl">
@observer
class CheckboxItemImpl extends React.Component {

	render() {
		const {item, idx, name, className, inputProps = {}} = this.props;
//        console.log('CheckboxItemImpl', item)        
		return <FormControlLabel
			key={idx}
			className={className}
			control={<Checkbox
				idx={idx}
				defaultChecked={item.checked}
				name={name + "-" + idx}
				value={item.value}
				{...inputProps}
			/>}
			label={item.text || item.label}
		/>;
	}
}

@observer
class CheckboxGroupImpl extends React.Component {

	@observable _refresh = false;

	constructor(props) {
		super(props);

		this.renderItem = this.renderItem.bind(this);
		this.renderGroup = this.renderGroup.bind(this);
	}

	refresh() {
		this._refresh = true;
		setTimeout(() => this._refresh = false);
	}

	renderItem(item, idx) {
		const {name, className, inputProps} = this.props;
		return <CheckboxItemImpl key={idx} item={item} idx={idx} name={name} className={className}
		                         inputProps={inputProps}/>;
	}

	renderGroup({group, list}, idx) {
		return <>
			<MKBox
				sx={{
					padding: '10px',
					width: 'calc(100% + 12px)',
					display: 'block',
					background: '#f3f3f3',
					float: 'left',
				}}
			>{group}</MKBox>
			{list.map(this.renderItem)}
		</>;
	}

	render() {
//        if(this._refresh) return null;
		const {values, groupBy} = this.props;
		if (isFunction(groupBy)) {
			const groups = values.groupBy(groupBy);
			return <React.Fragment key={new Date().getTime()}>
				{Object.keys(groups).map(key => ({group: key, list: groups[key]})).map(this.renderGroup)}
			</React.Fragment>;
		}
		return <React.Fragment key={new Date().getTime()}>
			{values.map(this.renderItem)}
		</React.Fragment>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="InputIcon">
@observer
class InputIcon extends React.Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
	}

	onClick(evt) {
		const {type, onClick} = this.props;
		if (type === "time") return;

		onClick && onClick(evt);
	}

	render() {
		const {type, isSelectable} = this.props;
		let icon;
		if (type === 'date') {
			icon = 'fa-calendar';
		} else if (type === 'time') {
			icon = 'fa-clock';
		} else if (type === 'signature' || isSelectable()) {
			icon = 'fa-chevron-down';
		}
		return <Icon className={"fa " + icon} style={{fontSize: 18}} onClick={this.onClick}/>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ClearIcon">
@observer
class ClearIcon extends React.Component {
	render() {
		const {state: {isClearable, isEditable}, hasValue, onClick} = this.props;
		if (!(hasValue && isClearable && isEditable)) return null;
		return <Icon className="fa fa-close" style={{fontSize: 18}} onClick={onClick}/>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RenderSelectable">
@observer
class RenderSelectable extends React.Component {

	get isSelectable() {
		const {type} = this.props;
		return type === 'select' || this.isSelectMultiple;
	}

	get isSelectMultiple() {
		const {type} = this.props;
		return type === 'select_multi' || type === 'select_multiple';
	}

	@computed
	get hasValue() {
		const {type, state, state: {value}} = this.props;
		if (isString(value) || isArray(value) || isObservableArray(value)) {
			return value.length > 0;
		}

		return !!value;
	}

	@computed
	get selectView() {
		const {name, type, state, state: {value}, getSignaturePicker, renderer} = this.props;
		try {
			// if (renderer && isFunction(renderer)) {
			//     return <div className="multi-value">
			//         <Grid container spacing={1} columns={4}>
			//             {renderer(value)}
			//         </Grid>
			//     </div>;
			// }

			if (type === 'date') {
				return Utils.Dates.formatDate(value);
			} else if (type === 'signature') {
				const ref = getSignaturePicker();
				if (!ref) return null;
				return <img src={ref.toDataURL('img/png')}/>;
			} else if (this.isSelectMultiple) {
				//return <div className="multi-value">{value.map(v => <span>{v.label}</span>)}</div>;
			} else if (this.isSelectable) {
//                console.log(type, value)
				if (isObject(value) || isObservableObject(value)) {
					const {label, value: val} = value;
					if (renderer && isFunction(renderer)) {
						return renderer(value);
					} else {
//                    console.log(name, type, label, val)
						if (label || isString(val)) {
//                        console.log(name, '-', label || val)
							if (React.isValidElement(label)) {
//                            alert(label)
								return <div className="multi-value">{label}</div>;
							} else {
								return <div className="multi-value">{label || val}</div>;
							}
						} else if (label === undefined) {
							if (val === undefined) {
								return null;
							} else if (isString(val)) {
								return <div className="multi-value">{val}</div>;
							} else if (isObject(val) || isObservableObject(val)) {
								//TODO: Fix this. Needs renderer
								if (renderer && isFunction(renderer)) {
									return renderer(value);
								} else {
									return null;
								}
							}
						}
					}
				}
				return <div className="multi-value">{value}</div>;
			}
		} catch (err) {
			console.error(err)
		}
		return null;
	}

	render() {
		const {type, placeholder, state, onClickSelectInput} = this.props;
		const props = {
			className: "text-input--material__selectable",
			onClick: onClickSelectInput
		};
		if (!this.isSelectable) {
			props.ref = "selectBox";
		}

		if (type === 'time') {
			return <div {...props}>
                <span className="text-input__label text-input--material__label text-input--material__label--active">
                    {placeholder}
                </span>
			</div>;
		}
		return ((type === 'date' || type === 'signature' || this.isSelectable) &&
			<div {...props}>
				{this.hasValue ? <React.Fragment>
					{this.selectView}
					<span className="text-input__label text-input--material__label text-input--material__label--active">
                    {placeholder}
                </span>
				</React.Fragment> : <span className="text-input__label text-input--material__label">
                {state.isSelectableSearching.isEmpty() ? placeholder : state.isSelectableSearching}
            </span>}
			</div>);
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="InputDesc">
@observer
class InputDesc extends React.Component {

	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick(e, btn) {
		const {desc} = this.props;
		let elem = window.$(e.target);
		const offset = elem.offset();
		const style = {
			left: "auto",
			right: Utils.calculateRightPos(elem[0], false) + 10,
			top: offset.top,
			width: "auto",
			maxWidth: 400
		};
		popover.settings({
			style, contentNode: <div>{desc}</div>
		}).open();
	}

	render() {

		return <div className="input-desc">
			<i className="fa fa-info input-desc" onClick={this.onClick}/>
		</div>;
	}
}

// </editor-fold>

export {RadioGroupImpl, CheckboxGroupImpl, InputIcon, ClearIcon, RenderSelectable, InputDesc};
