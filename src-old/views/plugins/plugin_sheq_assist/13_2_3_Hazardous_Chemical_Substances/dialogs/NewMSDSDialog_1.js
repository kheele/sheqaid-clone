// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../utils/Form';

import {ANewDialog} from '../../../../../components/dialogs';
import {
    ClearableInput,
    SelectClientInput,
    SelectProjectInput,
    SelectSiteInput,
    UploadButton
} from '../../../../../components/inputs';
import {FormControls, Row} from '../../../../../components/FormComponents';

import {SelectChemicalCategoryInput, SelectChemicalManufacturerInput} from '../inputs';

import {changeColors} from './Utils';

import riskLevelImg from '../../../../../img/risk-assessment.png';
import style from "./NewMSDSDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewMSDSDialog extends ANewDialog {
    pageKey = "NewMSDSDialog";
    title = "Create Safety Data Sheet";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return  Controls;
    }
}
// </editor-fold>

@observer
class Controls extends React.Component {
    path = "plugin_sheq_assist/Hazardous_Chemical_Substances/msds/";

    // <editor-fold defaultstate="collapsed" desc="fields">
    @observable
    state = {
        lists: {
            risk_level: [{text: 'Low', value: 'Low'}, {text: 'Medium', value: 'Medium'}, {text: 'High', value: 'High'}, {text: 'Very High', value: 'Very High'}],
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        this.form.addChangeOne("risk_level", this.onChangeRiskLevel.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeRiskLevel">
    onChangeRiskLevel(el, risk_level) {
        const {props: {dialog}} = this;
        changeColors(dialog, risk_level);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 0) {
            if (!form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if(idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Safety Data Sheet / Product Name is required');
                return;
            }
            if (!form.isValid('category')) {
                infoDialog.open('Category is required');
                return;
            }
        }
        if(idx === 2) {
            if (!form.isValid('risk_level')) {
                infoDialog.open('Risk Assessment Level is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
           
        //0
        if (!form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        //1
        if (!form.isValid('name')) {
            infoDialog.open('Safety Data Sheet / Product Name is required');
            return;
        }
        if (!form.isValid('category')) {
            infoDialog.open('Category is required');
            return;
        }
        //2
        if (!form.isValid('risk_level')) {
            infoDialog.open('Risk Assessment Level is required');
            return;
        }
        //3
        if (!form.isValid('doc')) {
            infoDialog.open('Please Upload the Document');
            return;
        }
        
        const {
            client, project, site,
            name, category, manufacturer, risk_level, emergency_phone, 
            date_identified,
            doc
        } = form.data;
        const data = {
            name, category, risk_level, doc: doc.path
        };
        
        if(client) {
            if(client.id) {
                const {id, data: _data, name} = client;
                data.client = {id, name: name || _data.name};
                data.client_id = id;
            } else {
                data.client = client;
            }
        }
        if(project) {
            if(project.id) {
                const {id, data: _data, name} = project;
                data.project = {id, name: name || _data.name};
                data.project_id = id;
            } else {
                data.project = project;
            }
        }
        if(site) {
            if(site.id) {
                const {id, data: _data, name} = site;
                data.site = {id, name: name || _data.name};
                data.site_id = id;
            } else {
                data.site = site;
            }
        }
        
        if(manufacturer) {
            data.manufacturer = manufacturer;
        }
        if(emergency_phone) {
            data.emergency_phone = emergency_phone;
        }
        if(date_identified) {
            data.date_identified = date_identified.getTime();
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        neonBinding.events.emit(this.path + "create", data).then(res => {
            console.log("res", res)
            onSaved && onSaved(res);
            infoDialog.open("Record successfully saved.");
            infoDialog.close(2000);
            this.props.close();
        }).finally(() => {
            btn.text("Save").enabled();
        });
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen} = this.props;
        const {isConsultant} = storage.is;
        return <FormControls>
            <Row 
                rendered  
                active
                idx={0}
                title="Company / Project / Site" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext}
            >
                {isConsultant && <SelectClientInput name="client" placeholder="Company..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>}
                <SelectProjectInput name="project" placeholder="Project..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectSiteInput name="site" placeholder="Site..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={1}
                title="1. Safety Data Sheet Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="name" type="text" placeholder="Safety Data Sheet / Product Name" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectChemicalCategoryInput name="category" placeholder="Category..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <SelectChemicalManufacturerInput name="manufacturer" placeholder="Manufacturer..." className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="emergency_phone" type="text" placeholder="Emergency Phone No." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput name="date_identified" type="date" placeholder="Date Identified..." required className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row 
                rendered 
                idx={2}
                title="2. Risk Level Details" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack} 
                onFormNext={onFormNext}
            >
                <ClearableInput name="risk_level" type="radio" placeholder="Risk Level" required className="col-lg-9 pull-left-1_5 form-control" onChange={this.form.onChange} values={this.state.lists.risk_level}/>
                <p className="hor-center text-center padding-t-10 margin-t-20 w-full"><b>Please refer to the diagram below</b></p>
                <img src={riskLevelImg} width="100%"/>
            </Row>
            <Row 
                rendered 
                idx={3}
                title="3. Document" 
                onFormOpen={onFormOpen} 
                onFormBack={onFormBack}
            >
                <UploadButton 
                    name="doc" 
                    buttonTitle="Upload File (PDF or Word)" 
                    type={['PDF', 'Word']}
                    showOnlyIcon 
                    className="col-lg-12" 
                    onChange={this.form.onChange}
                />
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewMSDSDialog;
