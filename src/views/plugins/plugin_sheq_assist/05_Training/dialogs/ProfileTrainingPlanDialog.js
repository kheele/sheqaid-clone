// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Dates} from '../../../../../utils/Utils';

import {ProfileField} from '../../../../../components/inputs';
import {Row} from '../../../../../components/FormComponents';
import {AProfileDialog} from '../../../../../components/dialogs';

import style from "./ProfileTrainingPlanDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileTrainingPlanDialog";
  
    constructor(props) {
        super(props, style);
    }

    title() {
        return "Training Plan";
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    
    @observable
    state = {
        lists: {
        }
    };
    
    constructor(props) {
        super(props);
        
        this.form = new Form();
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
            item, item: {
                id, data: {
                    created_at, 
                    client, project, site,
                    list
                }
            }
        } = this;
        
        const {isConsultant, isNoProjects} = storage.is;
        
        return <div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {renderProfileCover(<React.Fragment>
                    <h5>{'Created On ' + Dates.formatDate(created_at)}</h5>
                </React.Fragment>)}
                {!isNoProjects && <Row 
                    rendered  
                    active
                    idx={0}
                    title="Company / Project / Site" 
                    onFormOpen={onFormOpen} 
                    onFormNext={onFormNext}
                >
                    {isConsultant && <ProfileField name="client" title="Company" value={client} renderer={val => val.name || val.data.name} className="col-lg-12"/>}
                    <ProfileField name="project" title="Project" value={project} renderer={val => val.name || val.data.name} className="col-lg-12"/>
                    <ProfileField name="site" title="Site" value={site} renderer={val => val.name || val.data.name} className="col-lg-12"/>
                </Row>}
                <Row 
                    rendered 
                    active={isNoProjects}
                    idx={1}
                    title="1. Training Plan Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={!isNoProjects && onFormBack} 
                >
                
                </Row>
            </div>
        </div>;
    }

}

export default ProfileDialog;
