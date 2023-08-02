import React from "react";
import {observer} from 'mobx-react';

import {Button, ProfileField, UploadButton} from 'components/inputs';
import {Slider} from 'components/lists';

import NewVaccineCertificateDialog from './NewVaccineCertificateDialog';

@observer
class VaccineCertificatesTab extends React.Component {
    pageKey = "VaccineCertificatesTab";

    constructor(props) {
        super(props);
        
        this.onCreate = this.onCreate.bind(this);        
        this.renderItem = this.renderItem.bind(this);
    }
    
    onCreate() {
        this.refs.newVaccineCertificateDialog.open(this.props.item);
    }
    
    renderItem(item, n, onClick) {
        const {data: {created_at, annexture_3, restrictions, expiry_date, doc}} = item;
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Vaccine Certificate Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ProfileField title="Expiry Date" name="expiry_date" type="date" value={expiry_date} className="col-lg-6"/>
                <ProfileField title="Annexture 3?" name="annexture_3" value={annexture_3} className="col-lg-6"/>
                <ProfileField title="Restrictions" name="restrictions" value={restrictions} className="col-lg-12"/>
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Document" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField col-lg-6 pull-left-3"
                />
            </div>
        </div>;
    }

    render() {
        const {
            item: {
                id, data: {
                    employee_vaccine_certificate_list = {}
                }
            }
        } = this.props;
        
        let list = Object.keys(employee_vaccine_certificate_list).map(id => {
            return {id, expiry_date: employee_vaccine_certificate_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        console.log('employees', list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        }))
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_vaccine_certificate_list[id]};
        });
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                <div className="controls pos-relative padding-0">
                    {!storage.is.isEmployee && <Button className="btn btn-primary btn-create" onClick={this.onCreate}>
                        Create Vaccine Certificate
                    </Button>}
                    {list.isEmpty() && <p className="no-results fixed-center font-size-20">No Vaccine Certificates Available</p>}
                    {!list.isEmpty() && <Slider 
                        name="medical-certificate-carousel" 
                        renderer={this.renderItem} 
                        list={list} 
                        splitBy={1} 
                        colSize="col-lg-12" 
                        onClick={this.onClick}/>}
                </div>
            </div>
            <NewVaccineCertificateDialog ref="newVaccineCertificateDialog"/>
        </div>;
    }
}

export default VaccineCertificatesTab;