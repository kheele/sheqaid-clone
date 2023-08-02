import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {ProfileField, UploadButton} from 'components/inputs';
import {Row} from 'components/FormComponents';

@observer
class ViewDocumentsTab extends React.Component {
    pageKey = "ViewDocumentsTab";
    
    @observable
    state = {
    };

    constructor(props) {
        super(props);
    }
    
    render() {
        const {
            onFormNext, onFormBack, onFormOpen,
            item: {
                id, data: {
                    documents
                }
            },
            idx
        } = this.props;
        
        const {
            doc_id_or_passport_expiry, doc_id_or_passport,
            doc_driver_or_operator_licence, doc_driver_or_operator_licence_expiry,
            doc_pdrp_expiry, doc_pdrp,
            doc_work_permit_expiry, doc_work_permit
        } = documents || {};
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls pos-relative">
                    <Row 
                        rendered 
                        idx={idx + ".1"} 
                        title={idx + ".1 ID / Passport"}  
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                    >
                        <UploadButton 
                            name="doc_id_or_passport" 
                            defaultValue={doc_id_or_passport}
                            buttonTitle="Copy" 
                            type={['PDF', 'Word', 'Image']}
                            showOnlyIcon 
                            readonly
                            className="ProfileField col-lg-6"
                        />
                        <ProfileField name="doc_id_or_passport_expiry" type="date" placeholder="Expiry Date" value={doc_id_or_passport_expiry} required className="col-lg-6"/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".2"} 
                        title={idx + ".2 Driver / Operator License"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        <UploadButton 
                            name="doc_driver_or_operator_licence" 
                            defaultValue={doc_driver_or_operator_licence}
                            buttonTitle="Copy" 
                            type={['PDF', 'Word', 'Image']}
                            showOnlyIcon 
                            readonly
                            className="ProfileField col-lg-6"
                        />
                        <ProfileField name="doc_driver_or_operator_licence_expiry" type="date" placeholder="Expiry Date" value={doc_driver_or_operator_licence_expiry} required className="col-lg-6"/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".3"} 
                        title={idx + ".3 PrDP"}
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        <UploadButton 
                            name="doc_pdrp" 
                            defaultValue={doc_pdrp}
                            buttonTitle="Copy" 
                            type={['PDF', 'Word', 'Image']}
                            showOnlyIcon 
                            readonly
                            className="ProfileField col-lg-6"
                        />
                        <ProfileField name="doc_pdrp_expiry" type="date" placeholder="Expiry Date" value={doc_pdrp_expiry} required className="col-lg-6"/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".4"} 
                        title={idx + ".4 Work Permit"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack}
                    >
                        <UploadButton 
                            name="doc_work_permit" 
                            defaultValue={doc_work_permit}
                            buttonTitle="Copy" 
                            type={['PDF', 'Word', 'Image']}
                            showOnlyIcon 
                            readonly
                            className="ProfileField col-lg-6"
                        />
                        <ProfileField name="doc_work_permit_expiry" type="date" placeholder="Expiry Date" value={doc_work_permit_expiry} required className="col-lg-6"/>
                    </Row>
                </div>
            </div>
        </div>
    }
}

export default ViewDocumentsTab;