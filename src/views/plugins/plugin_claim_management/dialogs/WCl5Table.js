// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';
import {computed, extendObservable} from 'mobx';

import {Dates} from 'utils/Utils';

import ANewListTable from 'components/FormTableComponents/ANewListTable';
import {THead, TRow} from 'components/tables';
import {Button, ClearableInput, PDFUploadButton} from 'components/inputs';
import ButtonGeneratePDF from './ButtonGeneratePDF';
import ButtonWCl from './ButtonWCl';

import style from "./WCl5Table.lazy.css";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="WCl5Table">
@observer
class WCl5Table extends ANewListTable {
    className = "WCL5Table w-full-calc-add-10 -margin-t-5 -margin-l-10 -margin-r-10";
    title = "W.Cl.5";
    style = style;
    
    constructor(props) {
        super(props);
        
        extendObservable(this.selfState, {
            lists: {
                types: [
                    {text: 'Fill Form', value: 'Form', checked: false},
                    {text: 'Upload File', value: 'Upload', checked: false},
                    {text: 'Send Form To Medical Practitioner', value: 'Email', checked: false}
                ]
            },
            wcl_5: null,
            type: null
        });

        this.onChangeInternal = this.onChangeInternal.bind(this);
        this.onClickComplete = this.onClickComplete.bind(this);
        this.onComplete = this.onComplete.bind(this);
    }
    
    onChangeInternal(val, el) {
        this.selfState.type = val;
    }
    
    onPostChange(val, name, el) {
        const {idx} = el.props;
        if(name === 'wcl_5') {
            this.selfState.wcl_5 = val;
        }
//        onChange && onChange(val, this.props.name, this);
    }
    
    onClickComplete(evt, el) {
        let {idx, action} = el.props;
        if(action === 'save' || action === 'saveEdit') {
            if(this.selfState.wcl_5) {
                this.selfState.wcl_5 = null;
            }
        } else if(action === 'edit') {
            const {list} = this.state;
            const item = list[idx];
            if(item) {
                const {wcl_5_external_doc, doctor_email, wcl_5} = item;

                this.selfState.type = wcl_5_external_doc ? 'Upload' : doctor_email ? 'Email' : 'Form';
            }
//            alert(`idx: ${idx} - ${action}`)
        }
    }
    
    onComplete(value, btn) {
        const {idx} = btn.props;
        this.onChange(value, 'wcl_5', btn);
    }
    
    renderItem(n, onClick) {
        const {readonly, onNewDialog, onViewDialog, onPrintDialog, findById} = this.props;
        const {list, edits} = this.state;
        const isEditting = edits[n];
        const item = list[n];
        if(item) {
            if(isEditting) {
//                alert('isEditting')
                return <WCL5TableNewRow 
                    idx={n} 
                    item={item}
                    state={this.selfState} 
                    edits={edits}
                    valuesInputOption={this.selfState.lists.types}
                    isEditting={isEditting}
                    onSetRef={this.onSetRef}
                    onChangeInternalInputOption={this.onChangeInternal}
                    onChange={this.onChange}
                    onComplete={this.onComplete}
                    onClick={onClick} 
                    onNewDialog={onNewDialog}
                />;
            } else {
                if(item.wcl_5_external_doc) {
                    const {wcl_5_external_doc} = item;
            
                    return <TRow key={n} className="tr-readonly w-full margin-r-0">
                        <div className="td fixed-flex flex flex-align-top min-w-30"><span className="margin-t-10">{n + 1}</span></div>
                        <div className="td">
                            <ButtonGeneratePDF value={item} name="wcl_5" dialogName="printWCL5Dialog" overrideText text="Generate PDF" onClick={onPrintDialog}/>
                        </div>
                        <div className="td fixed-flex flex flex-align-top min-w-100">File Upload</div>
                        {!readonly && <div className="td fixed-flex flex-align-top grid-2 grid-gap-5 min-w-110 padding-l-10">
                            <Button idx={n} action="edit" className="btn btn-primary hor-center w-40" onClick={onClick}>
                                <i className="fa fa-pen"/>
                            </Button>
                            <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                                <i className="fa fa-times-circle"/>
                            </Button>
                        </div>}

                        {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
                    </TRow>;
                } else if(item.doctor_email) {
                    const {doctor_email} = item;
                    return <TRow key={n} className="tr-readonly w-full margin-r-0">
                        <div className="td fixed-flex flex flex-align-top min-w-30"><span className="margin-t-10">{n + 1}</span></div>
                        <div className="td flex-column flex-left">
                            <h4 className="margin-0 font-size-13 font-bold">Email Address</h4>
                            {doctor_email}
                        </div>
                        <div className="td fixed-flex flex flex-align-top min-w-100">Online Form</div>
                        {!readonly && <div className="td fixed-flex flex-align-top grid-2 grid-gap-5 min-w-110 padding-l-10">
                            <Button idx={n} action="edit" className="btn btn-primary hor-center w-40" onClick={onClick}>
                                <i className="fa fa-pen"/>
                            </Button>
                            <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                                <i className="fa fa-times-circle"/>
                            </Button>
                        </div>}

                        {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
                    </TRow>;
                } else if(item.wcl_5) {
                    const {
                        //4. Medical Practitioner/Chiropractor Consultation Details
                        operation_procedure_test_carried_out_and_dates,
                        prognosis_and_further_treatment,
                        employee_been_fit_normal_work_date,
                        employee_likely_to_be_fit_normal_work_date,
                        employee_condition_became_stabilised_yes_or_no,
                        present_permanent_anatomical_defect_or_impairment,

                        //5. Medical Practitioner/Chiropractor Declaration
                        practioner_signature,
                        practioner_signature_name,
                        practioner_signature_date,
                        practioner_addr,
                        practioner_practice_num
                    } = item.wcl_5;

                    return <TRow key={n} className="tr-readonly w-full margin-r-0">
                        <div className="td fixed-flex flex flex-align-top min-w-30"><span className="margin-t-10">{n + 1}</span></div>
                        <div className="td tr-row grid-1 grid-gap-5">
                            <span className="td flex-column flex-left">
                                <h4 className="margin-0 font-size-13 font-bold">Date Been Fit For Normal Work</h4>
                                {Dates.formatDate(employee_been_fit_normal_work_date)}
                            </span>
                            <span className="td flex-column flex-left">
                                <h4 className="margin-0 font-size-13 font-bold">Date Likely To Be Fit For Normal Work</h4>
                                {Dates.formatDate(employee_likely_to_be_fit_normal_work_date)}
                            </span>
                            <span className="td flex-column flex-left">
                                <h4 className="margin-0 font-size-13 font-bold">Employee's Condition Stabilized</h4>
                                {employee_condition_became_stabilised_yes_or_no}
                            </span>
                            <span className="td flex-column flex-left flex-justify-top">
                                <ButtonGeneratePDF
                                    value={item}
                                    name="wcl_5"
                                    dialogName="printWCL5Dialog"
                                    overrideText
                                    text="Generate PDF"
                                    onClick={onPrintDialog}
                                    findById={findById}
                                />
                            </span>
                        </div>
                        <div className="td fixed-flex flex flex-align-top min-w-100">Fill Form</div>
                        {!readonly && <div className="td fixed-flex flex-align-top grid-2 grid-gap-5 min-w-110 padding-l-10">
                            <Button idx={n} action="edit" className="btn btn-primary hor-center w-40" onClick={onClick}>
                                <i className="fa fa-pen"/>
                            </Button>
                            <Button idx={n} action="delete" className="btn btn-primary hor-center w-40" onClick={onClick}>
                                <i className="fa fa-times-circle"/>
                            </Button>
                        </div>}

                        {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
                    </TRow>;
                } else {
                    return null;
                }
            }
        } else {
            return <WCL5TableNewRow 
                idx={n} 
                state={this.selfState} 
                edits={edits}
                valuesInputOption={this.selfState.lists.types}
                isEditting={isEditting}
                onSetRef={this.onSetRef}
                onChangeInternalInputOption={this.onChangeInternal}
                onChange={this.onChange}
                onComplete={this.onComplete}
                onClick={onClick} 
                onNewDialog={onNewDialog}
            />;
        }
    }

    renderTHead() {
        const {readonly} = this.props;
        return <THead className="align-left">
            <div className="td fixed-flex min-w-30">#</div>
            <div className="td">Details</div>
            <div className="td fixed-flex min-w-100">Type</div>
            {!readonly && <div className="td fixed-flex min-w-120 padding-0"/>}
            {readonly && <div className="td fixed-flex min-w-0 padding-0"/>}
        </THead>;
    }
    
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ClearableInputOption">
@observer
class ClearableInputOption extends React.Component {
    render() {
        const {idx, state: {type}, onSetRef, onChangeInternal, values, edits, isEditting} = this.props;
        if(isEditting && !edits[idx]) return null;
        console.log('ClearableInputOption')
        return <ClearableInput 
            ref={onSetRef} 
            name="option" 
            type="radio" 
            placeholder="Option" 
            defaultValue={type}
            vertical 
            className="w-300 form-control" 
            onChange={onChangeInternal} 
            values={values} 
            returnValue
        />;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="WCL5TableNewRow">
@observer
class WCL5TableNewRow extends React.Component {
    
    @computed get isEdittingNew() {
        const {idx, edits, isEditting} = this.props;
        return isEditting && !edits[idx];
    }
    
    @computed get isEdittingCurr() {
        const {idx, edits, isEditting} = this.props;
        return isEditting && edits[idx];
    }
    
    @computed get isEdittingNot() {
        const {idx, edits, isEditting} = this.props;
        return !isEditting;
    }
    
    render() {
        const {isEdittingNew, isEdittingCurr, isEdittingNot} = this;
        const {idx, item, state, edits, isEditting, valuesInputOption, onSetRef, onChange, onChangeInternalInputOption, onNewDialog, onComplete, onClick} = this.props;
        if(isEdittingNew || (isEdittingNew && !isEdittingCurr)) return null;
        console.log('WCL5TableNewRow', idx, isEditting, edits)
        return <TRow key="item-new" className="padding-10 w-full">
            <div className="td flex-column grid-gap-10 padding-0 margin-0 min-h-325">
                <ClearableInputOption 
                    idx={idx} 
                    state={state}
                    onSetRef={onSetRef}
                    onChangeInternal={onChangeInternalInputOption}
                    values={valuesInputOption}
                    edits={edits}
                    isEditting={isEditting}/>
                
                <WCL5TableNewRowWrapper 
                    idx={idx}
                    item={item} 
                    state={state} 
                    edits={edits} 
                    isEditting={isEditting} 
                    onSetRef={onSetRef} 
                    onChange={onChange} 
                    onComplete={onComplete} 
                    onNewDialog={onNewDialog} 
                    onClick={onClick}/>
            </div>
            <div className="td fixed-flex w-0 min-w-0 padding-0 margin-0 h-0"/>
        </TRow>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="WCL5TableNewRowWrapper">
@observer
class WCL5TableNewRowWrapper extends React.Component {
    
    @computed get isEdittingNew() {
        const {idx, edits, isEditting} = this.props;
        return isEditting && !edits[idx];
    }
    
    @computed get isEdittingCurr() {
        const {idx, edits, isEditting} = this.props;
        return isEditting && edits[idx];
    }
    
    @computed get isEdittingNot() {
        const {idx, edits, isEditting} = this.props;
        return !isEditting;
    }
    
    render() {
        const {isEdittingNew, isEdittingCurr, isEdittingNot, isEdittingCurr: isEditting} = this;
        const {idx, item, state, state: {type}, edits, valuesInputOption, onSetRef, onChange, onChangeInternalInputOption, onNewDialog, onComplete, onClick} = this.props;
        if(!type || isEdittingNew || (isEdittingNew && !isEdittingCurr)) return null;
        console.log('WCL5TableNewRowWrapper', idx, type, isEditting, edits)
        return <React.Fragment>
            <hr className="w-full margin-0 -margin-b-5"/>
                
            <WCL5TableNewRowForm idx={idx} item={item} state={state} onSetRef={onSetRef} onComplete={onComplete} onNewDialog={onNewDialog}/>
            <WCL5TableNewRowUpload idx={idx} item={item} state={state} onSetRef={onSetRef} onChange={onChange}/>
            <WCL5TableNewRowEmail idx={idx} item={item} state={state} onSetRef={onSetRef} onChange={onChange}/>
                
            <hr className="w-full margin-0"/>
                
            <div className="button-cover flex flex-center padding-10 bg-white">
                {!isEditting && <Button idx={idx} action="save" className="btn btn-primary fixed-flex w-100 margin-0 border-radius-20" onClick={onClick}>
                    <i className="fa fa-check"/> Add
                </Button>}
                {isEditting && <Button idx={idx} action="saveEdit" className="btn btn-primary fixed-flex w-100 margin-0 border-radius-20" onClick={onClick}>
                    <i className="fa fa-check"/> Update
                </Button>}
                {isEditting && <Button idx={idx} action="cancelEdit" className="btn btn-primary fixed-flex w-100 margin-0 border-radius-20" onClick={onClick}>
                    <i className="fa fa-times"/> Cancel
                </Button>}
            </div>
        </React.Fragment>;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="WCL5TableNewRowForm">
@observer
class WCL5TableNewRowForm extends React.Component {
    render() {
        const {idx, item, state, state: {type}, onSetRef, onComplete, onNewDialog} = this.props;
        if(type !== 'Form') return null;
        return <ButtonWCl 
            idx={idx}
            state={state} 
            ref={onSetRef}
            name="wcl_5" 
            value={item && item.wcl_5}
            dialogName="newWCL5Dialog" 
            text="W.Cl.5" 
            onComplete={onComplete}
            onClick={onNewDialog}
        />;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="WCL5TableNewRowUpload">
@observer
class WCL5TableNewRowUpload extends React.Component {
    render() {
        const {idx, item, state: {type}, onSetRef, onChange} = this.props;
        if(type !== 'Upload') return null;
        return <PDFUploadButton 
            idx={idx}
            ref={onSetRef}
            name="wcl_5_external_doc" 
            buttonTitle="Upload W.Cl.5" 
            defaultValue={item && item.wcl_5_external_doc}
            showOnlyIcon 
            className="col-lg-12 col-xs-12 margin-t-10"
            onChange={onChange}
        />;
    }
}
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="WCL5TableNewRowEmail">
@observer
class WCL5TableNewRowEmail extends React.Component {
    render() {
        const {idx, item, state: {type}, onSetRef, onChange} = this.props;
        if(type !== 'Email') return null;
        return <React.Fragment>
            <label className="col-lg-12 text-center margin-0 margin-t-10 padding-5 bg-f5f5f5 font-size-13">
                Medical Practitioner/Chiropractor Email Address
            </label>
            <ClearableInput 
                idx={idx}
                ref={onSetRef}
                name="doctor_email" 
                type="text" 
                placeholder="Email Address"
                defaultValue={item && item.doctor_email}
                footerDesc="For Filling W.Cl.5 Online" 
                className="col-lg-12 form-control"
                onChange={onChange}
            />
        </React.Fragment>;
    }
}
// </editor-fold>

export default WCl5Table;
