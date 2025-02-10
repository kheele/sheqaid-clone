import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField} from 'components/inputs';

import style from "./ProfileTaskDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileTaskDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Task";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {

    @observable
    state = {
        
    };
    
    constructor(props) {
        super(props);
        
        this.form = new Form();
    }
    
    componentDidMount() {
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {dialog: {renderProfileCover}},
            item, item: {
                id, data: {
                    created_at, title, desc, start, end
                }
            }
        } = this;
        return <div className="controls-wrapper">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="start" value={start} type="date" placeholder="Starts On" onChange={this.form.onChange}/>
                        <ProfileField name="end" value={end} type="date" placeholder="Ends On" onChange={this.form.onChange}/>
                    </div>
                </div>
                <div className="row">
                    <div className="row sec-group">
                        <ProfileField name="title" value={title} placeholder="Task" className="col-lg-12" onChange={this.form.onChange}/>
                        <ProfileField name="desc" value={desc} type="textarea" placeholder="Description" className="col-lg-12" onChange={this.form.onChange}/>
                    </div>
                </div>
            </div>
        </div>;
    }

}

export default ProfileDialog;