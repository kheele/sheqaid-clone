import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable, observable, toJS} from 'mobx';

import Form from "../../utils/Form";
import {createListSetter} from '../../utils/Utils';

@observer
class ATableSavable extends React.Component {
    static propTypes = {

    };

    @observable
    state = {
        list: [null],
        sortKey: null,
        edits: {
            
        }
    };
    form = {};
    ctrl_refs = {};

    constructor(props) {
        super(props);
        
        createListSetter.call(this);
        
        this.onLoadList = this.onLoadList.bind(this);
        this.renderItem && (this.renderItem = this.renderItem.bind(this));
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSetRef = this.onSetRef.bind(this);  
        
        this.onPostChange && (this.onPostChange = this.onPostChange.bind(this)); 
        this.onClickComplete && (this.onClickComplete = this.onClickComplete.bind(this));  

        const {defaultValue} = this.props;
        if(defaultValue) {
            this.state.list = defaultValue;
            const {onChange, name} = this.props;
            onChange && onChange(toJS(defaultValue.filter(v => !!v)), name, this);
        }
    }
    
    componentWillMount(){
    }

    onLoadList() {
        return Promise.resolve(this.state.list);
    }

    @computed get list() {
        return this.state.list.filter(val => !!val);
    }

    set list(value) {
        this.state.list = value;
        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.list), name, this);
        console.log(`set list: ${value}`)
    }

    set listNoChange(value) {
        this.state.list = value;
        console.log(`set listNoChange: ${value}`)
    }

    addFirst(value) {
        this.state.list.insertAt(0, value);
        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.list), name, this);
        console.log(`addFirst list: ${value}`)
    }

    add(value) {
        this.state.list.push(value);
        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.list), name, this);
        console.log(`add list: ${value}`)
    }

    edit(value, idx) {
        const {list} = this.state;
        list.removeAt(idx);
        list.insertAt(idx, value);

        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.list), name, this);
        console.log(`edit list: ${value}`)
    }

    removeAt(idx) {
        const {list} = this.state;
        list.removeAt(idx);

        const {onChange, name} = this.props;
        onChange && onChange(toJS(this.list), name, this);
        console.log(`removeAt list: ${idx}`)
    }

    onClick(e, el) {
        const {onClickComplete} = this;
        const {onChange, name, insertAt} = this.props;
        const {list} = this.state;
        let {action, idx} = el.props;
        if (action === "save" || action === "saveEdit") {
            const elems = Object.keys(this.ctrl_refs).map(k => this.ctrl_refs[k]);
            const errors = elems.filter(node => !node.hasValue && node.props.required);
            if (!errors.isEmpty()) {
                errors.forEach(node => {
                    node.setError && node.setError();
                });
                infoDialog.open("Fields highlighted red are required");
                return;
            } else {
                this.onPreprocessForm && this.onPreprocessForm(this.form);
                if(action === "save") {
                    if (this.insertAt) {
                        this.insertAt(list, this.form, idx);
                    } else {
                        list.push(this.form);
                    }
                } else {
                    const item = list[idx];
                    extendObservable(item, this.form);
                    const {edits} = this.state;
                    extendObservable(edits, {[idx]: false});
//                    delete edits[idx];
                    
                    list.removeAt(idx);
                    list.insertAt(idx, item);
                }
                
                onClickComplete && onClickComplete(e, el);
                
                elems.forEach(node => {
                    node.reset && node.reset();
                });
                this.form = {};
            }
        } else if (action === "edit") {
            setTimeout(() => {
                const {edits} = this.state;
                Object.keys(edits).forEach(key => {
                    extendObservable(edits, {[key]: false});
//                    delete edits[key];
                });
                extendObservable(edits, {[idx]: true});
                
                const item = list[idx];
                list.removeAt(idx);
                list.insertAt(idx, item);
                
                this.onClickComplete && this.onClickComplete(e, el);
            });
            return;
        } else if(action === "cancelEdit") {
            setTimeout(() => {
                const {edits} = this.state;
                extendObservable(edits, {[idx]: false});
                
//                const item = list[idx];
//                list.removeAt(idx);
//                list.insertAt(idx, item);
                
                this.onClickComplete && this.onClickComplete(e, el);
            });
            return;
        }else if (action === "delete") {
            list.removeAt(idx);
                
            onClickComplete && onClickComplete(e, el);
        }

        onChange && onChange(toJS(this.list), name, this);
//        alert(onChange)
    }

    onChange(val, _name, el) {
        let {name} = this.props;
        name = _name || name;
        el = el || this;
        if (Form.hasVal(val)) {
            this.form[name] = val;
        } else if (isNullable(val) || (val.isEmpty && val.isEmpty())) {
            name in this.form && delete this.form[name];
        }
        this.onPostChange && this.onPostChange(val, name, el);
    }

    onSetRef(ref) {
        if (!!ref) {
            const {props: {name}} = ref;
            this.ctrl_refs[name] = ref;
        }
    }
    
}

export default ATableSavable;
