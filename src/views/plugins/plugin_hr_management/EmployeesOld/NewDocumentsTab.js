import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {ClearableInput, ProofUploadButton} from 'components/inputs';
import {Row} from 'components/FormComponents';

@observer
class NewDocumentsTab extends React.Component {
    pageKey = "NewDocumentsTab";

    constructor(props) {
        super(props);

        this.form = new Form();
    }

    render() {
        const {
            onFormNext, onFormBack, onFormOpen,
            documents
        } = this.props;
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls">
                    <Row 
                        active
                        rendered 
                        idx={5.1}
                        title="5.1. ID / Passport" 
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                    >
                        <ClearableInput name="doc_id_or_passport_expiry" type="date" placeholder="Expiry Date..." defaultValue={documents && documents.doc_id_or_passport_expiry} required className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                        <ProofUploadButton name="doc_id_or_passport" buttonTitle="Upload Copy (PDF/Image)" defaultValue={documents && documents.doc_id_or_passport} className="col-lg-12 margin-b-10 margin-r-10 min-h-870" onChange={this.form.onChange}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={5.2}
                        title="5.2. Driver / Operator License" 
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                        onFormBack={onFormBack} 
                    >
                        <ClearableInput name="doc_driver_or_operator_licence_expiry" type="date" placeholder="Expiry Date..." defaultValue={documents && documents.doc_driver_or_operator_licence_expiry} required className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                        <ProofUploadButton name="doc_driver_or_operator_licence" buttonTitle="Upload Copy (PDF/Image)" defaultValue={documents && documents.doc_driver_or_operator_licence} className="col-lg-12 margin-b-10 margin-r-10 min-h-870" onChange={this.form.onChange}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={5.3}
                        title="5.3. PrDP"
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                        onFormBack={onFormBack} 
                    >
                        <ClearableInput name="doc_pdrp_expiry" type="date" placeholder="Expiry Date..." defaultValue={documents && documents.doc_pdrp_expiry} required className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                        <ProofUploadButton name="doc_pdrp" buttonTitle="Upload Copy (PDF/Image)" defaultValue={documents && documents.doc_pdrp} className="col-lg-12 margin-b-10 margin-r-10 min-h-870" onChange={this.form.onChange}/>
                    </Row>
                    <Row 
                        rendered 
                        idx={5.4}
                        title="5.4. Work Permit" 
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                    >
                        <ClearableInput name="doc_work_permit_expiry" type="date" placeholder="Expiry Date..." defaultValue={documents && documents.doc_work_permit_expiry} required className="col-lg-6 pull-left-3 form-control" onChange={this.form.onChange}/>
                        <ProofUploadButton name="doc_work_permit" buttonTitle="Upload Copy (PDF/Image)" defaultValue={documents && documents.doc_work_permit} className="col-lg-12 margin-b-10 margin-r-10 min-h-870" onChange={this.form.onChange}/>
                    </Row>
                </div>
            </div>
        </div>
    }
}

export default NewDocumentsTab;