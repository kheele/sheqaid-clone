import React from "react";
import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';

import {onAsyncSelectLoadImpl} from '../../utils/AsyncSelect';

import CustomPersonalInfoDialog from '../dialogs/CustomPersonalInfoDialog';

import {Button, ClearableInput} from './';

import ASelectInput from './ASelectInput';

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
    }

    componentDidMount() {
        let {className = ''} = this.props;
        className += ` SelectUserInput`;
        
        this.state.props = {
            ref: "input",
            key: new Date().getTime(),
            name: "user",
            type: "select",
            placeholder: "Administrator/User...",
            onAsyncSelectLoad: onAsyncSelectLoad,
            returnValue: true,
            add: false,
            ...this.props,
//            onChange: this.form.onChange
            defaultValue: this.selectedItem,
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

function onAsyncSelectLoad(value) {
    return onAsyncSelectLoadImpl("users/list/search_by_name", value, value => {
        const {lname, fname, username} = value.data;
        return {label: lname + ' ' + fname + ' (' + username + ')', value};
    });
}

export default SelectInput;
