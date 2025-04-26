import React from "react";
import {observer} from 'mobx-react';

import {Dates, execWhen} from 'utils/Utils';

@observer
class CertificateAccredited extends React.Component {

    constructor(props) {
        super(props);

    }
    
    componentDidMount() {
        execWhen(() => this.refs.logo).then(async logo_ref => {
            const {data: {company: {id}}} = this.props.item;
            const res = await workers.emit('plugin_sheq_assist/clients/profile-pic', id);
            if(res && res.dlUrls) {
                logo_ref.src = res.dlUrls[0];
            }
        });
    }

    render() {
        if (!this.props.item)
            return null;
        const {
            item: {
                id, data: {
                    created_at,
                    issued_date, accreditation_num, type, company, employee, training, trainer
                }
            }
        } = this.props;

        if (type !== 'Accredited')
            return null;

        console.log('item trainer', this.props.item)
        
        let {course_or_module} = training;
        course_or_module = isObject(course_or_module) ? (course_or_module.name || course_or_module.data.name) : (course_or_module || 'N/A');

        return <div className="row sec-group padding-t-10">
            <img ref="logo" className="image hor-center"/>
            <h5 className="header text-center margin-t-20 margin-b-20">{company.name}</h5>
            <h3 className="title text-center margin-b-20">Certificate Of Competency</h3>
            <p className="text text-center margin-t-10 margin-b-5">This is to certify that</p>
            <p className="employeeName text-center margin-b-10">{employee.fname + ' ' + employee.lname}</p>
            <p className="text text-center margin-t-10 margin-b-5">Identity/Passport Number</p>
            <p className="text text-center margin-t-10 margin-b-10"><b>{employee.id_num || employee.passport_num}</b></p>
            <p className="text text-center margin-t-10 margin-b-5">has successfully achieved competence against</p>  
            <p className="trainingName text-center margin-b-10">{course_or_module}</p>
            {/*<p className="text text-center margin-t-10 margin-b-10">ETQA approval number: ...............</p>*/}
            <p className="text text-center margin-t-10 margin-b-10">Aligned to Unit Standard <b>{training.unit_standard}</b> - NQF Level <b>{training.nqf_level}</b> - Total <b>{training.credits}</b> Credits</p>  
            <p className="text text-center margin-t-10 margin-b-10">Participate in <b>{course_or_module}</b> at workplace</p>  
            <div className="flex margin-t-50">
                <div className="fixed-flex min-w-300 margin-r-50">
                    <img src="" width="100%" height="100%"/>
                </div>
                <div>
                    <div className="flex margin-b-10">
                        <p className="text">Training Director</p> 
                        <p className="text"><b>{trainer ? (trainer.lname + ' ' + trainer.fname) : '..............................'}</b></p> 
                    </div>
                    <div className="flex margin-b-10">
                        <p className="text">Accreditation Number</p> 
                        <p className="text"><b>{accreditation_num}</b></p> 
                    </div>
                    <div className="flex margin-b-10">
                        <div>
                            <p className="text">IBM Ref Number</p> 
                            <p className="text">..............................</p> 
                        </div>
                        <div>
                            <p className="text">Date of Issue</p> 
                            <p className="text"><b>{Dates.formatDate(issued_date)}</b></p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="footerText text-center margin-t-40 margin-b-10">Issued without alteration or erasure as an original copy</p>
        </div>;
    }

}

@observer
class CertificateNonAccredited extends React.Component {

    constructor(props) {
        super(props);

    }
    
    componentDidMount() {
        execWhen(() => this.refs.logo).then(async logo_ref => {
            const {data: {company: {id}}} = this.props.item;
            const res = await workers.emit('plugin_sheq_assist/clients/profile-pic', id);
            if(res && res.dlUrls) {
                logo_ref.src = res.dlUrls[0];
            }
        });
    }

    render() {
        if (!this.props.item)
            return null;
        const {
            item: {
                id, data: {
                    created_at,
                    issued_date, accreditation_num, type, company, employee, training, trainer
                }
            }
        } = this.props;

        if (type !== 'Non-Accredited')
            return null;

        console.log('item trainer', this.props.item)

        let {course_or_module} = training;
        course_or_module = isObject(course_or_module) ? (course_or_module.name || course_or_module.data.name) : (course_or_module || 'N/A');

        
        return <div className="row sec-group padding-t-10">
            <img ref="logo" className="image hor-center"/>
            <h5 className="header text-center margin-t-20 margin-b-20">{company.name}</h5>
            <h3 className="title text-center margin-b-20">Certificate Of Competency</h3>
            <p className="text text-center margin-t-10 margin-b-5">This is to certify that</p>
            <p className="employeeName text-center margin-b-10">{employee.fname + ' ' + employee.lname}</p>
            <p className="text text-center margin-t-10 margin-b-5">Identity/Passport Number</p>
            <p className="text text-center margin-t-10 margin-b-10"><b>{employee.id_num || employee.passport_num}</b></p>
            <p className="text text-center margin-t-10 margin-b-5">has successfully achieved competence against</p>  
            <p className="trainingName text-center margin-b-10">{course_or_module}</p>
            {/*<p className="text text-center margin-t-10 margin-b-10">ETQA approval number: ...............</p>*/}
            <p className="text text-center margin-t-10 margin-b-10">Aligned to Unit Standard <b>{training.unit_standard}</b> - NQF Level <b>{training.nqf_level}</b> - Total <b>{training.credits}</b> Credits</p>  
            <p className="text text-center margin-t-10 margin-b-10">Participate in <b>{course_or_module}</b> at workplace</p>  
            <div className="flex w-400 margin-t-50 hor-center">
                <div>
                    <div className="flex margin-b-10">
                        <p className="text">Training Director</p> 
                        <p className="text"><b>{trainer ? (trainer.lname + ' ' + trainer.fname) : '..............................'}</b></p> 
                    </div>
                    <div className="flex margin-b-10">
                        <p className="text">Date of Issue</p>  
                        <p className="text"><b>{issued_date ? Dates.formatDate(issued_date) : '..............................'}</b></p> 
                    </div>
                </div>
            </div>
            <p className="footerText text-center margin-t-40 margin-b-10">Issued without alteration or erasure as an original copy</p>
        </div>;
    }

}

export {CertificateAccredited, CertificateNonAccredited};
