import React from "react";
import {observer} from 'mobx-react';
import {Dates} from '../../../../../../utils/Utils';

import {AProfileDialog} from '../../../../../../components/dialogs';
import {Clickable, ProfileField, UploadButton} from '../../../../../../components/inputs';
import {NavButtons} from '../../../../../../components/FormComponents';

import style from "./ProfileManualDocDialog.lazy.css";

@observer
class ProfileManualDocDialog extends AProfileDialog {
    pageKey = "ProfileManualDocDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Training Manual (Document)";
    }

    get controls() {
        return  Controls;
    }
}

@observer
class Controls extends React.Component {
    
    constructor(props) {
        super(props);
    }

    get item() {
        return this.props.state.item;
    }

    render() {
        if (!this.item)
            return null;
        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item: {
                id, data: {created_at, title, course_or_module, job_position, training_type, type, doc}
            }
        } = this;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                <div className="row active">
                    <label>
                        1. Training Manual Details
                        <Clickable idx={1} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group">
                        <ProfileField name="type" value={training_type} title="Training Type" className="col-lg-12"/>
                        <ProfileField name="title" title="Description" value={title} className="col-lg-12"/>
                        <ProfileField name="course_or_module" title="Course" value={course_or_module} renderer={v => isObject(v) ? (v.name || v.data.name) : v} className="col-lg-12"/>
                        <ProfileField name="job_position" title="Job Position" value={job_position} renderer={v => v.name} className="col-lg-12"/>
                    </div>
                    <NavButtons idx={1} onNext={onFormNext}/>
                </div>
                <div className="row row-doc">
                    <label>
                        2. Training Manual Document
                        <Clickable idx={2} onClick={onFormOpen}><i className="fa fa-angle-down icon-right pull-right"/></Clickable>
                    </label>
                    <div className="row sec-group h-80 pos-relative">
                        <UploadButton name="doc" buttonTitle="Training Manual (Document)" defaultValue={doc} showOnlyIcon readonly className="fixed-center"/>
                    </div>
                    <NavButtons idx={2} onBack={onFormBack}/>
                </div>
            </div>
        </div>;
    }

}

export default ProfileManualDocDialog;
