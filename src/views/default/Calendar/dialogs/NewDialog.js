import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {ClearableInput} from 'components/inputs';
import ANewDialog from 'components/dialogs/ANewDialog';

import style from "./NewDialog.lazy.css";

@observer
class NewDialog extends ANewDialog {
    path = "plugin_sheq_assist/emergency-management/emergency-numbers/";
    pageKey = "NewDialog";
    title = "Add Event";

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
        lists: {

        }
    };

    constructor() {
        super();

    }

    render() {
        return (<div className="controls-wrapper">
            <div className="controls">
                <div className="row">
                    <div className="row sec-group">
                        <ClearableInput name="agenda" type="text" placeholder="Agenda" required className="col-lg-4 form-control" onChange={this.onChange}/>
                        <ClearableInput name="date" type="date" placeholder="Date" required className="col-lg-4 form-control" onChange={this.onChange}/>
                        <div className="col-lg-4 col-dates">
                            <ClearableInput name="time_from" type="time" placeholder="Time From" required className="col-lg-6 form-control" onChange={this.onChange}/>
                            <ClearableInput name="time_to" type="time" placeholder="Time To" required className="col-lg-6 form-control" onChange={this.onChange}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <label>Invite Participants</label>
                    <div className="row sec-group">
                        <ClearableInput name="participant" type="email" placeholder="Participant Email Address" required className="col-lg-4 form-control" onChange={this.onChange}/>
                    </div>
                </div>
            </div>
        </div>);
    }
}

export default NewDialog;
