// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';

import {ClearableInput, SelectAssetInput, SelectAssetTypeInput, UploadButton} from '../../../../../components/inputs';
import {AControls, FormControls, Row} from '../../../../../components/FormComponents';
import {ANewDialog} from '../../../../../components/dialogs';

import style from "./NewJobCardDialog.lazy.css";
import {
    NewPartItemListTable,
    NewPartItemOrderApprovedListTable,
    NewPartItemOrderOrderedListTable,
    NewPartItemOrderReceivedListTable,
    NewPartItemOrderRequestsListTable
} from "../../../../../components/FormTableComponents";
import {execWhen} from "../../../../../utils/Utils";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class NewPartDialog extends ANewDialog {
    pageKey = "NewJobCardDialog";
    title = "Create Job Card";

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }
}

// </editor-fold>

@observer
class Controls extends AControls {
    path = "plugin_sheq_assist/19_Maintenance/job-cards/";

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.form.addChangeOne('order_requests_list', this.onChangeOrderRequestsList.bind(this));
        this.form.addChangeOne('order_approved_list', this.onChangeOrderApprovedList.bind(this));
        this.form.addChangeOne('order_ordered_list', this.onChangeOrderOrderedList.bind(this));
        this.form.addChangeOne('order_received_list', this.onChangeOrderReceivedList.bind(this));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="title">
    get title() {
        return 'Create Job Card';
    }
    // </editor-fold>

    //<editor-fold desc="onChanges">
    onChangeOrderRequestsList(el, val) {
        execWhen(() => this.refs.order_approved_list).then(ref => {
            console.log('onChangeOrderRequestsList', val);
            ref.listNoChange = val.filter(({status}) => !status || status === 'AwaitingApproval');
        });
    }

    onChangeOrderApprovedList(el, val) {
        execWhen(() => this.refs.order_ordered_list).then(ref => {
            console.log('onChangeOrderApprovedList', val);
            ref.listNoChange = val.filter(v => v.status === '');
        });
    }

    onChangeOrderOrderedList(el, val) {
        execWhen(() => this.refs.order_received_list).then(ref => {
            console.log('onChangeOrderOrderedList', val);
            ref.listNoChange = val.filter(v => v.status === '');
        });
    }

    onChangeOrderReceivedList(el, val) {

    }
    //</editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            if (!form.isValid('name')) {
                infoDialog.open('Part Name is required');
                return;
            }
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSubmit">
    onSubmit(e, btn, onSaved) {
        if (!this.form.isValid('name')) {
            infoDialog.open('Part Name is required');
            return;
        }

        const data = super.onSubmit(e, btn, onSaved);

        console.log(data)

        if(this.props.dialog.props.saveLater) {
            onSaved(data);
            this.props.close();
        } else {
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
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {props: {onFormNext, onFormBack, onFormOpen}} = this;
        return <FormControls>
            <Row
                rendered
                active
                idx={1}
                title="1. Job Card Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                <SelectAssetInput ref="asset" name="asset" placeholder="Asset..." className="col-lg-12 form-control"
                                  onChange={this.form.onChange}/>
                <SelectAssetTypeInput name="asset_type" placeholder="Asset Type..." className="col-lg-12 form-control"
                                      onChange={this.form.onChange}/>
                <ClearableInput ref="estimated_time" name="estimated_time" type="date" placeholder="Estimated Time..."
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="deadline" name="deadline" type="date" placeholder="Deadline..."
                                className="col-lg-6 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="curr_odo_reading" name="curr_odo_reading" placeholder="Current ODO Reading"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={2}
                title="2. Job Instructions & Additional Work Done"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <ClearableInput ref="job_instructions" name="job_instructions" type="textarea" placeholder="Job Instructions"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
                <ClearableInput ref="additional_work_done" name="additional_work_done" type="textarea" placeholder="Additional Work Done"
                                className="col-lg-12 form-control" onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={3}
                title="3. Parts To Be Used"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
                onFormNext={onFormNext}
            >
                <NewPartItemListTable ref='parts_used_list' name='parts_used_list' onChange={this.form.onChange}/>
            </Row>
            <Row
                rendered
                idx={4}
                title="4. Time Management"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}
            >
                <NewPartItemOrderRequestsListTable ref='time_management_list' name='time_management_list' onChange={this.form.onChange}/>
            </Row>
        </FormControls>;
    }
    // </editor-fold>
}

export default NewPartDialog;
//358