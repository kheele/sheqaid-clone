import {observer} from "mobx-react";
import React from "react";
import {execWhen} from "utils/UtilsFuns";
import {autorun, computed, observable} from "mobx";
import MKBox from "../MK/MKBox";
import {Button, Clickable} from "../inputs";
import {ErrorBoundary} from "../index";

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

export {
	FormControls, Row, RowSecGroup, NavButtons,
};