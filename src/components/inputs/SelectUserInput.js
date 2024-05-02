import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import {CircularProgress} from "@mui/material";
import {Grid} from "@material-ui/core";
import MKBox from "../MK/MKBox";
import Chip from "@mui/material/Chip";

import CustomPersonalInfoDialog from '../dialogs/CustomPersonalInfoDialog';

import {Button, ClearableInput} from './';

import ASelectInput from './ASelectInput';
import findByIdUser from "mutations/all/User/findByIdUser";
import {execWhen} from "utils/UtilsFuns";

@observer
class SelectInput extends ASelectInput {

    @observable
    state = {
        lists: {
            list: []
        },
        props: null,
        selectedVal: null
    };

    constructor(props) {
        super(props);

        this.onAddOtherPerson = this.onAddOtherPerson.bind(this);
        
        this.onProcessValue = this.onProcessValue.bind(this);
        this.renderer = this.renderer.bind(this);
    }

    async componentDidMount() {
        let {incContractors: prop_incContractors = false,} = this.props;
        
        this.state.incContractors = prop_incContractors;
        
        const res = await onAsyncSelectLoad(prop_incContractors);
        this.state.lists.list = res.distinct();
        const {defaultValue, defaultUser} = this.props;
        
        console.log('defaultValue', defaultValue)
        if (defaultValue && defaultValue.id) {
            this.state.newDefaultValue = await findByIdUser(defaultValue.id);
        }
        
        this.state.props = this._createProps();
    }
    
    _createProps() {
        let {name, type, className = ''} = this.props;
        className += ` SelectUserInput`;
        return {
            ref: "input",
            key: new Date().getTime(),
            name: name || "user",
            type: type || "select",
            placeholder: "Administrator/User...",
            values: this.list,
            // onAsyncSelectLoad: onAsyncSelectLoad,
            returnValue: true,
            add: false,
            ...this.props,
            renderItem: this.renderItem,
            renderer: this.renderer,
            onFilter: this.onFilter,
            defaultValue: this.selectedItem,
//            onChange: this.form.onChange,
            className
        };
    }

    onAddOtherPerson(e, btn) {
        this.refs.otherPersonDialog.open().then(other_person => {
            this.showOtherPerson = !!other_person;
            this.refs.input.onChange({label: other_person.lname + ' ' + other_person.fname, value: other_person});
        });
    }

    hide() {
        const {showOtherPerson = false} = this.props;
        if (!showOtherPerson) {
            const {input} = this.refs;
            input && input.hide();
        }
        return this;
    }

    show() {
        const {showOtherPerson = false} = this.props;
        if (!showOtherPerson) {
            const {input} = this.refs;
            input && input.show();
        }
        return this;
    }

    get isOtherPerson() {
        return this.showOtherPerson;
    }
    
    renderItem(option, n) {
        if (!option) return null;
        
        let value;
        if(option.value) {
            value = option.value;
        } else {
            value = option;
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

    @computed
    get selectedItem() {
        const {selectedVal} = this.state;
        const {defaultValue, defaultUser} = this.props;
//        if(selectedVal) {
//            const {fname, lname, data} = selectedVal;
//            const label = `${fname || data.fname} ${lname || data.lname}`;
//            return {value: selectedVal, label};
//        } else {
        if (defaultValue) {
            if (defaultValue.label && defaultValue.value) {
                return defaultValue;
            }
            let {fname, lname, data} = defaultValue;
            const label = data ? (data.fname + ' ' + data.lname) : (fname + ' ' + lname);
//            console.log('selectedVal', label)
            return {value: defaultValue, label};
        } else if (defaultUser) {
//            const {user: value} = storage.loggedUser;
//            const {fname, lname} = value.data;
//            const label = (fname + ' ' + lname);
//            return {value, label};
        }
//        }
        return null;
    }

    render() {
        const {props} = this.state;
        if(!props) return null;
        const {parentClassName} = this.props;

        delete props.parentClassName;

        const {showOtherPerson = false} = this.props;
        if (showOtherPerson) {
            return <div className={'CustomPersonalInfoDialog SelectUserInput-CustomPersonalInfoDialog col-lg-12 flex' + (parentClassName ? ` ${parentClassName}` : '')}>
                <ClearableInput {...props}/>
                <React.Fragment>
                    <CustomPersonalInfoDialog ref="otherPersonDialog"/>
                    <Button className="btn btn-primary w-160 fixed-flex" onClick={this.onAddOtherPerson}>
                        <i className="fa fa-plus"/> Add Other Person
                    </Button>
                </React.Fragment>
            </div>;
        } else {
            return <ClearableInput {...props}/>;
        }
    }
}

function onAsyncSelectLoad(incContractors = false) {
    const listByLogged = sockets.of('users').fn('listByLogged');
    
    return listByLogged({
        removed: false,
        //
        incContractors,
        //
        exact_orgs: false,
        //
        limit: 0,
        offset: 0,
    }).then(list => {
        // console.log('listForSelectionByLogged', list)
        return list.map((value) => {
            const {id, data: {fname, lname, username, contractor}} = value;
            // const contractorName = contractor ? ` ${contractor.name}` : '';
            return {
                label: lname + ' ' + fname + ' (' + username + ')',
                value,
            };
        });
    });
}

export default SelectInput;
