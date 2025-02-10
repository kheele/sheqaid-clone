// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {execWhen, SAIdUtils} from 'utils/Utils';
import {getGeocode} from 'utils/Maps';

// </editor-fold>

@observer
class AControls extends React.Component {
    
    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor() {
        super();

        this.form = new Form();
        this.form.addChangeOne("employee", this.onChangeEmployee.bind(this));
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentDidMount() {
        const {showOnlyTable} = this;
        
        getGeocode().then(res => {
            const {city, district, region, country} = res;
            execWhen(() => this.refs.province).then(province_ref => {
                province_ref.onChange({label: region, value: region});
            });
            if(district) {
                execWhen(() => this.refs.district).then(district_ref => {
                    district_ref.onChange({label: district, value: district});
                });
            }
        }).catch(err => {
            console.error(err)
        });
        
        execWhen(() => this.refs.business_id).then(business_id_ref => {
            const {selectedClientCovidBusinessId: businessId} = storage.selected;
            if(!businessId) {
                if(storage.is.isConsultant) {
                    infoDialog.open(<React.Fragment>
                        <p>The selected company does not have <b>Business ID</b></p>
                        <p>Please add Business ID</p>
                    </React.Fragment>);
                } else {
                    infoDialog.open(<React.Fragment>
                        <p>The company does not have <b>Business ID</b></p>
                        <p>Please add Business ID</p>
                    </React.Fragment>);
                }
                return;
            }
            business_id_ref.onChange(businessId);
        });
        
        execWhen(() => !!this.refs.employee && !!this.item).then(() => {
            if(this.item) {
                const {employee: employee_ref} = this.refs;
                const {data: {fname, lname}} = this.item;
                
                const {isEmployee} = storage.is;
                if(isEmployee) {
                    employee_ref.setEditable(true);
                }
                employee_ref.onChange({label: fname + ' ' + lname, value: this.item});
                if(isEmployee) {
                    employee_ref.setEditable(false);
                }
            }
        });
        
        if(showOnlyTable) {
            execWhen(() => this.item).then(({id, data: {optional_info}}) => {
                if(optional_info) {
                    const {job_position} = optional_info;
                    if(job_position) {
                        execWhen(() => !!this.refs.job_category).then(job_category_ref => {
                            const {name, data} = job_position;
                            job_category_ref.onChange({label: name || data.name, value: job_position});
                        });
                    }
                }
            });
        }
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onChange funs">
    onChangeEmployee(el, val) {
        const {employee} = this.state;
        if(val && employee && employee.id !== val.id) {
            this.state.employee = val;
        }
        
        execWhen(() => !!this.refs.employee_id && !!this.refs.sex && !!this.refs.age && !!this.refs.job_category).then(() => {
            const {
                employee_id: employee_id_ref, 
                sex: sex_ref, 
                age: age_ref, 
                job_category: job_category_ref
            } = this.refs;
            if(val) {
                let {id_num, passport_num, sex, age, dob, optional_info} = val.data;
                employee_id_ref && employee_id_ref.onChange(id_num || passport_num);
                if(id_num) {
                    sex = sex || SAIdUtils.getGender(id_num);
                    age = SAIdUtils.getAge(id_num);
                }
                if(!age && dob) {
                    age = SAIdUtils.getAgeFromDate(dob);
                }
                sex && sex_ref && sex_ref.onChange({label: sex, value: sex});
                age && age_ref && age_ref.onChange(age);
                if(optional_info) {
                    const {job_position} = optional_info;
                    if(job_position) {
                        const {name, data} = job_position;
                        job_category_ref && job_category_ref.onChange({label: name || data.name, value: job_position});
                    }
                }
            } else {
                employee_id_ref && employee_id_ref.reset();
                sex_ref && sex_ref.reset();
                age_ref && age_ref.reset();
            }
        });
    }
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="getters">
    get showOnlyTable() {
        return storage.is.isEmployee || this.props.dialog.extraProp('showOnlyTable');
    }
    
    get item() {
        if(storage.is.isEmployee) {
            const {user} = storage.loggedUser;
            return user;
        }
        return this.props.state.item;
    }
    // </editor-fold>
    
}

export default AControls;
