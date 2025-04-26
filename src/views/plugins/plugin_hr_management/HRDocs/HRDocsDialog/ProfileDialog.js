// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';

import {Dates} from 'utils/Utils';
import {AProfileDialog} from 'components/dialogs';
import {ProfileField, ProfilePic, UploadButton} from 'components/inputs';
import {FormControls, Row} from 'components/FormComponents';

import {findByIdDocument} from "mutations/findById";
// import ProfilePDFReader from './printers/ProfilePDFReader';
import style from "./ProfileDialog.lazy.css";
import {computed, observable} from "mobx";
import {CircularProgress} from "@mui/material";

import {updateDocument} from "mutations/update";
import DocSignButton from "components/FormComponents/DocSignButton";
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="Dialog">
@observer
class ProfileDialog extends AProfileDialog {
    pageKey = "ADocumentProfile";
    findById = findByIdDocument;
    removeById = updateDocument;

    constructor(props) {
        super(props, style);
    }

    get controls() {
        return Controls;
    }

    open(item, title) {
        this._title = title;
        return super.open(item);
    }

    title() {
        return this._title || this.props.title;
    }

    onSaveAsPDF(e, btn) {
        this.refs.controls.onSaveAsPDF(e, btn);
    }

    onDownload(e, btn) {
        this.refs.controls.onDownload(e, btn);
    }
}

// </editor-fold>

@observer
class Controls extends React.Component {

    @observable
    state = {};

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onNext = this.onNext.bind(this);

        this.form = new Form();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="fileName, saveFileName, dlFileName">
    get fileName() {
        let name = (this.props.dialog.title().replaceAll(' ', '_') + "_" +
            Dates.formatDateTime(new Date())).replaceAll(" ", "_").replaceAll(":", "_");
        return name;
    }

    // </editor-fold>

    get saveFileName() {
        return this.fileName + ".pdf";
    }

    // </editor-fold>

    get dlFileName() {
        let filePath = this.src;
        let name = this.fileName;

        if (filePath.contains('.docx')) {
            name += ".docx";
        } else if (filePath.contains('.doc')) {
            name += ".doc";
        } else {
            name += ".pdf";
        }
        return name;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="src, item">
    get src() {
        const {item: {id, data: {category, title, doc, doc_docs_id, doc_old}}} = this;
        if (doc_old) {
            const url = doc_old && doc_old.dlUrls && doc_old.dlUrls[0];
            if (url) {
                return url;
//                return `https://docs.google.com/gview?url=${url}&embedded=true`;
            }
        }

        if (doc_docs_id) {
            return `https://docs.google.com/document/d/${doc_docs_id}/preview`;
        }
//        alert(doc)
        return `https://docs.google.com/document/d/${doc}/preview`;
    }

    @computed get item() {
        return this.props.state.item;
    }

    // <editor-fold defaultstate="collapsed" desc="onNext">
    onNext(e, btn) {
        const {form, refs: {gdoc}} = this;
        const {idx} = btn.props;
        if (idx === 1) {
            // gdoc && gdoc.refresh();
        }

        return true;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    async onSaveAsPDF(e, btn) {
        this.refs.pdfReader.open(this.item);
//
//        progressDialog.open("Please wait...");

//        let filePath = this.src;
//        if (filePath.contains('.docx') || filePath.contains('.doc')) {
//            if(isPackagedElectron) {
//                filePath = await workers.emit('wordToPDFOnline', filePath);
//                filePath = dataUriToUrl(filePath);
//            } else {
//                console.log('onSaveAsPDF', filePath)
//            }
//        }
//
//        progressDialog.close();
//        setTimeout(() => {
////            const jqEl = $(btn.getDOMNode());
////            jqEl.attr('download', this.saveFileName).
////                    attr('href', filePath).
////                    attr('type', 'application/pdf').click();
//            document.location = filePath;
//        }, 1000);
    }

    // <editor-fold defaultstate="collapsed" desc="onDownload">
    async onDownload(e, btn) {
        let filePath = this.src;
        let type;
        if (filePath.contains('.docx')) {
            type = 'application/pdf';
        } else if (filePath.contains('.doc')) {
            type = 'application/pdf';
        } else {
            type = 'application/pdf';
        }

//            const jqEl = $(btn.getDOMNode());
//            jqEl.attr('download', this.dlFileName).
//                    attr('href', filePath).
//                    attr('type', type).click();
        document.location = filePath;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderProfilePic">
    renderProfilePic() {    //id, data
        const {data: {company = {}}} = this.item;
        const {id, data} = company;
        if (data && data.profile_pic) {
            return <img src={data.profile_pic.dlUrls[0]} width="100%" height="100%"/>;
        } else {
            return <ProfilePic readonly profilePic="clients" id={id} fixedCenter/>;
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        if (!this.item) {
            return <CircularProgress className="fixed-center"/>;
        }

        const {
            props: {
                onFormNext, onFormBack, onFormOpen,
                dialog, dialog: {renderProfileCover, props: {showCategory}}
            },
            item, item: {
                id, data: {
                    created_at,
                    company,
                    client,
                    project,
                    site,
                    internal_or_external,
                    title,
                    desc,
                    responsible_department,
                    responsible_person,
                    contractor,
                    contractor_site,
                    contractor_user,
                    employee,
                    doc_type,
                    category,
                    removed,

                    doc_version_list,
                    latest_version: _latest_version,
                    signable_doc_template_list,
                }
            }
        } = this;

        const {isConsultant, isNoProjects} = storage.is;

        const [latest_version] = _latest_version || [];
        const {doc, doc_docs_id} = latest_version || {};

        console.log("doc", doc)
        // console.log(doc, doc_old && doc_old.dlUrls && doc_old.dlUrls[0])

        const [signable_doc_template] = signable_doc_template_list || [];//

        return <FormControls>
            {!isNoProjects && <Row
                rendered
                active
                idx={0}
                title="Company / Project / Site"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}>
                {isConsultant &&
                    <ProfileField title="Company" value={company} renderer={val => val.name} className="col-lg-12"/>}
                <ProfileField title="Project" value={project} renderer={val => val.name}
                              className="col-lg-6 col-xs-12"/>
                <ProfileField title="Site" value={site} renderer={val => val.name} className="col-lg-6 col-xs-12"/>
            </Row>}
            <Row
                rendered
                active={isNoProjects}
                idx={1}
                title="1. Basic Details"
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
                onFormBack={!isNoProjects && onFormBack}>
                <ProfileField title="Department" value={responsible_department} renderer={val => val.name}
                              className="col-lg-12"/>
                <ProfileField title="Responsible Person" value={responsible_person}
                              renderer={({fname, lname}) => `${fname} ${lname}`} className="col-lg-12"/>
                <ProfileField title="Expiry Date" type="date" value={latest_version && latest_version.expiry}
                              className="col-lg-12"/>
                <ProfileField title="Internal / External Document?" value={internal_or_external} className="col-lg-12"/>
                {showCategory && <ProfileField title="Document Category" value={category} renderer={v => v.name}
                                               className="col-lg-12"/>}
                <ProfileField title="Document Description" value={desc} className="col-lg-12"/>
            </Row>
            {/*<Row
                rendered 
                idx={2}
                title="2. Privacy Details" 
                onFormOpen={onFormOpen} 
                onFormNext={onFormNext} 
                onFormBack={onFormBack}>
                
            </Row>*/}
            <Row
                rendered
                idx={2}
                title="2. Document"
                onFormOpen={onFormOpen}
                onFormBack={onFormBack}>
                {/*{doc_old && isString(doc_old) && <div*/}
                {/*	className="col-lg-12 document-preview margin-t-10"*/}
                {/*	dangerouslySetInnerHTML={{__html: doc_old}}*/}
                {/*/>}*/}
                {/*{doc_docs_id && <GDocEditor*/}
                {/*    ref="gdoc"*/}
                {/*    item={item}*/}
                {/*    doc_docs_id={doc_docs_id}*/}
                {/*    readonly*/}
                {/*/>}*/}
                <UploadButton
                    name="doc"
                    type={['PDF', 'Word', 'Excel']}
                    defaultValue={doc}
                    showOnlyIcon
                    readonly
                    className="col-lg-12 hor-center"
                />
                <label className="w-full margin-l-10 margin-r-10 bg-white padding-10">Signable Document</label>
                {signable_doc_template && <img
                    src={signable_doc_template.preview_image_url}
                />}
                {signable_doc_template && <DocSignButton
                    doc={signable_doc_template}
                />}
                {!signable_doc_template && "N/A"}
            </Row>
            {/*<ProfilePDFReader ref="pdfReader" title={dialog.title()} showCategory={showCategory}/>*/}
        </FormControls>;
    }

}

// </editor-fold>

export default ProfileDialog;
