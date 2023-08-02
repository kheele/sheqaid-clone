import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Button, UploadButton} from 'components/inputs';
import {Slider} from 'components/lists';

import {ContractDetails, SalaryInfo} from './ContractComponents';

import {EditDialog, NewDialog, ProfileDialog} from './forms';

@observer
class ContractsTab extends React.Component {
    pageKey = "ContractsTab";
    
    @observable
    state = {
    };

    constructor(props) {
        super(props);
                     
        this.onCreate = this.onCreate.bind(this); 
        this.renderItem = this.renderItem.bind(this);
    }
    
    onCreate() {
        this.refs.newContractDialog.open(this.props.item);
    }
    
    renderItem(item, n, onClick) {
        const {
            props: {
                onFormNext, onFormBack, onFormOpen
            }
        } = this;
        const {data: {created_at, salary_info, contract_details, doc, job_profile_doc}} = item;
        let expiry, isTrial;
        if(contract_details) {
            const {expiry_date, end_of_trial_period} = contract_details;
            if(expiry_date) {
                expiry = expiry_date;
            } else if(end_of_trial_period) {
                expiry = end_of_trial_period;
                isTrial = true;
            }
        }
        
        return <div className="row item-wrapper padding-t-10 h-full">
            <label className="w-full margin-l-10 margin-r-10 margin-b-0 text-center">Contract Details</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <ContractDetails ref="contractDetailsTab" defaultValue={contract_details}/>
            </div>
            <hr className="margin-t-15 margin-l-10 margin-r-10 margin-b-15"/>
            <label className="w-full margin-l-10 margin-r-10 text-center">Salary Information</label>
            <div className="row margin-l-10 margin-r-10 row-details">
                <SalaryInfo ref="salaryInfoTab" defaultValue={salary_info}/>
            </div>
            <hr className="margin-t-15 margin-l-10 margin-r-10 margin-b-10"/>
            <label className="w-full margin-b-5 text-center">Document(s)</label>
            <div className="row margin-l-0 margin-r-0 row-doc sec-group">
                <UploadButton 
                    name="doc" 
                    defaultValue={doc}
                    buttonTitle="Contract Document Attachment" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField col-lg-6"
                />
                <UploadButton 
                    name="doc" 
                    defaultValue={job_profile_doc}
                    buttonTitle="Job Profile Document Attachment" 
                    type={['PDF', 'Word', 'Image']}
                    showOnlyIcon 
                    readonly
                    className="ProfileField col-lg-6"
                />
            </div>
        </div>;
    }
    
    render() {
        const {
            item: {
                id, data: {
                    employee_contract_list = {}
                }
            }
        } = this.props;
        
        let list = Object.keys(employee_contract_list).map(id => {
            return {id, expiry_date: employee_contract_list[id].expiry_date || null};
        });
        list.sortBy('expiry_date', 'desc');
//        console.log('employees', list.map(({id, expiry_date}) => {
//            return Dates.formatDate(expiry_date);
//        }))
        list = list.map(({id, expiry_date}) => {
            return {id, data: employee_contract_list[id]};
        });
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper h-full">
                <div className="controls pos-relative h-full">
                    {!storage.is.isEmployee && <Button className="btn btn-primary btn-create" onClick={this.onCreate}>
                        Create Contract
                    </Button>}
                    {list.isEmpty() && <p className="no-results fixed-center font-size-20 text-center">No Contracts Available</p>}
                    {!list.isEmpty() && <Slider 
                        name="contract-carousel" 
                        renderer={this.renderItem} 
                        list={list} 
                        splitBy={1} 
                        colSize="col-lg-12" 
                        onClick={this.onClick}/>}
                </div>
            </div>
            <NewDialog ref="newContractDialog"/>
        </div>
    }
}

export default ContractsTab;