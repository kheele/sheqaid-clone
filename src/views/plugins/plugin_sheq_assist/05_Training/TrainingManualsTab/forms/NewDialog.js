// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import Form from '../../../../../../utils/Form';

import {
    ClearableInput,
    SelectClientInput,
    SelectJobPositionInput,
    SelectProjectInput,
    SelectSiteInput,
    SelectTrainingCourseInput,
    UploadButton
} from '../../../../../../components/inputs';
import {Row} from '../../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../../components/dialogs';

import style from "./NewManualDialog.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewDialog extends ANewDialog {
    pageKey = "NewDialog";
    title = "Upload Training Manual";

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
    path = "plugin_sheq_assist/05_Trainings/manuals/";

    // <editor-fold defaultstate="collapsed" desc="state">
    @observable
    state = {
        lists: {
        }
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);
        
        this.form = new Form();
        
//        this.form.addChangeOne("training", this.onChangeTraining.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    componentDidMount() {
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onChangeTraining">
//    onChangeTraining(el, val) {
//        this.state.training = val;
//        execWhen(() => this.refs.job_position).then(() => {
//            const {job_position: job_position_ref} = this.refs;
//            if(val) {
//                const {course_or_module, job_title} = val.data;
//                job_title && job_position_ref.refs.input.onChange({label: job_title.name, value: job_title});
//                this.state.defaultValues.courses = course_or_module;
//            }
//        });
//    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if(idx === 0) {
            const {isConsultant} = storage.is;
            if (isConsultant && !form.isValid('client')) {
                infoDialog.open('Company is required');
                return;
            }
        }
        if(idx === 1) {
            if (!form.isValid('course_or_module')) {
                infoDialog.open('Course is required');
                return;
            }
        }
        
        return true;
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        const {form} = this;
        const {isConsultant, isNoProjects} = storage.is;
        
        //0
        if (isConsultant && !form.isValid('client')) {
            infoDialog.open('Company is required');
            return;
        }
        //1
        if (!form.isValid('course_or_module')) {
            infoDialog.open('Course is required');
            return;
        }
        //3
        if (!form.isValid('doc')) {
            infoDialog.open('Please Upload Training Manual');
            return;
        }
        
        const {
            client, project, site,
            course_or_module, desc,
            job_position_list, 
            doc
        } = form.data;
        const data = {course_or_module};
        
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
        
        if(desc) {
            data.desc = desc;
        }
        
        if (job_position_list) {
            data.job_position_list = job_position_list.map(({id, data: {name}}) => {
                return {id, name};
            });
        } 
        
        if(doc.thumbnail) {
            data.doc = {thumbnail: doc.thumbnail, video: doc.path};
        } else {
            data.doc = doc.path;
        }
        
        console.log(data)

        btn.text("Saving...").disabled();
        workers.emit(this.path + "create", data).then(res => {
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
        const {isConsultant, isNoProjects} = storage.is;
        return (<div className="controls-wrapper controls-sectioned">
            <div className="controls">
                {!isNoProjects && <Row 
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
                </Row>}
                <Row 
                    rendered 
                    active={isNoProjects}
                    idx={1}
                    title="1. Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={!isNoProjects && onFormBack} 
                    onFormNext={onFormNext}
                >
                    <SelectTrainingCourseInput name="course_or_module" placeholder="Course..." className="col-lg-12 form-control" onChange={this.form.onChange} add={false}/>
                    <ClearableInput name="desc" type="text" placeholder="Description" required className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={2}
                    title="2. Job Details" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack} 
                    onFormNext={onFormNext}
                >
                    <SelectJobPositionInput name="job_position_list" type="select_multiple" placeholder="Job Position(s)..." required desc="Job Position(s) For Training Conducted" className="col-lg-12 form-control" onChange={this.form.onChange}/>
                </Row>
                <Row 
                    rendered 
                    idx={3}
                    title="3. Upload Training Manual Document" 
                    onFormOpen={onFormOpen} 
                    onFormBack={onFormBack}
                >
                    <UploadButton 
                        name="doc" 
                        buttonTitle="Upload File (PDF, Word or Video)" 
                        type={['PDF', 'Word', 'Video']}
                        showOnlyIcon 
                        className="col-lg-12" 
                        onChange={this.form.onChange}
                    />
                </Row>
            </div>
        </div>);
    }
    // </editor-fold>
}

export default NewDialog;
