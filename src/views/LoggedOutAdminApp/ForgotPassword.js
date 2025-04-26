import React from 'react';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';
import {Button, ClearableInput} from 'components/inputs';

@observer
class ForgotPassword extends React.Component {

    @observable
    state = {
        display: false,
        lists: {
            type: [
                {text: 'User', value: 'User'},
                {text: 'Contractor', value: 'Contractor'},
                {text: 'Staff', value: 'Staff'}
            ]
        }
    };

    constructor() {
        super();

        this.onReset = this.onReset.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        this.form = new Form();
    }

    componentWillUnmount() {
        this.form = null;
    }

    show() {
        this.state.display = true;
    }

    hide() {
        this.form.reset();
        this.state.display = false;
    }

    onReset(e, btn) {

    }

    onSubmit(e, btn) {
        const {form} = this;

        if (!form.isValid('username')) {
            infoDialog.open('Username / Email Address is required');
            return;
        }
        if (!form.isValid('type')) {
            infoDialog.open('User Type is required');
            return;
        }

        const {username, type} = form.data;
        const data = {username, type};

        let path;
        if (type === "Contractor") {
            path = "plugin_sheq_assist/contractors/users/";
        } else if (type === "Staff") {
            path = "plugin_sheq_assist/employees/accounts/";
        } else {
            path = "users/accounts/";
        }

        console.log(data)

        btn.text("Wait...").disabled();
        workers.emit(path + "forgot-pass", data).then(res => {
            console.log("res", res)
            if (res) {
                infoDialog.open(<p>Email has been sent to you to recover your password.<br/><br/>Please login to your
                    email account to reset your password.</p>);
            } else {
                infoDialog.open('An error occurred. Please try again.');
            }
        }).finally(() => {
            btn.text("Email me recovery details").enabled();
        });
    }

    render() {
        return this.state.display && (<div className="controls scale-up-center forgot-password">
            <i className="fa fa-arrow-left pull-left" onClick={this.props.onBack}/>
            <label>Recover Password</label>
            <div className="row margin-t-20 margin-b-15">
                <p className="text-center">Don't worry, happens to the best of us.</p>
            </div>
            <div className="row">
                <ClearableInput name="username" type="email" placeholder="Username / Email Address" required
                                className="form-control" onChange={this.form.onChange}/>
                <ClearableInput name="type" type="radio" placeholder="User Type" vertical className="form-control"
                                onChange={this.form.onChange} values={this.state.lists.type}/>
            </div>
            <div className="row margin-t-10 margin-b-5">
                <Button ref="login" text="Email me recovery details" className="btn btn-primary save hor-center"
                        onClick={this.onSubmit}/>
            </div>
        </div>);
    }
}

export default ForgotPassword;