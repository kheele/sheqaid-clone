import React from "react";
import {observer} from 'mobx-react';
import {extendObservable, observable, toJS} from 'mobx';

import style from "./EditDialog.lazy.css";

import {Dialog} from '../../../../components/dialogs';
import {ClearableInput} from '../../../../components/inputs';

@observer
class EditDialog extends React.Component {

	key = 0;
	onResponse;
	@observable state = {user: null};
	
	constructor(props) {
        super(props);
		
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
    }
	
	componentWillMount() {
		style.use();
	}
	
	componentWillUnmount() {
		style.unuse();
	}
	
	componentDidUpdate() {
		this.refs.dialog.open("Edit " + this.state.user.fname + "'s Profile");
	}
	
	open(user, onResponse) {
		this.state.user = user;
		this.onResponse = onResponse;
	}
	
	close() {
		this.refs.dialog.close();
	}
	
	render() {
		return (this.state.user && <Dialog
			key="edit-dialog"
			ref="dialog"
			className="edit-dialog"
			dialog={this}
		>
			<Controls user={this.state.user}/>
		</Dialog>);
	}
}

@observer
class Controls extends React.Component {

	@observable state = {
		fname: '',
		lname: '',
		email: '',
		phone: null
	};
	
    constructor() {
        super();
		
		this.onReset = this.onReset.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
    }
	
	componentWillMount() {
		extendObservable(this.state, toJS(this.props.user));
	}
	
	onReset(e) {
		this.refs.alert.hide();
		
		const submit = this.refs.submit;
		if(submit.disabled) {
			submit.innerText = "Submit";
			submit.disabled = false;
		}
	}
	
	onSubmit(e) {
		e.preventDefault();
		
		const alert = this.refs.alert;
		
		const fname = this.refs.fname;
		if(fname.value.isEmpty()) {
			alert.show(fname.getAttribute("data-required-msg"));
			return;
		}
		
		const lname = this.refs.lname;
		if(lname.value.isEmpty()) {
			alert.show(lname.getAttribute("data-required-msg"));
			return;
		}
		
		const email = this.refs.email;
		if(email.value.isEmpty()) {
			alert.show(email.getAttribute("data-required-msg"));
			return;
		} else if(!email.value.isEmailAddress()) {
			alert.show("Email address is not valid");
			return;
		}
		
		const phone = this.refs.phone;
		if(phone.value.isEmpty()) {
			alert.show(email.getAttribute("data-required-msg"));
			return;
		} else if(!phone.value.isPhoneNumber()) {
			alert.show("Your phone number is not valid");
			return;
		}
		
		const data = {
			fname: fname.value,
			lname: lname.value,
			email: email.value,
			phone: phone.value
		};
		
		alert.hide();
		
		const submit = this.refs.submit;
		submit.innerText = "Please wait...";
		submit.disabled = true;
		
		WWContactUsForm.emit("submit", data, success => {
			if(success) {
				alert.show("Your message was successfully sent. We'll get back to you as soon as possible.");
				this.props.fireReset();
			} else {
				alert.show("An error occurred. Please try again.");
			}
			submit.innerText = "Update";
			submit.disabled = false;
		});
	}
	
	render() {
		const props = {
			type: "text",
			className: "col-lg-6 col-md-6 col-sm-6 col-xs-6"
		};
		return (this.props.user && <div className="controls-wrapper" style={{width: 600}}>
			<ClearableInput ref="fname" placeholder="First Name *" defaultValue={this.props.user.fname} required="Please enter first name"
				onReset={(e, onChange) => {onChange(this.props.user.fname)}} 
				onChange={val => this.state.fname = val} 
				{...props} 
			/>
			<ClearableInput ref="lname" placeholder="Last Name *" defaultValue={this.props.user.lname} required="Please enter last name" 
				onReset={(e, onChange) => {onChange(this.props.user.lname)}} 
				onChange={val => this.state.lname = val} 
				{...props} 
			/>
			<ClearableInput ref="email" placeholder="Email Address *" defaultValue={this.props.user.email} required="Please enter email address" 
				onReset={(e, onChange) => onChange(this.props.user.email)} 
				onChange={val => this.state.email = val} 
				{...props} 
			/>
			
			<ControlAlert ref="alert"/>
			<div className="btn-controls">
				<button type="submit" ref="submit" className="btn btn-primary pull-right" onClick={this.onSubmit}>Update</button>
				<button type="reset" className="btn btn-default pull-right" onClick={this.onReset}>Reset</button>
			</div>
			<div className="clearfix"/>
		</div>);
	}
}

@observer
class ControlAlert extends React.Component {

	@observable text;
	
	show(text) {
		this.text = text;
	}
	
	hide() {
		!!this.text && (this.text = null);
	}
	
	render() {
		return !!this.text && <div ref="alert" className="alert alert-success">{this.text}</div>;
	}
}

EditDialog.propTypes = {
	//classes: PropTypes.object.isRequired
};

export default EditDialog;
