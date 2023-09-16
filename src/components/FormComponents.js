// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {autorun, computed, isObservableArray, observable} from 'mobx';
import {CanvasJSChart} from '../components/stats/canvasjs.react';

import {Dates, execWhen, setDefaultVal} from '../utils/Utils';

import {ErrorBoundary} from '../components';
import {Button, Clickable, ProfileField, ProfilePic} from './inputs';

import styleRiskRating from "./RiskRating.lazy.css";
import Form from "../utils/Form";
import MKBox from "./MK/MKBox";
import style from "./dialogs/TimeActiveSessionExpiredDialog.lazy.css";
import {AProfileDialog} from "./dialogs";
import {loadFaceModels} from "./dialogs/FaceComponents";
// </editor-fold>

//<editor-fold desc="AControls">
@observer
class AControls extends React.Component {

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor(props, style) {
		super(props);

		this.style = style;

		this.onNext && (this.onNext = this.onNext.bind(this));

		this.form = new Form();
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="mounts">
	componentDidMount() {
		const {title, props: {dialog, dialog: {execWhen}}} = this;
		const setDefaultValue = setDefaultVal.bind(this);

		if (title) {
			dialog.setTitle(title);
		}

		if (this.item) {
			execWhen(() => this._reactInternals).then(_reactInternals => {
				return execWhen(() => {
					try {
						const {inputRefs} = _reactInternals.child.stateNode;
						return inputRefs;
					} catch (e) {

					}
				});
			}).then(children => {
				children.forEach(child => {
					setDefaultValue(child.ref);
				});
			});
		}
	}

	// </editor-fold>

	// <editor-fold defaultstate="collapsed" desc="onSubmit">
	onSubmit(e, btn, onSaved) {
		const {form} = this;

		const {formData} = form;

		const data = {...formData};

		console.log(data)

		return data;
	}

	// </editor-fold>

	get item() {
		return this.props.state.item;
	}

}

//</editor-fold>

// <editor-fold defaultstate="collapsed" desc="FormControls">
@observer
class FormControls extends React.Component {

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.getFormChildren = this.getFormChildren.bind(this);
	}

	// </editor-fold>

	getFormChildren() {
		return Object.values(this.refs);
	}

	@computed get inputRefs() {
		let {children} = this;

		return children.filter(child => child && child.type && child.type.name === 'Row').map(child => child.inputRefs).reduce((a1, a2) => [...(a1 || []), ...(a2 || [])], []);
	}

	@computed get children() {
		const {onChange, onCountFields, lazyLoad, idx, children, form} = this.props;
		return React.Children.map(children, (child, index) => {
			if (!child) return null;
			return React.cloneElement(child, {
				ref: 'ref_row_' + index,
				onChange,
				form,
				lazyLoad,
				onCountFields,
				getFormChildren: this.getFormChildren
			});
		}).filter(child => !!child);
	}

	render() {
		const {children} = this;
		let {className = ""} = this.props;
		className += " controls";
		return <div className="controls-wrapper controls-sectioned">
			<div className={className}>
				{children}
			</div>
		</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Row">
@observer
class Row extends React.Component {
	key = 'Row';

	@observable
	state = {rendered: false};

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.onRendered = this.onRendered.bind(this);
	}

	// </editor-fold>

	show() {
		execWhen(() => this.refs.rowSecGroup).then(ref => ref.show());
	}

	hide() {
		execWhen(() => this.refs.rowSecGroup).then(ref => ref.hide());
	}

	componentWillMount() {
		const {lazyLoad, active, rendered} = this.props;
		if (lazyLoad) {
			this.state.rendered = active;
		} else {
			this.state.rendered = !!rendered;
		}
	}

	onNavigate(evt, btn) {
		let {idx, active, activeAlways, onFormBack, onFormNext, onFormSave} = this.props;
		if (onFormBack && (onFormNext || onFormSave)) {

		} else if (onFormBack) {
			onFormBack(evt, btn);
		} else if (onFormNext) {
			onFormNext(evt, btn);
		} else if (onFormSave) {
			onFormSave(evt, btn);
		}
	}

	onRendered(children) {
		const {rowTitle} = this.refs;
		if (rowTitle) {
//            console.log('RowTitle onRendered', this)
			rowTitle.updateCount(children);
		}
	}

	@computed get inputRefs() {
		let {rowSecGroup} = this.refs;
		if (!rowSecGroup) return;
		return rowSecGroup.inputRefs;
	}

	@computed get children() {
		const {onChange, children} = this.props;
		if (!children) return null;
		if (!onChange || !isFunction(onChange)) return React.Children.map(children, (child, index) => child);
		return React.Children.map(children, (child, index) => {
			if (!child) return null;
			return React.cloneElement(child, {onChange});
		}).filter(child => !!child);
	}

	render() {
		let {
			props: {
				idx,
				title,
				active,
				activeAlways,
				countFields,
				onCountFields,
				className,
				sectionClassName,
				nextText,
				backText,
				saveText,
				onFormOpen,
				onFormBack,
				onFormNext,
				onFormSave,
				lazyLoad,
				form,
				getFormChildren,
			},
			children
		} = this;
		className = (className ? (className + " ") : "") + ("row" + (active ? " active" : "") + (activeAlways ? " active-always" : ""));

		let sx = {};
		if (onFormNext && onFormSave) {
			sx.gridTemplateColumns = "52px auto auto 220px !important";
		} else {
			sx.gridTemplateColumns = "52px auto auto 52px !important";
		}

		const actionProps = {
			idx,
			getFormChildren,
			lazyLoad,
		};

		return <MKBox id={`Row-${idx}`} dataIdx={idx} className={className} sx={sx}>
			<label>
				{countFields && <RowTitle ref="rowTitle" idx={idx} title={title} onCountFields={onCountFields}/>}
				{!countFields && title}
				<Clickable {...actionProps} onClick={onFormOpen}><i
					className="fa fa-angle-down margin-l-10 icon-right pull-right"/></Clickable>
				{onFormNext && <Clickable {...actionProps} onClick={onFormNext}>
					<i className="fa fa-angle-right margin-l-10 icon-right pull-right"/>
				</Clickable>}
				{onFormBack && <Clickable {...actionProps} onClick={onFormBack}>
					<i className="fa fa-angle-left margin-l-10 icon-right pull-right"/>
				</Clickable>}
			</label>
			<RowSecGroup
				ref='rowSecGroup'
				rendered={this.state.rendered}
				lazyLoad={lazyLoad}
				{...actionProps}
				form={form}
				onRendered={this.onRendered}
				className={sectionClassName}
			>
				{children}
			</RowSecGroup>
			<NavButtons {...actionProps} onBack={onFormBack} onNext={onFormNext} onSave={onFormSave}
			            backText={backText}
			            nextText={nextText} saveText={saveText}/>
		</MKBox>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RowTitle, RowTitleCount">
@observer
class RowTitle extends React.Component {

	@observable state = {
		count: null,
		max: null
	};

	updateCount(children) {
		if (!children) return;

		const {idx, onCountFields} = this.props;

		if (!children.filter) {
			children = React.Children.map(children, (child, index) => child);
		}
		children = children.filter(v => v.ref).map(child => {
			const ref = child._owner.stateNode.refs[child.ref];
			if (ref && ref.refs && ref.refs.input) {
				return ref.refs.input;
			}
			return ref;
		}).filter(v => !!v);

		this.state.count = 0;
		this.state.max = children.length;

		autorun(() => {
			this.state.count = children.filter(child => {
//                console.log('RowTitle child hasValue', isGetter(child, 'hasValue'))
				return child.hasValue;
			}).length;

			onCountFields && onCountFields(this.state, idx);
		});
	}

	render() {
		const {props: {title}, state} = this;
		return <React.Fragment>
			{title} <RowTitleCount state={state}/>
		</React.Fragment>;
	}
}

@observer
class RowTitleCount extends React.Component {
	render() {
		const {props: {state: {count, max}}} = this;
		return <span className="counter">{isNumber(count) ? count : '--'}/{isNumber(max) ? max : '--'}</span>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RowSecGroup">
@observer
class RowSecGroup extends React.Component {

	@observable
	state = {rendered: false};

	// <editor-fold defaultstate="collapsed" desc="constructor">
	constructor() {
		super();

		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
	}

	// </editor-fold>

	show() {
		this.state.rendered = true;
	}

	hide() {
		this.state.rendered = false;
	}

	componentWillMount() {
		this.state.rendered = !!this.props.rendered;
	}

	componentDidMount() {
		const {onRendered, children} = this.props;
		onRendered && onRendered(children);
	}

	@computed get inputRefs() {
		let {children} = this;
		if (!children) return;

		if (!children.filter) {
			children = React.Children.map(children, (child, index) => child);
		}
		children = children.filter(v => v.ref).map(child => {
			const ref = child._owner.stateNode.refs[child.ref];
			if (ref && ref.refs && ref.refs.input) {
				return ref.refs.input;
			}
			return ref;
		}).filter(v => !!v);
		return children;
	}

	// @computed get children() {
	// 	let {children} = this.props;
	// 	return children;
	// }

	get children() {
		const {form, lazyLoad, children} = this.props;
		if (!lazyLoad || !form) return children;

		return React.Children.map(children, (child, index) => {
			if (!child) return null;
			const {name} = child.props;
			if(!name) return child;

			const value = form.get(name);
			console.log(name, value)
			return React.cloneElement(child, {defaultValue: value});
		}).filter(child => !!child);
	}

	render() {
		let {children, props: {className}} = this;
		if (!this.state.rendered) return null;
		className = (className ? (className + " ") : "") + "row sec-group";
		return <div key={new Date().getTime()} className={className}>
			{children && <ErrorBoundary>
				{children}
			</ErrorBoundary>}
		</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Fragment">
@observer
class Fragment extends React.Component {

	@observable
	state = {rendered: false};

	show() {
		this.state.rendered = true;
	}

	hide() {
		this.state.rendered = false;
	}

	componentWillMount() {
		this.state.rendered = !!this.props.rendered;
	}

	render() {
		const {children} = this.props;
		if (!this.state.rendered) return null;
		return <React.Fragment>
			{children}
		</React.Fragment>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="NavButtons">
@observer
class NavButtons extends React.Component {

	render() {
		const {
			idx,
			getFormChildren,
			lazyLoad,
			onBack,
			onNext,
			onSave,
			backText = "Back",
			nextText = "Next",
			saveText = "Save & Continue"
		} = this.props;

		const actionProps = {
			idx,
			getFormChildren,
			lazyLoad,
		};

		const next = () => <Button
			{...actionProps}
			className="btn btn-primary padding-v-0 btn-next pull-right"
			text={nextText}
			onClick={onNext}
		/>;
		const save = () => <Button
			{...actionProps}
			className="btn btn-primary padding-v-0 btn-save pull-right"
			text={saveText}
			onClick={onSave}
		/>;
		return <>
			<hr/>
			{onBack && <Button
				{...actionProps}
				className="btn btn-primary btn-back pull-left"
				text={backText}
				onClick={onBack}
			/>}
			{(onNext && onSave) &&
				<MKBox sx={{display: "flex"}} className="next-and-save-buttons flex pull-right grid-gap-10">
					{next()}{save()}
				</MKBox>}
			{(!onNext && onSave) &&
				<MKBox sx={{display: "flex"}} className="next-and-save-buttons flex pull-right grid-gap-10">
					<MKBox className="pull-right" sx={{visibility: "hidden"}}/>{save()}
				</MKBox>}
			{(onNext && !onSave) && next()}
		</>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RiskRating">
@observer
class RiskRating extends React.Component {

	@observable
	state = {
		lists: {
			list: []
		}
	};

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		styleRiskRating.use();
	}

	componentWillUnmount() {
		styleRiskRating.unuse();
	}

	render() {
		let {hasFrequency, selected, consequence, likelihood, frequency, readonly, name, onChange} = this.props;
		if (!selected && (consequence && likelihood)) {
			selected = {consequence, likelihood};
		}
		return <div className="RiskRating">
			<div className="RiskRatingInfo flex margin-0">
				<div className="RiskRatingInfoLeft fixed-flex padding-0">
					<div className="flex">
						<div className="RiskRatingTitles fixed-flex min-w-90">Risk Index</div>
						<div className="RiskRatingTitles fixed-flex min-w-90">Category</div>
						<div className="RiskRatingTitles fixed-flex min-w-90">Action</div>
					</div>
					<div className="flex">
						<div className="fixed-flex min-w-90 RiskRatingExtreme">&gt;15</div>
						<div className="fixed-flex min-w-90 RiskRatingExtreme">Extreme</div>
						<div className="fixed-flex min-w-90">Immediate Action</div>
					</div>
					<div className="flex">
						<div className="fixed-flex min-w-90 RiskRatingHigh">9 - 15</div>
						<div className="fixed-flex min-w-90 RiskRatingHigh">High</div>
						<div className="fixed-flex min-w-90">Requires Action</div>
					</div>
					<div className="flex">
						<div className="fixed-flex min-w-90 RiskRatingModerate">5 - 8</div>
						<div className="fixed-flex min-w-90 RiskRatingModerate">Moderate</div>
						<div className="fixed-flex min-w-90">ALARP</div>
					</div>
					<div className="flex">
						<div className="fixed-flex min-w-90 RiskRatingLow">&lt;5</div>
						<div className="fixed-flex min-w-90 RiskRatingLow">Low</div>
						<div className="fixed-flex min-w-90">Maintain Risk</div>
					</div>
				</div>
				<div className="RiskRatingInfoRight padding-0">
					{!hasFrequency &&
						<div className="RiskRatingTitleFormula min-h-40">Formula = (Likelihood * Severity)</div>}
					{hasFrequency &&
						<div className="RiskRatingTitleFormula min-h-40">Formula = (Likelihood + Frequency) / 2 *
							Severity</div>}
					<div className="flex Freq margin-l-0">
						<div className="RiskRatingTitles fixed-flex min-w-50">Freq.</div>
						<div className="padding-0">Yearly/Low exposure/Not exceeding danger level (OEL)</div>
						<div className="padding-0">Few Times a year / negligable exposure level</div>
						<div className="padding-0">Monthly / short periods of time weekly / possible to exceed OEL</div>
						<div className="padding-0">Weekly / Continuous 2 - 4 hours per shift</div>
						<div className="padding-0">Daily / Continuous / Intermettently exceeding OEL</div>
					</div>
					<div className="flex Prob margin-l-0">
						<div className="RiskRatingTitles fixed-flex min-w-50">Prob.</div>
						<div className="padding-0">Rare/Practically Impossible / Very unlikely / has not happened
							before
						</div>
						<div className="padding-0">Unlikely / Not likely to happen / Unlikely in 20 years</div>
						<div className="padding-0">Possible to happen / Could happen within 10 years</div>
						<div className="padding-0">Likely to happen at some point</div>
						<div className="padding-0">Almost certain to happen / Two or more yearly</div>
					</div>
				</div>
			</div>
			<div className="RiskRatingTable">
				<div className="flex">
					<div className="RiskRatingTitles">Fin. Loss</div>
					<div className="RiskRatingTitles">Safety</div>
					<div className="RiskRatingTitles">Health</div>
					<div className="RiskRatingTitles">Enviro.</div>
					<div className="RiskRatingTitles fixed-flex min-w-70">Severity</div>
					<RiskRatingNum name={name} likelihood={1} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingNum name={name} likelihood={2} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingNum name={name} likelihood={3} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingNum name={name} likelihood={4} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingNum name={name} likelihood={5} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
				</div>
				<div className="flex">
					<div className="RiskRatingTypes">&gt;R2mil<br/>Disaster</div>
					<div className="RiskRatingTypes">Multiple Fatalities</div>
					<div className="RiskRatingTypes">Permanent/Disabity with potential multiple lethal effect</div>
					<div className="RiskRatingTypes">Disastrous/Irreversible Impact</div>
					<RiskRatingNum name={name} consequence={5} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={5} likelihood={1} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={5} likelihood={2} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={5} likelihood={3} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={5} likelihood={4} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={5} likelihood={5} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
				</div>
				<div className="flex">
					<div className="RiskRatingTypes">&gt;R1.5-3mil<br/>Severe</div>
					<div className="RiskRatingTypes">Single Fatality/Permanent Disability</div>
					<div className="RiskRatingTypes">Permanent Disabity with lethal effect</div>
					<div className="RiskRatingTypes">Severe Impact/Long term damage</div>
					<RiskRatingNum name={name} consequence={4} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={4} likelihood={1} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={4} likelihood={2} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={4} likelihood={3} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={4} likelihood={4} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={4} likelihood={5} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
				</div>
				<div className="flex">
					<div className="RiskRatingTypes">&gt;R20K-1.5mil<br/>Moderate</div>
					<div className="RiskRatingTypes">Not Permanent Disabity / LTI</div>
					<div className="RiskRatingTypes">Serious But Reversible Health Effect</div>
					<div className="RiskRatingTypes">Significant Reversible Impact</div>
					<RiskRatingNum name={name} consequence={3} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={3} likelihood={1} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={3} likelihood={2} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={3} likelihood={3} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={3} likelihood={4} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={3} likelihood={5} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
				</div>
				<div className="flex">
					<div className="RiskRatingTypes">&gt;R5K-R20K</div>
					<div className="RiskRatingTypes">Restricted/Medical Treatment Injury</div>
					<div className="RiskRatingTypes">Medical Treatment On Site</div>
					<div className="RiskRatingTypes">Moderate/Short Term Damage</div>
					<RiskRatingNum name={name} consequence={2} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={2} likelihood={1} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={2} likelihood={2} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={2} likelihood={3} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={2} likelihood={4} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={2} likelihood={5} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
				</div>
				<div className="flex">
					<div className="RiskRatingTypes">&lt;R5K</div>
					<div className="RiskRatingTypes">Minor Injury / First Aid Case</div>
					<div className="RiskRatingTypes">Minor if any adverse health effect</div>
					<div className="RiskRatingTypes">Minor & Limited Impact</div>
					<RiskRatingNum name={name} consequence={1} selected={selected} hasFrequency={hasFrequency}
					               readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={1} likelihood={1} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={1} likelihood={2} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={1} likelihood={3} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={1} likelihood={4} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
					<RiskRatingScore name={name} consequence={1} likelihood={5} selected={selected}
					                 hasFrequency={hasFrequency} readonly={readonly} onChange={onChange}/>
				</div>
			</div>
		</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RiskRatingNum">
@observer
class RiskRatingNum extends React.Component {

	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick(e) {
		const {consequence, likelihood, selected, name, onChange, hasFrequency, readonly} = this.props;
		if (readonly) return;
		consequence && (selected.consequence = consequence);
		likelihood && (selected.likelihood = likelihood);
		onChange && onChange(selected, name, this);
	}

	@computed get selected() {
		const {consequence, likelihood, selected, hasFrequency} = this.props;
		if (selected) {
			let {
				consequence: selectedConsequence,
				likelihood: selectedLikelihood,
				frequency: selectedFrequency
			} = selected;

			const likelihoodLetters = ['A', 'B', 'C', 'D', 'E'];
			selectedLikelihood = isNumber(selectedLikelihood) ? selectedLikelihood : (likelihoodLetters.indexOf(selectedLikelihood) + 1);
			return selectedConsequence === consequence || selectedLikelihood === likelihood;
		}
	}

	render() {
		const {consequence, likelihood, hasFrequency} = this.props;
		let className = "RiskRatingNums fixed-flex";
		if (consequence) {
			className += " consequence min-w-70";
		} else if (likelihood) {
			className += " likelihood min-w-40";
		}
		if (this.selected) {
			className += " active";
		}
		return <div className={className} onClick={this.onClick}>{consequence || likelihood}</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="RiskRatingScore">
@observer
class RiskRatingScore extends React.Component {

	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
	}

	onClick(e) {
		const {consequence, likelihood, selected, name, onChange, hasFrequency, readonly} = this.props;
		if (readonly) return;
		selected.consequence = consequence;
		selected.likelihood = likelihood;
		onChange && onChange(selected, name, this);
	}

	@computed get selected() {
		const {consequence, likelihood, selected} = this.props;
		if (selected) {
			let {
				consequence: selectedConsequence,
				likelihood: selectedLikelihood,
				frequency: selectedFrequency,
				hasFrequency
			} = selected;

			if ('likelihood' in selected) {
//                const likelihoodLetters = ['A', 'B', 'C', 'D', 'E'];
//                selectedLikelihood = isNumber(selectedLikelihood) ? selectedLikelihood : (likelihoodLetters.indexOf(selectedLikelihood) + 1);

//                if(!isNumber(selectedLikelihood)) return false;

				let scoreActual;
				if (hasFrequency) {
					scoreActual = ((likelihood + selectedFrequency) / 2) * consequence;
				} else {
					scoreActual = likelihood * consequence;
				}
//                console.log('-------------------------------')
//                console.log('likelihood', likelihood, '=', selectedLikelihood)
//                console.log('consequence', consequence, '=', selectedConsequence)
//                console.log('scoreActual', scoreActual, '=', Math.round(scoreActual))

				const scoreWhole = likelihood * consequence;
//                console.log('scoreWhole', scoreWhole, '=', Math.round(scoreActual))
				return (consequence === selectedConsequence && likelihood === selectedLikelihood) && Math.round(scoreActual) === scoreWhole;
			} else {
				return (consequence === selectedConsequence && likelihood === selectedLikelihood);
			}

		}
	}

	@computed get value() {
		const {consequence, likelihood, hasFrequency} = this.props;
		const score = likelihood * consequence;
		let className = "fixed-flex min-w-40 RiskRatingPoint";
		if (score > 15) {
			className += " RiskRatingExtreme";
		} else if (score >= 9 && score <= 15) {
			className += " RiskRatingHigh";
		} else if (score >= 5 && score <= 8) {
			className += " RiskRatingModerate";
		} else if (score < 5) {
			className += " RiskRatingLow";
		}

		if (this.selected) {
			className += " active";
		}
		return {score, className};
	}

	render() {
		const {score, className} = this.value;
		return <div className={className} onClick={this.onClick}>{score}</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Chart">
@observer
class Chart extends React.Component {

	@observable state = {
		show: false,
		options: null
	};

	constructor(props) {
		super(props);

		this.onRef = this.onRef.bind(this);
		this.update = this.update.bind(this);
	}

	componentDidMount() {
		if (this.props.onRef) {
			this.props.onRef(this);
		}
		this.state.options = this.props.options;
		this.state.show = true;
	}

	componentWillUpdate() {
		this.state.options = this.props.options;
	}

	onRef(ref) {
		this.chart = ref;
	}

	options(options) {
		this.state.show = false;
		setTimeout(() => {
			this.state.options = options;
			this.state.show = true;
		});
		return this;
	}

	update(ms) {
		this.state.show = false;
		setTimeout(() => {
			this.state.show = true;
		}, ms || 0);
	}

	render() {
		const {show, options} = this.state;
		if (!show || !options) return null;
//
		return (<CanvasJSChart key={new Date().getTime()} options={options} onRef={this.onRef}/>);
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ViewDocumentDetailsPanel">
@observer
class ViewDocumentDetailsPanel extends React.Component {

	constructor(props) {
		super(props);

		this.renderProfilePic = this.renderProfilePic.bind(this);
	}

	renderProfilePic() {
		const {data: {company = {}}} = this.props.item;
		const {id, data} = company;
		if (data && data.profile_pic) {
			return <img src={data.profile_pic.dlUrls[0]} width="100%" height="100%"/>;
		} else {
			return <ProfilePic readonly profilePic="clients" id={id} fixedCenter/>;
		}
	}

	render() {
		const {
			props: {
				onFormBack, onFormOpen, item: {
					id, data: {
						created_at,
						type,
						desc,
						internal_or_external,
						responsible_department,
						responsible_person,
						expiry,
						company,
						title,
						doc_num,
						doc
					}
				},
				title: secTitle, idx, showOnlyFile
			}
		} = this;

		const lastDoc = isArray(doc) || isObservableArray(doc) ? doc.getLastElement() : doc;

		console.log('document lastDoc', lastDoc)

		let companyName;
		if (company) {
			const {name, data: _data} = company;
			companyName = name || _data.name;
		}

		return <div className={"row " + (!onFormOpen && "active-always")}>
			<label>
				{secTitle || "View Document Details"}
				{onFormOpen && <Clickable idx={idx || 3} onClick={onFormOpen}><i
					className="fa fa-angle-down icon-right pull-right"/></Clickable>}
			</label>
			{!showOnlyFile && <div className="row sec-group">
				<ProfileField title="Responsible Department" type="select" value={responsible_department}
				              renderer={val => val.name} className="col-lg-4"/>
				<ProfileField title="Responsible Person" type="select" value={responsible_person}
				              renderer={val => val.fname + ' ' + val.lname} className="col-lg-4"/>
				<ProfileField title="Expiry Date" type="date" value={expiry} className="col-lg-4"/>
			</div>}
			{!showOnlyFile && <div className="row sec-group">
				<ProfileField title="Document Description" type="textarea" value={desc} className="col-lg-12"/>
			</div>}
			<div className="ViewHeader row sec-group padding-r-0">
				{type !== 'Upload' && <div className="row flex margin-0 margin-t-10 margin-b-20 row-header">
					<div className="row margin-0 fixed-flex min-w-200">
						{this.renderProfilePic()}
					</div>
					<div className="row row-header-name margin-0">
						<div className="row margin-0 h-half padding-10">
							<h3 className="fixed-center margin-0">{companyName || 'N/A'}</h3>
						</div>
						<div className="row margin-0 h-half padding-10">
							<h4 className="fixed-center margin-0">{title}</h4>
						</div>
					</div>
					<div className="row row-header-numbers margin-0 fixed-flex min-w-400">
						<div className="row margin-0 padding-10">
							<h5 className="text-center margin-0">Document No.</h5>
							<h6 className="text-center margin-0">{doc_num}</h6>
						</div>
						<div className="row margin-0 padding-10">
							<h5 className="text-center margin-0">Revision No.</h5>
							<h6 className="text-center margin-0">{lastDoc.doc_rev_num}</h6>
						</div>
						<div className="row margin-0 padding-10">
							<h5 className="text-center margin-0">Revision Date</h5>
							<h6 className="text-center margin-0">{Dates.formatDate(lastDoc.doc_rev_date)}</h6>
						</div>
						<div className="row margin-0 padding-10">
							<h5 className="text-center margin-0">Page No.</h5>
							<h6 className="text-center margin-0"></h6>
						</div>
					</div>
				</div>}
				{type === 'Upload' &&
					<ProfileField name="doc" value={lastDoc.doc} type="file" className="col-lg-12 h-full"/>}
				{type === 'Type' &&
					<div className="col-lg-12 document-preview" dangerouslySetInnerHTML={{__html: lastDoc.doc}}/>}
			</div>
			{onFormBack && <NavButtons idx={idx || 3} onBack={onFormBack}/>}
		</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="PaymentForm">
@observer
class PaymentForm extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
//
		setTimeout(() => {
			braintree.client.create({
				authorization: "sandbox_d5z7mwpy_8mwhq93wqw6ff2js"
			}, (err, clientInstance) => {
				if (err) {
					//                console.error(err);
					return;
				}

				braintree.hostedFields.create({
					client: clientInstance,
					styles: {
						'input': {
							'font-size': '16px',
							'color': '#3A3A3A'
						},
						'input.invalid': {
							'color': 'red'
						},
						'input.valid': {
							'color': 'rgb(2,168,168)'
						},
						'.number': {
							'font-family': 'monospace'
						},
					},
					fields: {
						number: {
							selector: '#card-number',
							placeholder: '4111 1111 1111 1111'
						},
						cvv: {
							selector: '#cvv',
							placeholder: '123'
						},
						expirationDate: {
							selector: '#expiration-date',
							placeholder: '10/2022'
						}
					}
				}, (hostedFieldsErr, hostedFieldsInstance) => {
					if (hostedFieldsErr) {
						console.error(hostedFieldsErr);
						return;
					}

					execWhen(() => this.refs.form && this.refs.submit).then(() => {
						const {submit, form} = this.refs;
						submit.removeAttribute('disabled');

						form.addEventListener('submit', (event) => {
							event.preventDefault();

							hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
								if (tokenizeErr) {
									console.error(tokenizeErr);
									return;
								}

								// If this was a real integration, this is where you would
								// send the nonce to your server.
								console.log('Got a nonce: ' + payload.nonce);
							});
						}, false);
					});
				});
			});
		});
	}

	render() {
		return <div id="PaymentForm">
			<form ref="form" action="/" method="post">
				<div className="col-lg-12">
					<label class="hosted-fields--label" for="card-number">Card Number</label>
					<div id="card-number" class="hosted-field"></div>
				</div>
				<div className="col-lg-6">
					<label class="hosted-fields--label" for="expiration-date">Card Expiration Date</label>
					<div id="expiration-date" class="hosted-field"></div>
				</div>
				<div className="col-lg-6">
					<label class="hosted-fields--label" for="cvv">Card CVV</label>
					<div id="cvv" class="hosted-field"></div>
				</div>
			</form>
		</div>;
	}
}

// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ModuleRenderer">
@observer
class ModuleRenderer extends React.Component {

	@observable
	state = {rendered: true};

	show() {
		this.state.rendered = true;
	}

	hide() {
		this.state.rendered = false;
	}

	componentWillMount() {
		this.state.rendered = !!this.props.rendered;
	}

	getPrice = (price) => {
		if (!price) {
			return 'N/A';
		}
		return price.toCurrency('R');
	};

	render() {
		const {children, item, idx, isInstalled, isInstallable} = this.props;
		if (!this.state.rendered) return null;
		return <div key={item.key} idx={idx}>
			<div className={isInstalled ? 'installed' : undefined}>
				{isInstalled && <i className="fa fa-check"/>}
				{!item.svgIconLeft && <i className={"fa fa-" + item.faIconLeft}/>}
				{item.svgIconLeft && <img src={'img/svg/' + item.svgIconLeft + '.svg'} className="fa fa-"/>}
				<h3>{item.title}</h3>
				<h3 className="price">Price - {this.getPrice(item.price)}</h3>
				<Button className="btn fa fa-info" module={item} onClick={this.onInfo}/>
				{isInstallable && <div className="buttons">
					<Button className="btn btn-primary" module={item} onClick={this.onInstall}>
						{children}
					</Button>
				</div>}
			</div>
		</div>;
	}
}

// </editor-fold>

export {
	AControls,
	FormControls, Row, RowSecGroup, Fragment, NavButtons,
	RiskRating,
	Chart, ViewDocumentDetailsPanel, PaymentForm, ModuleRenderer,
};