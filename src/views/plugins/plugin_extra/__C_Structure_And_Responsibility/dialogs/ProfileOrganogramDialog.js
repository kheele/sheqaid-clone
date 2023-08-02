// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import TypedWrapper from "./TypedWrapper";
import ProfilePDFReader from '../printers/ProfileOrganogramPDFReader';
// </editor-fold>
import style from "./ProfileOrganogramDialog.lazy.css";

@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ProfileOrganogramDialog";

    constructor(props) {
        super(props, style);
    }

    title() {
        return "Organogram";
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
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
    }

    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    async onSaveAsPDF(e, btn) {
        const {item, refs: {typedWrapper}} = this;
        if(typedWrapper) {
            const canvas = await typedWrapper.getPrintCanvas();
            this.refs.pdfReader.open({item, canvas});
        }
        //this.refs.pdfReader.open(this.item);
    }
    // </editor-fold>
    
    get item() {
        return this.props.state.item;
    }
    
    getClientPos(target) {
        let w, left;
        if(target === "Client") {
            w = 6;
            left = " pull-left-" + 3;
        } else if(target === "Project") {
            w = 4;
            left = " pull-left-" + 2;
        } else if(target === "Site") {
            w = 4;
            left = "";
        }
        return w + left;
    }
    
    render() {
        if (!this.item)
            return null;
        let {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog: {renderProfileCover}
            },
            item, item: {
                id, data: {
                    created_at,
                    _target, client, project, site, type, doc, list
                }
            }
        } = this;
        
        const {isContractor, isHasProjects} = storage.is;
        
        return <FormControls>
            {isHasProjects && <Row 
                rendered  
                active
                idx={0}
                title={(!isContractor && "Company / Project / ") + "Site"}
                onFormOpen={onFormOpen} 
                onFormNext={isHasProjects && onFormNext}
            >
                <ProfileField name="_target" placeholder="Organogram For" value={_target === "Client" ? "Company" : _target} required className="col-lg-6"/>
                <ProfileField name="type" placeholder="Organogram Source" value={type === "Upload" ? "PDF / Spreadsheet" : "Typed"} required className="col-lg-6"/>
                {!isContractor && <ProfileField name="client" placeholder="Company" value={client} renderer={v => v.name || v.data.name} required className={"col-lg-" + this.getClientPos(_target)}/>}
                {!isContractor && project && <ProfileField name="project" placeholder="Project" value={project} renderer={v => v.name || v.data.name} required className="col-lg-4"/>}
                {site && <ProfileField name="site" placeholder="Site" value={site} renderer={v => v.name || v.data.name} required className="col-lg-4"/>}
           </Row>}
            {doc && <Row 
                rendered 
                active={!isHasProjects}
                idx={1}
                title="1. Uploaded Organogram Structure" 
                onFormOpen={onFormOpen} 
                onFormBack={isHasProjects && onFormBack}
                onFormNext={onFormNext}
            >
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Document" 
                    type={['PDF', 'Word', 'Excel']}
                    showOnlyIcon 
                    readonly
                    className="col-lg-6 col-xs-12 hor-center"
                />
            </Row>}
            {list && <TypedWrapper ref="typedWrapper" onFormOpen={onFormOpen} onFormBack={onFormBack} list={list} readonly/>}
            <ProfilePDFReader ref="pdfReader"/>
        </FormControls>;
    }

}

export default ProfileDialog;
