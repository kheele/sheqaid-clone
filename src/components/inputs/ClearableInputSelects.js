import React from "react";
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {action, isObservableArray, isObservableObject, observable, toJS} from 'mobx';

// import Chip from '@material-ui/core/Chip';
import Chip from '@mui/material/Chip';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popper from '@material-ui/core/Popper';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
// import {Autocomplete} from '@mui/material';
// import {createFilterOptions} from '@mui/material/Autocomplete';

const filter = createFilterOptions();

//import style from "./ClearableInputSelects.lazy.css";

@observer
class ClearableInputSelects extends React.Component {

    @observable state = {
        loading: false,
        options: [],
        selected: [],
    };
    
    constructor(props) {
        super(props);
        
        this.onLoadList = this.onLoadList.bind(this);
        this.renderTextField = this.renderTextField.bind(this);
        this.renderSelectItem = this.renderSelectItem.bind(this);
        this.renderTags = this.renderTags.bind(this);

        if(!props.onAsyncSelectLoad) {
            const {values} = props;
            this.state.options = ('values' in props && values) ? values.map(this.renderSelectItem) : [];
        }
    }

    componentWillMount() {
        let {inputProps: {multiple}, state: {value}} = this.props;
        if(multiple) {
            if(!isArray(value) && !isObservableArray(value)) {
                if(isNullable(value) || value.isEmpty()) {
                    value = [];
                } else {
                    value = [value];
                }
                this.state.selected = value;
            } else {
                this.state.selected = [...value];
            }
            console.log('this.state.selected', this.state.selected)
        }
    }
    
    open() {
//        if(!this.props.onAsyncSelectLoad) {
            $(findDOMNode(this).querySelector('input')).click();
//        }
    }
            
    renderSelectItem(value, n) {
        const {renderItem} = this.props;
        if(renderItem) return renderItem(value, n);
        if(!isObject(value)) return {label: isString(value) ? value : String(value), value};
        return value;
    }
    
    renderTags(tagValue, getTagProps) {
        const {state, inputProps: {readonly, onChange}} = this.props;
       // console.log('renderTags', tagValue)
        return tagValue.map((option, index) => {
            return <Tag index={index} readonly={readonly} option={option} getTagProps={getTagProps} state={this.state} valueState={state} onChange={onChange}/>;
        });                        
    }
    
    renderTextField(params) {
        const InputProps= {
            ...params.InputProps,
            endAdornment: <React.Fragment>
                {this.state.loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
            </React.Fragment>
        };
        return <TextField {...params} placeholder={this.props.inputProps.placeholder} />
    }
    
    @action
    setOptions(list) {
        this.state.options = list;
    }
    
    @action
    async onLoadList(promise){
        if(promise && (promise instanceof Promise || isFunction(promise))) {
            this.state.loading = true;
            this.state.options.clear();
            const list = isFunction(promise) ? await promise() : await promise.then(res => res);
            this.setOptions(list); 
            this.state.loading = false;
        }
    }
    
    render() {
        const {
            inputProps, 
            inputProps: {
                id, style,//used//inputProps
                className,//
                placeholder, onChange, onInputChange,//used
                onUpdate,
                isMulti, multiple,//used
                onFilter,
//                isSearchable,// unused,
//                onClick,// unused,
                defaultValue
            }, 
            onAsyncSelectLoad, onShowAddInput, add, create, save, values, state
        } = this.props;
        
        const props = {
            id, style,//
            defaultValue,
            value: defaultValue,
            openOnFocus: true,
            getOptionLabel: option => {
                if(option === null || option === undefined) {
                    return "";
                }
//                console.log('getOptionLabel', option)
//                console.log('getOptionLabel', option)
                // Value selected with enter, right from the input
                if (typeof option === 'string') return option;
                // Add "xxx" option created dynamically
                if (option.inputValue) return option.inputValue;
                if (option.create) return option.value;
                
                if(onFilter && isFunction(onFilter)) {
                    return onFilter(option);
                }
                // Regular option
                return isString(option.label) ? option.label : String(option.label);
            },
            renderOption: option => {
                if(option === null || option === undefined) {
                    return null;
                }
//                console.log('renderOption', option)
                // Value selected with enter, right from the input
                if (typeof option === 'string') return option;
                // Add "xxx" option created dynamically
                if (option.inputValue) return option.inputValue;
                // Regular option
                return option.label;
            },
            renderInput: this.renderTextField
        };
        
        if(isMulti || multiple) {
            props.multiple = true;
            props.renderTags = this.renderTags;
            props.onChange = (evt, newValue, action, value) => {
                // console.log('onChange', newValue, action, value)

                const {selected} = this.state;
                if(action === "remove-option") {
                    selected.removeIf(v1 => {
                        return JSON.stringify(v1) === JSON.stringify(value.option);
                    });
                    const removedVal = value.option.value;
                    onUpdate && onUpdate(evt, removedVal, 'REMOVED');
                    console.log('ClearableInputSelects onRemoved', removedVal);
                } else {
                    newValue = newValue.filter(({label, value, create}, n) => {
                        return !!label || create;
                    });
                    if ((onShowAddInput || add || create || save) && newValue) {
                        newValue = newValue.map(({label, value, create}, n) => {
                            if (create) {
                                return value;
                            }
                            return {label, value};
                        });
                    }

                    newValue = newValue.filter(v => !(v === null || v === undefined));

                    const removed = selected.removeAllIf(v1 => {
                        return newValue.anyMatch(v2 => JSON.stringify(v1) === JSON.stringify(v2));
                    });
                    newValue = newValue.filter(v1 => {
                        return removed.noneMatch(v2 => JSON.stringify(v1) === JSON.stringify(v2));
                    });

                    selected.push(...newValue);

                    const addedVal = newValue[0];
                    onUpdate && onUpdate(evt, addedVal && addedVal.value, 'ADDED');
                    console.log('ClearableInputSelects onAdded', addedVal && addedVal.value);
                }

                onChange(selected);
            };
        } else {
            props.onChange = (evt, newValue) => {
                if((onShowAddInput || add || create || save) && newValue && newValue.create) {
                    newValue = newValue.value;
                }

                onChange(newValue);
//                console.log('newValue', newValue)
            };
        }
        
        props.onInputChange = async (evt, value) => {
            if(onAsyncSelectLoad) {
                await this.onLoadList(onAsyncSelectLoad(value));
            }
            onInputChange(evt, value);
        };
        
        const hasNew = onShowAddInput || add || create || save;
        props.filterOptions = (options, params) => {
            const filtered = filter(options, params);
            if (hasNew && params.inputValue !== '') {
                filtered.push({
                    value: params.inputValue,
                    label: `Add "${params.inputValue}"`,
                    create: true
                });
            }
            return filtered.filter(v => !(v === null || v === undefined));
        };
        props.getOptionSelected = function(option, value) {
            // console.log('getOptionSelected', 'option', 'value', option, value)
            if(option === null || option === undefined) {
                return false;
            }
            if(value === null || value === undefined) {
                return false;
            }

            // console.log('option', 'value', option, value)
            // if(state.value === null || state.value === undefined) {
            //     return false;
            // }
            // if(!isArray(state.value) && !isObservableArray(state.value)) {
            //     return false;
            // }

            if(value === option) {
                return true;
            }

            if(isString(value) && isObject(option)) {
                return value === option.label || value === option.value;
            }
            if(isObject(value) && isObject(option)) {
                return value.label === option.label || value.value === option.value;
            }
            if((!isArray(value) && !isObservableArray(value)) && (isObject(value) && isString(option))) {
                return option === value.label || option === value.value;
            }

            return false;

            // return state.value.filter(v => !(v === null || v === undefined)).anyMatch(v => {
            //     if(isString(v) && isString(option)) {
            //         return v === option;
            //     }
            //     if(isString(v)) {
            //         return v === option.label || v === option.value;
            //     }
            //     if(isString(option)) {
            //         return option === v.label || option === v.value;
            //     }
            //     if((isObject(v) || isObservableObject(v)) && (isObject(option) || isObservableObject(option))) {
            //         return v.label === option.label || v.value === option.value;
            //     }
            //     if((isObject(v) || isObservableObject(v))) {
            //         return v.label === option || v.value === option;
            //     }
            //     if((isObject(option) || isObservableObject(option))) {
            //         return option.label === v || option.value === v;
            //     }
            //     return false;
            // });
        };
        if(hasNew) {
            props.selectOnFocus = true;
            props.clearOnBlur = true;
        }
//        if(state) {
//            props.dafaultValue = state.value;
//        }

        let {options} = this.state;
        options = isObservableArray(options) ? toJS(options) : options;
        
        return <AutocompleteWrapper props={props} options={options} state={this.state} valueState={state}/>;
    }

}

@observer
class Tag extends React.Component {

    @observable state = {
        removed: false,
    };

    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);
    }

    onDelete() {
        const {index, readonly, option, getTagProps, state, valueState, onChange} = this.props;
        if(readonly) return;

        const {selected} = state;
        selected.removeIf(v1 => {
            return JSON.stringify(v1) === JSON.stringify(option);
        });
        valueState.value = selected;
        console.log('onDelete', selected.slice())
        onChange(selected);

        this.state.removed = true;
    }

    render() {
        if(this.state.removed) return null;

        const {index, option, getTagProps} = this.props;
        const label = isString(option) ? option : (option.create ? option.value : option.label);
        const tabProps = getTagProps({index});
        return <Chip
            label={label}
            onDelete={this.onDelete}
            {...tabProps}
        />;
    }
}

@observer
class AutocompleteWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {props, props: {multiple}, options, state: {selected, loading}, valueState: {value}} = this.props;
        // console.log('AutocompleteWrapper', options)
        if(multiple) {
            value = selected;
        }
        return <Autocomplete
            {...props}
            value={value}
            options={options}
            filterSelectedOptions
            autoComplete
            loading={loading}
            PopperComponent={PopperWrapper}
        />;
    }

}
const PopperWrapper = function (props) {
   return <Popper {...props} style={{width: 'fit-content', maxWidth: 480}} placement="bottom-start" />;
};

export default ClearableInputSelects;
