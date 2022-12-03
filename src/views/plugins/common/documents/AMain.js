// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';

import {renderExpiryDateSpan, renderLeftButtonsForExpiryOnly} from '../../../../utils/ComponentUtils';
import {Dates} from '../../../../utils/Utils';
import APageListReadWrite from "../../../APageListReadWrite";
import NavItem from '../../../../components/navs/NavItem';
import ConfirmDialog from '../../../../components/dialogs/ConfirmDialog';
import {ActionsButton, Button} from '../../../../components/inputs';
import {THead, TRow} from '../../../../components/tables';

import ShareDialog from './ShareDialog';
import NewDialog from './NewDialog';
import ProfileDialog from './ProfileDialog';
import EditDialog from './EditDialog';

import DocumentCategoriesDialog from './dialogs/DocumentCategoriesDialog';

import style from "./AMain.lazy.css";

// </editor-fold>

@observer
class AMain extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="fields">
    pageId = "ADocuments";
    classNames = "LeftButtonsForExpiryOnlyPage";
    showCategory = true;
    noAnimation = true;
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        this.onDownload = this.onDownload.bind(this);

        this.onShare = this.onShare.bind(this);

        this.renderItem = this.renderItem.bind(this);
        this.renderLeftButtons = this.renderLeftButtons.bind(this);
        this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        this.renderFilterNode = this.renderFilterNode.bind(this);
        this.onViewDocumentCategory = this.onViewDocumentCategory.bind(this);

        neonBinding.events.on("mock/docs/doc/new", item => {
            const {id, data: {doc_old, doc, title}} = item;
            console.log("mock/docs/doc/new", id, doc_old, doc);
            if (doc_old && doc_old.dlUrls) {
//                document.location = doc_old.dlUrls[0];
            }
            return neonBinding.events.emit("default/docs/doc/new", title).then(res => {
                item.data.doc = res.data.id;
                return item;
            });
        });
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="mounts">
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="fixText, fixFile">
    fixText(evt, btn) {
        const {item} = btn.props;
        console.log(this.path, item)
//        this.refs.doc.show(this.path, item);
    }

    fixFile(evt, btn) {
        const {item, item: {data: {doc, old_doc}}} = btn.props;
        console.log(this.path, item)
//        this.refs.doc.show(this.path, item);
//        
//        const lastDoc = isArray(doc || old_doc) || isObservableArray(doc || old_doc) ? (doc || old_doc).getLastElement() : doc || old_doc;
//        console.log(lastDoc)
//        if(isString(lastDoc)) {
//            document.location = old_doc.doc.dlUrls[0];
//        } else {
//            document.location = lastDoc.doc.dlUrls[0];
//        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="fileName">
    get fileName() {
        let name = (this.pageTitleSingular.replaceAll(' ', '_') + "_" +
            Dates.formatDateTime(new Date())).replaceAll(" ", "_").replaceAll(":", "_");
        return name;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="getFileSrc">
    getFileSrc(item) {
        const {id, data: {category, title, doc, doc_old}} = item;
        if (doc_old) {
            const url = doc_old && doc_old.dlUrls && doc_old.dlUrls[0];
            if (url) {
                return url;
                //          return `https://docs.google.com/gview?url=${url}&embedded=true`;
            }
        }
        //  alert(doc)
        return `https://docs.google.com/document/d/${doc}/preview`;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onSaveAsPDF">
    async onSaveAsPDF(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        const {id, data: {category, title, doc, doc_old}} = item;

        progressDialog.open("Please wait...");

        let filePath = this.getFileSrc(item);
        if (filePath.contains('.docx') || filePath.contains('.doc')) {
            filePath = await neonBinding.events.emit('wordToPDFOnline', filePath);
            saveFileAs(filePath, `${title.replaceAll(' ', '')}_${Dates.formatDate(new Date())}.docx`);
        } else {
            setTimeout(() => {
                //            const jqEl = $('<a/>');
                //            jqEl.attr('download', this.fileName + ".pdf").
                //                    attr('href', filePath).
                //                    attr('type', 'application/pdf').click();
                //            alert(jqEl.length)
                //            console.log(jqEl[0])
                document.location = filePath;
            }, 500);
        }

        progressDialog.close();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onDownload">
    async onDownload(e, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        const {id, data: {category, title, doc, doc_old}} = item;

        let filePath = this.getFileSrc(item);
        let name = this.fileName;
        let type;
        if (filePath.contains('.docx')) {
            type = 'application/pdf';
            name += ".docx";
        } else if (filePath.contains('.doc')) {
            type = 'application/pdf';
            name += ".doc";
        } else {
            type = 'application/pdf';
            name += ".pdf";
        }

//            const jqEl = $('<a/>');
//            jqEl.attr('download', name).
//                    attr('href', filePath).
//                    attr('type', type).click();
//            alert(jqEl.length)
//            console.log(jqEl[0])
        document.location = filePath;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="onShare">
    onShare(evt, btn) {
        const {idx} = btn.props;
        const item = this.refs.root.list[idx];
        this.refs.shareDialog.open(item).then(item => {

        });
    }

    // </editor-fold>

    onViewDocumentCategory() {
        this.refs.documentCategoriesDialog.open();
    }

    renderLeftButtons() {
        return <>
            {renderLeftButtonsForExpiryOnly.call(this)}
            <Button className={"btn btn-primary fixed-flex _888"} onClick={this.onViewDocumentCategory}>
                Document Categories
            </Button>
        </>
    }

    // <editor-fold defaultstate="collapsed" desc="renderPopoverOptions">
    renderPopoverOptions(idx, {onView, onEdit, onRemove, Options}) {
        const perm = this.notHasWritePermission ? null : this.props.permissionKey;
        return <Options idx={idx} permissionModKey={perm}>
            <NavItem action="view" onClick={onView} faIconLeft="eye" title="View"/>
            {!this.notHasWritePermission && <NavItem action="edit" onClick={onEdit} faIconLeft="edit" title="Edit"/>}
            {!this.notHasWritePermission &&
                <NavItem action="remove" onClick={onRemove} faIconLeft="ban" title="Remove"/>}
            <hr/>
            <NavItem action="download" onClick={this.onDownload} faIconLeft="download" title="Download"/>
            <NavItem action="save-pdf" onClick={this.onSaveAsPDF} faIconLeft="file-pdf-o" title="Save As PDF"/>
            <hr/>
            <NavItem action="share" onClick={this.onShare} faIconLeft="share" title="Share"/>
        </Options>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderTHead">
    renderTHead() {
        return <THead>
            <div className="td fixed-flex min-w-50">No.</div>
            <div className="td fixed-flex min-w-80">Code</div>
            {/*<div className="td fixed-flex min-w-80">Version</div>*/}
            <div className="td">Document Name</div>
            <div className="td">Company</div>
            <div className="td">Responsible Person</div>
            <div className="td fixed-flex min-w-100">Review Date</div>
            <div className="td fixed-flex padding-l-0 padding-r-0 min-w-60"></div>
        </THead>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="renderItem">
    renderItem(n, onClick) {
        const item = this.refs.root.list[n];
        const {
            id,
            data: {
                created_at,
                type,
                desc,
                responsible_department,
                responsible_person,
                expiry,
                company,
                title,
                doc_num,
                doc,
                doc_old,
                user_id
            }
        } = item;

//        const lastDoc = isArray(doc) || isObservableArray(doc) ? doc.getLastElement() : doc;
        let companyName;
        if (company) {
            const {name, data: _data} = company;
            companyName = name || _data.name;
        }

        const getFileType = (type) => {
            if (type) return type.toLowerCase();
            console.log('getFileType', type, doc, doc_old)
        };

        return <TRow key={id}>
            <div className={"td fixed-flex min-w-50 td-filetype-" + getFileType(type)}>
                <h6 className="xs-shown font-size-13">No.</h6>
                {n + 1}
            </div>
            <div className="td fixed-flex min-w-80">
                <h6 className="xs-shown font-size-13">Code</h6>
                {doc_num || 'N/A'}
            </div>
            {/*<div className="td fixed-flex min-w-80">
                <h6 className="xs-shown font-size-13">Version</h6>
                {/*lastDoc.doc_rev_num*}
            </div>*/}
            <div className="td">
                <h6 className="xs-shown font-size-13">Document Name</h6>
                {title}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Company</h6>
                {companyName || 'N/A'}
            </div>
            <div className="td">
                <h6 className="xs-shown font-size-13">Responsible Person</h6>
                {responsible_person ? (responsible_person.lname + ' ' + responsible_person.fname) : 'N/A'}
            </div>
            <div className="td fixed-flex min-w-100">
                <h6 className="xs-shown font-size-13">Review Date</h6>
                {renderExpiryDateSpan(expiry)}
            </div>
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
                <ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {
            createBtnTitle,
            pageTitle,
            pageTitleSingular,
            renderActionComponents,
            permissionKey,
            ExtraContent,
            showCategory,
            noAnimation
        } = this;
        return <APageListReadWrite
            ref="root"
            page={this}
            pageId={this.pageId + "-page"}
            createBtnTitle={createBtnTitle}
            pageTitle={pageTitle}
            pageTitleSingular={pageTitleSingular}
            path={this.path}
            noAnimation={noAnimation}
            renderLeftButtons={this.renderLeftButtons}
            renderPopoverOptions={this.renderPopoverOptions}
            renderFilterNode={this.renderFilterNode}
            renderTHead={this.renderTHead}
            renderItem={this.renderItem}>

            <ConfirmDialog ref="removeDialog"/>

            {!this.notHasWritePermission &&
                <NewDialog ref="newDialog" path={this.path} title={pageTitleSingular} extraContent={ExtraContent}
                           showCategory={showCategory}/>}
            <ProfileDialog ref="profileDialog" title={pageTitleSingular} extraContent={ExtraContent}
                           showCategory={showCategory}/>
            <EditDialog ref="editDialog" path={this.path} title={pageTitleSingular} extraContent={ExtraContent}
                        showCategory={showCategory}/>

            <ShareDialog ref="shareDialog" path={this.path} title={pageTitleSingular} extraContent={ExtraContent}
                         showCategory={showCategory}/>

            <DocumentCategoriesDialog ref="documentCategoriesDialog"/>
        </APageListReadWrite>;
    }

    // </editor-fold>
}

export default AMain;
