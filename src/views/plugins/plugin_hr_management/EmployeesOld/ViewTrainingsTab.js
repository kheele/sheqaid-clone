// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {Button} from 'components/inputs';
import {Row} from 'components/FormComponents';

import {ViewCertificatesTab} from '../Competencies';
import {
    CertificateAccredited,
    CertificateNonAccredited
} from 'views/plugins/plugin_sheq_assist/05_Training/dialogs/CertificateComponents';
import {
    EmployeeTrainingMatrixTable,
    EmployeeTrainingPlanTable,
    EmployeeTrainingRegisterTable
} from 'views/plugins/plugin_sheq_assist/05_Training/dialogs/ComponentsEmployeeTraining';
import NewTrainingPlanForEmployeeDialog
    from '../../plugin_sheq_assist/05_Training/TrainingPlanTab/forms/NewTrainingPlanForEmployeeDialog';

// </editor-fold>

@observer
class TrainingsTab extends React.Component {
    pageKey = "TrainingsTab";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
        
        this.onCreateTrainingPlan = this.onCreateTrainingPlan.bind(this);
        this.onCreateTrainingMatrix = this.onCreateTrainingMatrix.bind(this);
        this.onCreateTrainingRegister = this.onCreateTrainingRegister.bind(this);
        this.onCreateCertificate = this.onCreateCertificate.bind(this);
        
        this.renderItem = this.renderItem.bind(this);
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onCreateTrainingPlan">
    onCreateTrainingPlan() {
        this.refs.newTrainingPlanForEmployeeDialog.open(this.props.item).then(res => {
            
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onCreateTrainingMatrix">
    onCreateTrainingMatrix() {
        
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onCreateTrainingRegister">
    onCreateTrainingRegister() {
        
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="onCreateCertificate">
    onCreateCertificate() {
        
    }
    // </editor-fold>
    
    renderItem(item, n, onClick) {
        const {data: {created_at, issued_date, accreditation_num, type, company, employee, training, trainer}} = item;
        
        return <div className="row item-wrapper padding-t-10 h-full CertificateComponents">
            <CertificateAccredited item={item}/>
            <CertificateNonAccredited item={item}/>
        </div>;
    }
    
    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {
            onFormNext, onFormBack, onFormOpen,
            item, item: {
                id, data: {
                    training_certificate_list = [],
                    training_plan_list = [],
                    training_matrix_list = [],
                    training_register_list = []
                }
            },
            idx
        } = this.props;
    
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls pos-relative">
                    <Row 
                        rendered 
                        idx={idx + ".1"} 
                        title={idx + ".1 Training Plan"}  
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                    >
                        {!storage.is.isEmployee && <label>
                            <Button className="btn btn-primary padding-l-10 padding-r-10 padding-t-5 padding-b-5" text="Create" onClick={this.onCreateTrainingPlan}/>
                        </label>}
                        <EmployeeTrainingPlanTable defaultValue={training_plan_list}/>
                        <NewTrainingPlanForEmployeeDialog ref="newTrainingPlanForEmployeeDialog"/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".2"} 
                        title={idx + ".2 Training Matrix"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        {!storage.is.isEmployee && <label>
                            <Button className="btn btn-primary padding-l-10 padding-r-10 padding-t-5 padding-b-5" text="Create" onClick={this.onCreateTrainingMatrix}/>
                        </label>}
                        <EmployeeTrainingMatrixTable defaultValue={training_matrix_list}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".3"} 
                        title={idx + ".3 Training Register"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        {!storage.is.isEmployee && <label>
                            <Button className="btn btn-primary padding-l-10 padding-r-10 padding-t-5 padding-b-5" text="Create" onClick={this.onCreateTrainingRegister}/>
                        </label>}
                        <EmployeeTrainingRegisterTable defaultValue={training_register_list}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".4"} 
                        title={idx + ".4 Competency Certificates"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack}
                    >
                        {!storage.is.isEmployee && <label>
                            <Button className="btn btn-primary padding-l-10 padding-r-10 padding-t-5 padding-b-5" text="Create" onClick={this.onCreateCertificate}/>
                        </label>}
                        <ViewCertificatesTab item={item}/>
                            {/*list.isEmpty() && <p className="no-results fixed-center font-size-20">No Competency Certificates Available</p>*/}
                            {/*!list.isEmpty() && <Slider 
                                name="training-carousel" 
                                renderer={this.renderItem} 
                                list={list} 
                                splitBy={1} 
                                colSize="col-lg-12" 
                                onClick={this.onClick}/>
                            */}
                    </Row>
                </div>
            </div>
        </div>;
    }
    // </editor-fold>
}

export default TrainingsTab;
