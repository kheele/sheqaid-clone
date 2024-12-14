import React from "react";
import {observer} from 'mobx-react';
import {computed, isObservableArray, observable} from 'mobx';

import {Button, ClearableInput} from './';

import CustomPersonalInfoDialog from '../dialogs/CustomPersonalInfoDialog';

import ASelectInput from './ASelectInput';
import {findByIdEmployee} from "mutations/findById";
import MKBox from "../MK/MKBox";
import Chip from "@mui/material/Chip";
import {execWhen} from "../../utils/UtilsFuns";
import {CircularProgress} from "@mui/material";
import {Grid} from "@material-ui/core";

@observer
class SelectInput extends ASelectInput {

    @observable
    state = {
        lists: {
            list: []
        },
        props: null,
        selectedVal: null,
        newDefaultValue: null,
        incContractors: false,
    };

    constructor(props) {
        super(props);

        this.onIncludeContractors = this.onIncludeContractors.bind(this);
        this.onAddOtherPerson = this.onAddOtherPerson.bind(this);

        this.onProcessValue = this.onProcessValue.bind(this);
        this.renderer = this.renderer.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    @computed
    get isOtherPerson() {
        return this.showOtherPerson;
    }

    @computed
    get isOtherPersonsOnly() {
        return this.showOtherPersonsOnly;
    }

    @computed
    get selectedItem() {
        const {selectedVal, newDefaultValue} = this.state;
        let {defaultValue, defaultUser} = this.props;
        defaultValue = newDefaultValue || defaultValue;
        if (defaultValue) {
            if (isArray(defaultValue) || isObservableArray(defaultValue)) {
                return defaultValue.map(value => {
                    if (isString(value)) {
                        return {value, label: value};
                    } else if (value.label && value.value) {
                        return value;
                    } else {
                        let {id, data, fname, lname, contractor} = value;
                        contractor = contractor || data && data.contractor;
                        const label = <div className="SelectEmployeeInput-label flex-left">
                            <span className="fixed-flex">{lname || data.lname} {fname || data.fname}</span>
                            {contractor && <span className="margin-l-5">
								<Chip label={contractor.name} size="small"/>
							</span>}
                        </div>;
//                        console.log('selectedVal', label)
                        return {value, label};
                    }
                });
            } else {
                if (defaultValue.label && defaultValue.value) {
                    return defaultValue;
                }

                let {id, data, fname, lname, contractor} = defaultValue;
                contractor = contractor || data && data.contractor;

                const label = <div className="SelectEmployeeInput-label flex-left">
                    <span className="fixed-flex">{lname || data.lname} {fname || data.fname}</span>
                    {contractor && <span className="margin-l-5">
					<Chip label={contractor.name} size="small"/>
				</span>}
                </div>;
                return {value: defaultValue, label};
            }
        } else if (defaultUser) {
//            const {user: value} = storage.loggedUser;
//            const {fname, lname} = value.data;
//            const label = (fname + ' ' + lname);
//            return {value, label};
        }
//        }
        return null;
    }

    async componentDidMount() {
        let {incContractors: prop_incContractors = false, excludeIds} = this.props;

        this.state.incContractors = prop_incContractors;

        const res = await onAsyncSelectLoad(prop_incContractors, excludeIds);
        this.state.lists.list = res.distinct();
        const {defaultValue, defaultUser} = this.props;

        console.log('defaultValue', defaultValue)
        if (defaultValue && defaultValue.id) {
            this.state.newDefaultValue = await findByIdEmployee(defaultValue.id);
        }

        this.state.props = this._createProps();
    }

    _createProps() {
        let {name, type, className = '', showOtherPersonsOnly} = this.props;
        className += ` SelectEmployeeInput`;
        return {
            ref: "input",
            key: new Date().getTime(),
            name: name || "employee",
            type: type || "select",
            placeholder: "Employee...",
            values: this.list,
            // onAsyncSelectLoad: onAsyncSelectLoad,
            returnValue: true,
            add: !!showOtherPersonsOnly,
            ...this.props,
            renderItem: this.renderItem,
            renderer: this.renderer,
            onFilter: this.onFilter,
            defaultValue: this.selectedItem,
//            onChange: this.form.onChange,
            className
        };
    }

    async onIncludeContractors(e, btn) {
        let {incContractors} = this.state;
        incContractors = (this.state.incContractors = !incContractors);

        this.state.props = null;

        const res = await onAsyncSelectLoad(incContractors);
        this.state.lists.list = res.distinct();

        this.state.props = this._createProps();
    }

    onAddOtherPerson(e, btn) {
        this.refs.otherPersonDialog.open().then(other_person => {
            this.showOtherPerson = !!other_person;
            if (other_person) {
                other_person.is_external = true;
            }
            this.refs.input.onChange({label: other_person.lname + ' ' + other_person.fname, value: other_person});
        });
    }

    hide() {
        const {showOtherPerson = false, showOtherPersonsOnly = false} = this.props;
        if (!showOtherPerson) {
            const {input} = this.refs;
            input && input.hide();
        }
        return this;
    }

    show() {
        const {showOtherPerson = false, showOtherPersonsOnly = false} = this.props;
        if (!showOtherPerson) {
            const {input} = this.refs;
            input && input.show();
        }
        return this;
    }

    onFilter(option) {
        if (!option) return false;

        let value;
        if (option.value) {
            value = option.value;
        } else {
            value = option;
        }

        // console.log('option value', value);
        let {id, data, fname, lname, contractor} = value;
        contractor = contractor || data && data.contractor;
        const contractorName = contractor ? ` ${contractor.name}` : '';
        return `${lname || data.lname} ${fname || data.fname}${contractorName}`;
    }

    renderItem(option, n) {
        if (!option) return null;

        let value;
        if (option.value) {
            value = option.value;
        } else {
            value = option;
        }


        const {excludeIds} = this.props;

        if (excludeIds) {
            const excList = excludeIds();
            if (excList.isNotEmpty() && excList.contains(value.id)) {
                return null;
            }
        }

        let {id, data, fname, lname, contractor} = value;
        contractor = contractor || data && data.contractor;
        return {
            label: <div className="SelectEmployeeInput-label flex-left">
                <span className="fixed-flex">{lname || data.lname} {fname || data.fname}</span>
                {contractor && <span className="margin-l-5">
						<Chip label={contractor.name} size="small"/>
					</span>}
            </div>,
            value
        };
    }

    onProcessValue(_v) {
//        console.log('_v', this.props.name, _v)
        return execWhen(() => !!this.state.loaded && !!_v).then(() => {
            const {list} = this.state.lists;
//            console.log('_v list', this.props.name, list.slice())
            const item = list.filter(v => !!v).find(({label, value}) => {
                if (isString(value) && !isString(_v)) {
                    return value === (_v.id || _v.value.id);
                } else if (!isString(value) && isString(_v)) {
                    return value.id === _v;
                } else if (isString(value) && isString(_v)) {
                    return value === _v;
                }
                try {
                    return value.id === (_v.id || _v.value.id);
                } catch (e) {
                    return false;
                }
            });
            return item;
        });
    }

    renderer(v) {
        if (isNullable(v)) {
            return null;
        }
        if (isString(v)) {
            return v;
        }
        if (v.label && v.value) {
            return v.label;
        }
        if (isArray(v) || isObservableArray(v)) {
            return <>
                {v.filter(v => !isNullable(v)).map((v) => {
                    let label;
                    if (isString(v)) {
                        label = v;
                    } else if (v.label && v.value) {
                        label = v.label;
                    } else {
                        let {name, data} = v;
                        label = name || data.name;
                    }
                    return <Grid key={label} item><Chip label={label} size="small"/></Grid>;
                })}
            </>
        }

        let {id, data, fname, lname, contractor} = v;
        contractor = contractor || data && data.contractor;
        return <div className="SelectEmployeeInput-label flex-left">
            <span className="fixed-flex">{lname || data.lname} {fname || data.fname}</span>
            {contractor && <span className="margin-l-5">
					<Chip label={contractor.name} size="small"/>
				</span>}
        </div>;
    }

    render() {
        const {props, incContractors} = this.state;
        const {
            parentClassName,
            className,
            showOtherPerson = false,
            showOtherPersonsOnly = false,
            incContractors: prop_incContractors = false,
        } = this.props;

        if (showOtherPersonsOnly || showOtherPerson || prop_incContractors) {
            if (!props) {
                return <div
                    className={'CustomPersonalInfoDialog SelectEmployeeInput-CustomPersonalInfoDialog col-lg-12 flex' + (parentClassName ? ` ${parentClassName}` : '')}>
                    <MKBox
                        className="fixed-flex min-w-25"
                        sx={{
                            position: 'absolute',
                            left: '10px',
                            top: '5px',
                            zIndex: '1',
                        }}
                    >
                        <CircularProgress size="small"/>
                    </MKBox>
                    <ClearableInput className={className}/>
                    {prop_incContractors && <>
                        <Button className="btn btn-primary w-180 margin-r-5 border-radius-0 fixed-flex"
                                onClick={this.onIncludeContractors}>
                            {!incContractors && <>
                                <i className="fa fa-check"/> Include Contractor(s)
                            </>}
                            {incContractors && <>
                                <i className="fa fa-close"/> Exclude Contractor(s)
                            </>}
                        </Button>
                    </>}
                    {(showOtherPersonsOnly || showOtherPerson) && <>
                        <CustomPersonalInfoDialog ref="otherPersonDialog"/>
                        <Button className="btn btn-primary w-160 fixed-flex" onClick={this.onAddOtherPerson}>
                            <i className="fa fa-plus"/> Add Other Person
                        </Button>
                    </>}
                </div>;
            }
            delete props.parentClassName;

            return <div
                className={'CustomPersonalInfoDialog SelectEmployeeInput-CustomPersonalInfoDialog col-lg-12 flex' + (parentClassName ? ` ${parentClassName}` : '')}>
                <ClearableInput {...props}/>
                {prop_incContractors && <>
                    <Button className="btn btn-primary w-180 margin-r-5 border-radius-0 fixed-flex"
                            onClick={this.onIncludeContractors}>
                        {!incContractors && <>
                            <i className="fa fa-check"/> Include Contractor(s)
                        </>}
                        {incContractors && <>
                            <i className="fa fa-close"/> Exclude Contractor(s)
                        </>}
                    </Button>
                </>}
                {(showOtherPersonsOnly || showOtherPerson) && <>
                    <CustomPersonalInfoDialog ref="otherPersonDialog"/>
                    <Button className="btn btn-primary w-160 fixed-flex" onClick={this.onAddOtherPerson}>
                        <i className="fa fa-plus"/> Add Other Person
                    </Button>
                </>}
            </div>;
        } else {
            if (!props) {
                return <div
                    className={'CustomPersonalInfoDialog SelectEmployeeInput-CustomPersonalInfoDialog col-lg-12 flex' + (parentClassName ? ` ${parentClassName}` : '')}>
                    <MKBox
                        className="fixed-flex min-w-25"
                        sx={{
                            position: 'absolute',
                            left: '10px',
                            top: '5px',
                            zIndex: '1',
                        }}
                    >
                        <CircularProgress size="small"/>
                    </MKBox>
                    <ClearableInput className={className}/>
                </div>;
            }
            delete props.parentClassName;
            return <ClearableInput {...props}/>;
        }
    }
}

function onAsyncSelectLoad(incContractors = false, excludeIds) {
    const listByLogged = sockets.of('employees').fn('listByLogged');

    const args = {
        removed: false,
        //
        incContractors,
        //
        exact_orgs: true,
        //
        limit: 0,
        offset: 0,
    };

    if (excludeIds) {
        args.excludeIds = excludeIds();
    }

    return listByLogged(args).then(list => {
        // console.log('listForSelectionByLogged', list)
        return list.map((value) => {
            const {id, data: {fname, lname, contractor}} = value;
            const contractorName = contractor ? ` ${contractor.name}` : '';
            return {
                label: `${lname} ${fname}${contractorName}`,
                value,
            };
        });
    });
}

export default SelectInput;
