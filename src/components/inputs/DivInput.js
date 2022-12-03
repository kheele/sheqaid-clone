import React from "react";
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {action, computed, observable} from 'mobx';

//import "./nav-item.lazy.css";

@observer
class DivInput extends React.Component {
    className = 'input-list-item';
    refName;
	
    @observable fieldFocused = false;
    @observable value = '';
    defaultValue;
    @observable isClearable = true;

    constructor(props){
        super(props);
		
		this.setValue = this.setValue.bind(this);
		this.reset = this.reset.bind(this);
    }
    
    componentWillMount() {
        if(this.props.className){
            this.className += ' '+this.props.className;
        }

        if(typeof this.props.isClearable === "boolean"){
            this.isClearable = this.props.isClearable;
		}
    }

    componentDidMount() {
        const $this = this;
        if(this.props.defaultValue){
            if(!this.props.defaultValue.isEmpty()){
				const {...props} = this.props;
                this.value = toJS(props.defaultValue);
				this.defaultValue = this.value;
            }
        }
	
        new Autogrow(this.refs[this.refName], 16);
        setTimeout(function(){
            this.refs[this.refName].style.height = '16px';
        }.bind(this), 100);
        
		this.nodeJQ =window.$(this.refs[this.refName]).bind('keyup', this.setValue);
		this.nodeJQ.bind('focusin', evt => {
			$this.fieldFocused = true;
		});
		this.nodeJQ.bind('focusout', evt => {
            $this.fieldFocused = false;
        });
    }
	
    componentWillUnmount() {
        this.nodeJQ.unbind('keyup');
        this.nodeJQ.unbind('focusin');
        this.nodeJQ.unbind('focusout');
    }
	
    getInputNode(){
		return ReactDOM.findDOMNode(this);
    }
  
    @computed
    get hasValue() {
    	return this.value && ((typeof this.value === 'string' && this.value.length>0) || (this.value instanceof Date));
    }
	  
    @action
    setValue(evt) {
    	this.onChange(this.nodeJQ.text());
    }
  
    @action
    reset(evt) {
    	this.onChange('');
        this.refs[this.refName].innerText = "";
    	if(this.props.onReset){
            this.props.onReset(evt);
		}
    }
  
    @action
    onChange(value) {
    	if(this.props.onChange){
            this.value = value;
            this.props.onChange(this.value);
		}
    }
  
    render() {
        const props = this.props;
		
		if(this.props.className){
            props.className += ' ' + this.props.className;
		}
	
		props.ref = this.refName = this.props.ref || "divField";
		return (<div {...props} contentEditable className="text-input">
            {!this.fieldFocused ? (this.value.isEmpty() ? (<span style={{color: '#aaa'}}>{this.props.placeholder}</span> || null) : null) : null}
        </div>);
    }
}

DivInput.propTypes = {

};

export default DivInput;
