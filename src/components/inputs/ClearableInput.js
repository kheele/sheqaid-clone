// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {computed, isObservableArray, isObservableObject, observable, toJS} from 'mobx';
import {TextField} from '@material-ui/core';
import TimePicker from 'react-time-picker';
import SignatureCanvas from 'react-signature-canvas';

import ClearableInputSelects from './ClearableInputSelects';
import {
    CheckboxGroupImpl,
    ClearIcon,
    InputDesc,
    InputIcon,
    RadioGroupImpl,
    RenderSelectable
} from './ClearableInputComponents';

import Button from './Button';
import * as Utils from '../../utils/Utils';
import {execWhen, Dates} from '../../utils/Utils';
import autosize from '../../utils/autosize';

import ASelectInput from './ASelectInput';

import ErrorBoundary from '../ErrorBoundary';

import style from "./ClearableInput.lazy.css";

// </editor-fold>

@observer
class ClearableInput extends ASelectInput {
    // <editor-fold defaultstate="collapsed" desc="fields">
    static propTypes = {};

    className = 'clearable-field-control';
    refName;

    @observable
    state = {
        value: '',
        placeholder: null,
        rendered: true,
        readonly: false,
        isClearable: true,
        isEditable: true,
        isSelectableSearching: '',
        min: null,
        max: null
    };
    defaultValue;
    dateValue;
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.setValue = this.setValue.bind(this);
        this.reset = this.reset.bind(this);
        this.onLoadList = this.onLoadList.bind(this);
        this.onAsyncSelectLoad = this.onAsyncSelectLoad.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelectInputChange = this.onSelectInputChange.bind(this);
        this.onClickSelectInput = this.onClickSelectInput.bind(this);
        this.onSelectTimeSelect = this.onSelectTimeSelect.bind(this);
        this.onCloseTimeSelect = this.onCloseTimeSelect.bind(this);
        this.onSelectSignatureSelect = this.onSelectSignatureSelect.bind(this);
        this.onCloseSignatureSelect = this.onCloseSignatureSelect.bind(this);
        this.onClickCover = this.onClickCover.bind(this);

        this.setRef = this.setRef.bind(this);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        style.use();
        let {
            onShowAddInput,
            className,
            isClearable,
            isEditable,
            rendered,
            readonly,
            type,
            placeholder,
            defaultValue,
            min,
            max
        } = this.props;

        this.state.placeholder = placeholder;

        if ("min" in this.props) {
            this.state.min = min;
        }
        if ("max" in this.props) {
            this.state.max = max;
        }

        if ("rendered" in this.props) {
            this.state.rendered = rendered;
        }
        if ("readonly" in this.props) {
            this.state.readonly = readonly;
        }
        if ("defaultValue" in this.props) {
            if (type === 'date' || type === 'time') {
                if(type === "date") {
                    defaultValue = Dates.parse(defaultValue);
                }
                this.onChange(defaultValue, this, true);
            } else if (type === 'radio') {
                this.props.values.forEach(item => {
                    item.checked = false;
                });
                const item = this.props.values.find(v => v || v.value === defaultValue);
                if (item) {
                    item.checked = true;
                    this.onChange(defaultValue, this, true);
                }
            } else if (type === 'checkbox') {
                defaultValue = this.props.values.filter(item => {
                    item.checked = false;
                    if (!defaultValue) return false;
                    if (isArray(defaultValue) || isObservableArray(defaultValue)) {
                        return !!defaultValue.filter(v => !!v).find(v => {
                            const _val = v.value || v;
                            return _val === item.value;
                        });
                    }
                    const _val = defaultValue.value || defaultValue;
                    return _val === item.value;
                });
                defaultValue.forEach(item => {
                    item.checked = true;
                });
                this.onChange(defaultValue, this, true);
            } else {
                if (isObservableObject(defaultValue) || isObservableArray(defaultValue)) {
                    this.onChange(toJS(defaultValue), this, true);
                } else {
//                    console.log('defaultValue', defaultValue)
                    this.onChange(defaultValue, this, true);
                }
            }
            this.defaultValue = this.state.value;
        }
        if (!!className) {
            this.className += ' ' + className;
        }

        if (typeof isClearable === "boolean") {
            this.state.isClearable = isClearable;
        }
        if (readonly) {
            this.state.isEditable = false;
        } else if (typeof isEditable === "boolean") {
            this.state.isEditable = isEditable;
        }

    }

    componentDidMount() {
        const {readonly} = this.state;
        const {type} = this.props;
        if (type === 'textarea') {
            setTimeout(function () {
                autosize(this.refs[this.refName]);
            }.bind(this), 0);
        }
        if (readonly) {
            setTimeout(function () {
                $(this.getDOMNode()).addClass('readonly');
            }.bind(this), 0);
        }
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getInputNode, getDOMNode">
    getInputNode() {
        return findDOMNode(this.refs[this.refName]);
    }

    getDOMNode() {
        try {
            return findDOMNode(this);
        } catch (e) {
//            console.log(this.constructor.name, e)
            return null;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onLoadList">
    onLoadList(promise) {
        const ref = this.refs[this.refName];
        if (ref && ref.onLoadList) {
            return ref.onLoadList(promise);
        }
        return Promise.reject('onLoadList not defined');
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="min, max, hasValue, value, setValue, setPlaceholder">
    @computed
    get min() {
        return this.state.min;
    }

    set min(value) {
        this.state.min = value;
    }

    @computed
    get max() {
        return this.state.max;
    }

    set max(value) {
        this.state.max = value;
    }

    @computed
    get hasValue() {
        const {type} = this.props;
        const {value} = this.state;
        if (type === 'date') {
            return value instanceof Date;
        } else if (type === 'radio' || type === 'checkbox') {
            return !this.props.values.filter(item => !!item.checked).isEmpty();
        } else if (type === 'select_multi' || type === 'select_multiple') {
            // console.log('hasValue', toJS(value))
            return value.length > 0;
        } else if (isString(value) || isArray(value) || isObservableArray(value)) {
            return value.length > 0;
        }

        return isBoolean(value) || isNumber(value) || !!value;
    }

    @computed
    get value() {
        return this.hasValue ? this.state.value : null;
    }

    set value(value) {
        this.onChange(value);
        // console.log(`${this.props.name} - set value`, value)
    }

    setValue(evt) {
        if (this.isSelectable) {
            this.onChange(evt);
            return;
        }
        evt.preventDefault();
        const {type} = this.props;
        if (type === 'radio') {
//            if (!this.state.isEditable)
//                return;
//            console.log('setValue', evt.target)
            const onsRadio = evt.target.parentNode.parentNode;
            const idx = parseInt(onsRadio.getAttribute("idx"));
            this.props.values.forEach(item => {
                item.checked = false;
            });
            const item = this.props.values[idx];
            item.checked = true;

            this.onChange(item);
        } else if (type === 'checkbox') {
//            if (!this.state.isEditable)
//                return;
            const onsCheckbox = evt.target.parentNode.parentNode;
            const idx = parseInt(onsCheckbox.getAttribute("idx"));
            const item = this.props.values[idx];
            item.checked = !item.checked;

            this.onChange(this.props.values.filter(val => val.checked));
        } else {
            this.onChange(evt.target.value);
        }
    }

    setPlaceholder(placeholder) {
        this.state.placeholder = placeholder;
        return this;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setEditable, setReadonly, setRendered, hide, show, setError, clearError">
    setEditable(bool) {
        this.state.isEditable = bool;
        if (this.state.readonly) {
            $(this.getDOMNode()).addClass('readonly');
        }
        return this;
    }

    setReadonly(bool) {
        this.state.readonly = bool;
        const node = this.getDOMNode();
        if (node) {
            if (bool) {
                $(node).addClass('readonly');
            } else {
                $(node).removeClass('readonly');
            }
        }
        return this;
    }

    setRendered(bool) {
        this.state.rendered = bool;
        !bool && this.reset();
        return this;
    }

    hide() {
        this.state.rendered = false;
        return this;
    }

    show() {
        this.state.rendered = true;
        return this;
    }

    setError() {
        const node = this.getDOMNode();
        node && node.classList.add('error');
        return this;
    }

    clearError() {
        const node = this.getDOMNode();
        node && node.classList.remove('error');
        return this;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="reset">
    reset(evt) {
        const {type} = this.props;
        this.clearError();
        if (type === 'radio' || type === 'checkbox') {
            this.props.values.forEach(item => {
                item.checked = false;
            });
            const {radioGroup, checkboxGroup} = this.refs;
            if (radioGroup) {
                radioGroup.refresh();
            } else if (checkboxGroup) {
                checkboxGroup.refresh();
            }
            this.onChange(null);
        } else if (type === 'signature' || this.isSelectable) {
            this.isSelectable && (this.state.isSelectableSearching = '');
            this.onChange(null);
        } else {
            this.onChange('');
        }
        if (this.props.onReset) {
            this.props.onReset(evt, this.onChange);
        }
        return this;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange, onSelectInputChange">
    onChange(value, el, isDefault) {
        if (!isDefault && !this.state.isEditable)
            return;

        const {name, type, onChange, onProcessValue, returnValue, onShowAddInput} = this.props;
        //this.state.value = type === 'date' ? (value instanceof Date ? value : null) : value;
        if (type === 'date') {
//            console.log('date', value)
            if (!!value) {
                if (isNumber(value)) {
                    value = Utils.Dates.parse(value);
                }
            } else {
                value = null;
            }
        } else if (type === 'time') {
            if (!value) {
//                popover.close();
            }
        } else if (type === 'signature') {
            execWhen(() => this.refs.signaturePicker).then(signaturePicker => {
                if (!value) {
                    signaturePicker.clear();
                } else {
                    value = signaturePicker.toData();//pointGroupArray,
                    console.log(type, value)
                }
            });
//            console.log(value)
        } else if (type === 'radio') {
            this.props.values.forEach(item => {
                item.checked = false;
            });
            if (isDefault) {
                const item = this.props.values.find(v => {
                    if (!isNullable(value) && isObject(value) && !isNullable(value.value)) {
                        return v.value === (el ? el.props.defaultValue : value.value);
                    } else {
                        return v.value === (el ? el.props.defaultValue : value);
                    }
                });
                if (item) {
                    item.checked = true;
                    value = item.value;
                }
            } else {
                const item = this.props.values.find(v => {
                    if (!isNullable(value) && isObject(value) && !isNullable(value.value)) {
                        return v.value === value.value;
                    } else {
                        return v.value === value;
                    }
                });
                if (item) {
                    item.checked = true;
                    value = item.value;
                }

            }
            const {radioGroup} = this.refs;
            if (radioGroup) {
                radioGroup.refresh();
            }
        } else if (type === 'checkbox') {
//            if(isDefault) {
//                
//            } else {
//                console.log(value)
            if (!value || value.isEmpty()) {
                value = null;
            } else {
                if (this.props.values.length === 1) {
                    value = value[0];
                    if (returnValue) {
                        value = value.value;
                    } else {
                        value = onProcessValue ? onProcessValue(value) : value;
                    }
                } else {
                    value = value.filter(v => !!v);
                    value = returnValue ? value.map(v => isString(v) ? v : v.value) : (onProcessValue ? onProcessValue(value) : value);
                }
            }
//                console.log(value)
//            }

            const {checkboxGroup} = this.refs;
            if (checkboxGroup) {
                checkboxGroup.refresh();
            }
        } else if (this.isSelectMultiple && el) {
            if (isDefault) {
                value = el.props.defaultValue;
//
            }
        } else if (this.isSelectable && el) {
            if (isDefault) {
                value = el.props.defaultValue;
                // console.log(1, name, value);
            } else {
                if (el.props.value === null) {
                    //value = el.props.value;
                    // console.log(el.constructor.name)
                    onShowAddInput && onShowAddInput().then(value => {
                        this.props.values.push(value);
                        this.state.value = value;
                        onChange && onChange(this.state.value, this.props.name, this);
                    });
                    return;
                } else {
                    value = el.props.value;
                    // console.log(el)
                }
            }
        }

        const onChangeImpl = async (value) => {
            let val;
            if (this.isSelectable) {
                // console.log(2, name, value);
                if (this.hasValue) {
                    if (this.isSelectMultiple) {
                        // console.log('onChangeImpl', value.slice())
                        val = returnValue ? value.filter(v => !!v).map(v => isString(v) ? v : v.value) : (onProcessValue ? onProcessValue(value) : value);
                    } else {
                        if (isString(value) || isNumber(value) || isBoolean(value)) {
                            val = value;
                        } else if (value) {
                            if (onProcessValue) {
                                val = onProcessValue(value);
                                if (val instanceof Promise) {
                                    val = await val;
                                }
                                if (returnValue) {
                                    val = val.value;
                                }
                            } else if (returnValue) {
                                val = value.value;
                            } else {
                                val = value;
                            }
//                            val = returnValue ? value.value : (onProcessValue ? onProcessValue(value) : value);
                        } else {
                            val = value;
                        }
                        // console.log(3, name, value);
                    }
                } else {
                    val = value;
                }
                this.state.isSelectableSearching = '';
            } else {
                val = value;
            }

            onChange && onChange(val, this.props.name, this);
        };

        if (this.isSelectMultiple) {
            if (!value) {
                value = [];
            } else if (!isArray(value) && !isObservableArray(value)) {
                value = [value];
            }

//            if(isArray(this.state.value) || isObservableArray(this.state.value)) {
//                this.state.value = value;//
//            } else {
            this.state.value = value;
//            }
            onChangeImpl(this.state.value);
        } else if (this.isSelectable) {
            const onChangeSelect = async (value) => {
                if (onProcessValue && value) {
                    value = onProcessValue(value);
                    if (value instanceof Promise) {
                        value = await value;
                    }
                }
                this.state.value = value;
                onChangeImpl(this.state.value);
            };
            onChangeSelect(value);
        } else {
            this.state.value = value;
            onChangeImpl(this.state.value);
        }
        return this;
    }

    onSelectInputChange(e, val) {
        this.state.isSelectableSearching = val;
//        console.log('onSelectInputChange', this.props.name, val)
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setRef, onClickSelectInput, onSelectTimeSelect, onCloseTimeSelect, onSelectSignatureSelect, onCloseSignatureSelect">
    setRef(ref) {
        if (!!ref) {
            const {props: {name}} = ref;
            this.refs[name] = ref;
        }
    }

    onClickSelectInput(evt) {
        if (!this.state.isEditable)
            return;
        if (this.isSelectable) {
            this.refs[this.refName].open();
            return;
        }

        const {type} = this.props;
        const renderSelectable = this.refs.renderSelectable;
        const selectBox = renderSelectable.refs.selectBox;
        const offset = window.$(selectBox).offset();
        const h = window.$(selectBox).outerHeight();
        const top = offset.top + h + 10;

        let className;
        if (type === 'signature') {
            className = 'signature-popover';
        }
        const settings = {
            style: {left: "auto", right: Utils.calculateRightPos(selectBox, true), top, width: 'auto', height: 'auto'}
        };
        if (type === 'date') {
            dateDialog.open(this.state.value).then(this.onChange);
            return;
        }

        if (type === 'signature') {
            const canvasProps = {width: 200, height: 140, className: 'sigCanvas'};
            settings.style.width = 230;
            settings.contentNode = <div key="signature">
                <div className="flex">
                    <label>Draw signature in the box</label>
                </div>
                <SignatureCanvas
                    ref={this.setRef}
                    name="signaturePicker"
                    penColor='green'
                    canvasProps={canvasProps}
                    onEnd={this.onChange}
                />
                <div className="flex">
                    <Button className="btn btn-primary fixed-flex" onClick={this.onCloseSignatureSelect}>Cancel</Button>
                    <Button className="btn btn-primary fixed-flex" onClick={this.onSelectSignatureSelect}>Done</Button>
                </div>
            </div>;
        }
        settings.onResize = () => {
        };
        if (className) {
            settings.className = className;
        }
        popover.settings(settings).open();
    }

    onSelectTimeSelect() {
        if (this.hasValue) {
            popover.close();
        } else {
        }
    }

    onCloseTimeSelect() {
        this.reset();
        popover.close();
    }

    onSelectSignatureSelect() {
        if (this.hasValue) {
            popover.close();
        } else {
        }
    }

    onCloseSignatureSelect() {
        this.reset();
        popover.close();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onClickCover, onAsyncSelectLoad, isSelectable">
    onClickCover() {
        this.clearError();
    }

    onAsyncSelectLoad(inputValue) {
        return this.props.onAsyncSelectLoad(inputValue);
    }

    get isSelectable() {
        const {type} = this.props;
        return type === 'select' || this.isSelectMultiple;
    }

    get isSelectMultiple() {
        const {type} = this.props;
        return type === 'select_multi' || type === 'select_multiple';
    }

    // </editor-fold>

    getErrorBoundaryProps(title, className) {
        return {title, className};
    }

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.state.rendered) {
            return null;
        }
        const inputProps = {
            onChange: this.setValue, className: "text-input--underbar2"
        };
        const {type, desc, footerDesc, renderer, onFilter, onSubmit} = this.props;

        const {placeholder} = this.state;

        try {
            if (footerDesc) {
                this.className += " footer-desc-field-control";
            }

            if (type !== 'radio' && type !== 'checkbox' && !this.isSelectMultiple) {
                inputProps.value = this.state.value;
            }
            if (this.props.id) {
                inputProps.id = this.props.id;
            }

            if (placeholder && type !== 'textarea') {
                inputProps.placeholder = placeholder;
            }
            if (this.props.inputStyle) {
                inputProps.style = this.props.inputStyle;
            }
            if (this.props.inputClassName) {
                inputProps.className += ' ' + this.props.inputClassName;
            }
            if (this.props.onClick) {
                inputProps.onClick = this.props.onClick;
            }

            let input;
            if (type === 'textarea') {
                if (!this.className.contains('textarea-field-control')) {
                    this.className += " textarea-field-control";
                }
                inputProps.ref = this.refName = this.props.ref || "textareaField";
                inputProps.className = "text-input--underbar";
                inputProps.modifier = "material";
                input = <textarea {...inputProps}></textarea>;
            } else if (type === 'date') {
                this.className += " date_input";
            } else if (type === 'time') {
                this.className += " time_input";
                //inputProps.type = type || 'text';
                inputProps.ref = this.refName = this.props.ref || "textField";
                inputProps.label = inputProps.placeholder;
                if (!this.state.isEditable) {
                    inputProps.readonly = true;
                }
                inputProps.disableClock = true;
                inputProps.onChange = this.onChange;
                input = <TimePicker {...inputProps}/>;
            } else if (type === 'signature') {
                this.className += " signature_input select_input";
            } else if (this.isSelectable) {
                this.className += " select_input";
                if (this.isSelectMultiple) {
                    this.className += " select_multiple";
                    inputProps.multiple = true;
                }

                inputProps.onFilter = onFilter;
                inputProps.onInputChange = this.onSelectInputChange;
                inputProps.isSearchable = 'isSearchable' in this.props ? this.props.isSearchable : true;
                !!this.defaultValue && (inputProps.defaultValue = this.defaultValue);

                const ref = this.refName = this.props.ref || "selectField";
                input = <ClearableInputSelects
                    ref={ref}
                    inputProps={inputProps}
                    onAsyncSelectLoad={this.props.onAsyncSelectLoad}
                    onShowAddInput={this.props.onShowAddInput}
                    add={this.props.add}
                    create={this.props.create}
                    save={this.props.save}
                    values={this.props.values}
                    state={this.state}
                    renderItem={this.props.renderItem}/>;
            } else if (type === 'radio') {
                this.className += " select_radio";
                let checkboxClassName;
                if (this.props.vertical) {
                    this.className += " select_radio-vertical";
                    if (isNumber(this.props.vertical)) {
                        checkboxClassName = " col-lg-" + (12 / this.props.vertical);
                    }
                }
                const ref = this.refName = this.props.ref || "radioField";
                inputProps.name = this.props.name;
                if (!this.state.isEditable) {
                    inputProps.readonly = true;
                    inputProps.disabled = true;
                }

                input = <div className="radio--input" ref={ref}>
                    {placeholder && <label>{placeholder}</label>}
                    <RadioGroupImpl
                        ref="radioGroup"
                        name={this.props.name}
                        values={this.props.values}
                        groupBy={this.props.groupBy}
                        className={checkboxClassName}
                        inputProps={inputProps}/>
                </div>;
            } else if (type === 'checkbox') {
                this.className += " select_checkbox";
                let checkboxClassName;
                if (this.props.vertical) {
                    this.className += " select_checkbox-vertical";
                    if (isNumber(this.props.vertical)) {
                        checkboxClassName = " col-lg-" + (12 / this.props.vertical);
                    }
                }
                const ref = this.refName = this.props.ref || "checkboxField";
                inputProps.name = this.props.name;
                if (!this.state.isEditable) {
                    inputProps.readonly = true;
                    inputProps.disabled = true;
                }
                input = <div className="checkbox--input" ref={ref}>
                    {placeholder && <label>{placeholder}</label>}
                    <CheckboxGroupImpl
                        ref="checkboxGroup"
                        name={this.props.name}
                        values={this.props.values}
                        groupBy={this.props.groupBy}
                        className={checkboxClassName}
                        inputProps={inputProps}/>
                </div>;
            } else {
                inputProps.type = type || 'text';
                inputProps.ref = this.refName = this.props.ref || "textField";
                inputProps.label = inputProps.placeholder;

                let onEnterSubmit;
                if(isFunction(onSubmit)) {
                    onEnterSubmit = (e) => {
                        if(e.keyCode === 13) {
                            onSubmit(e);
                        }
                    };
                }

                let innerInputProps = {};

                if (type === 'number') {
                    const {isCurrency} = this.props;
                    const {min, max} = this.state;

                    if (isCurrency) {
                        innerInputProps.pattern = "^\d+(?:\.\d{1.2})?$";
                        innerInputProps.step = ".01";
                    }
                    min && (innerInputProps.min = min);
                    max && (innerInputProps.max = max);
                    inputProps.onKeyUp = (e) => {
                        let {value, min, max, nodeName} = e.target;
                        if (nodeName === 'INPUT') {
                            if (value !== "") {
                                let _value = String(value);
                                if (_value.contains(',')) {
                                    _value = _value.replace(',', '.');
                                }
                                value = parseFloat(_value);//.toFixed(1);
                                //
                                e.target.value = value;
                                if (value < parseFloat(min)) {
                                    this.state.value = min;
                                }
                                if (value > parseFloat(max)) {
                                    this.state.value = max;
                                }
                            }
                        }
                    };
                } else if (type === 'password') {
                    innerInputProps = {
                        autoComplete: 'new-password',
                        form: {autoComplete: 'off'}
                    };
                    onEnterSubmit && (inputProps.onKeyUp = onEnterSubmit);
                } else {
                    onEnterSubmit && (inputProps.onKeyUp = onEnterSubmit);
                }
                if (!this.state.isEditable) {
                    inputProps.readonly = true;
                }
                input = <TextField {...inputProps} inputProps={innerInputProps}/>;
            }

            return <ErrorBoundary
                CustomErrorBoundary={CustomErrorBoundary}
                customErrorBoundaryProps={this.getErrorBoundaryProps(placeholder, this.className)}
            >
                <div className={this.className} onClick={this.onClickCover}>
                    <RenderSelectable
                        ref="renderSelectable"
                        name={this.props.name}
                        getSignaturePicker={() => this.refs.signaturePicker}
                        state={this.state}
                        type={type}
                        placeholder={placeholder}
                        renderer={renderer}
                        onClickSelectInput={this.onClickSelectInput}
                    />
                    {type === 'textarea' && <span
                        className={'text-input__label text-input--material__label' + (this.hasValue ? ' text-input--material__label--active' : '')}>
                        {placeholder}
                    </span>}
                    {input}
                    <InputIcon type={type} isSelectable={() => this.isSelectable} onClick={this.onClickSelectInput}/>
                    <ClearIcon state={this.state} hasValue={this.hasValue} onClick={this.reset}/>
                    {desc && <InputDesc desc={desc}/>}
                    {footerDesc && <small className="input-footer-desc">{footerDesc}</small>}
                </div>
            </ErrorBoundary>;
        } catch (err) {
            return <CustomErrorBoundary error={err} title={placeholder} className={this.className}/>;
        }
    }

    // </editor-fold>
}

@observer
class CustomErrorBoundary extends React.Component {

    constructor() {
        super();

        this.onReport = this.onReport.bind(this);
    }

    onReport(e, btn) {
        const {error, errorInfo} = this.props;
        const data = {
            message: error.message || "",
            stack: error.stack || "",
//            error_info: errorInfo.componentStack || "",
        };

        const {is: {isLoggedIn, isConsultant}} = storage;
        if (isLoggedIn) {
            const {loggedUser = {}, selected = {}, loggedContractor} = storage;
            const {access_type, company = {}, user = {}} = loggedUser;
            const {data: user_data = {}} = user;

            const {client, project, site, contractor} = user_data;

            const {selectedClient, selectedProject, selectedSite, selectedContractorSite} = selected;

            data.access_type = access_type;

            data.company = company;
            if (isConsultant) {
                data.client = client;
                data.project = project;
                data.site = site;

                data.selectedClient = selectedClient;
                data.selectedProject = selectedProject;
                data.selectedSite = selectedSite;
            }
            data.contractor = contractor;
            data.loggedContractor = loggedContractor;
            data.selectedContractorSite = selectedContractorSite;

            data.user = user;
        }

        btn.text("Reporting...").disabled();
        neonBinding.events.emit("error-reporting/create", data).then(res => {
            infoDialog.open(<React.Fragment>
                <p>Problem successfully reported!</p>
                <p>We will fix it as soon as possible.</p>
            </React.Fragment>);
            infoDialog.close(5000);
        }).finally(() => {
            btn.text("Report Problem").enabled();
        });
    }

    render() {
        const {title, className, onReport} = this.props;
        return <div className={"ProfileField error " + className}>
            <div>
                {title && <label>{title}</label>}
                <p>An error occurred in this field</p>
                <Button className="btn btn-primary hor-center" text="Report Problem"
                        onClick={onReport || this.onReport}/>
            </div>
        </div>;
    }
}

export default ClearableInput;
