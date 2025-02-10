// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {findDOMNode} from "react-dom";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';
import {CircularProgress} from '@material-ui/core';

import {PDFJSBackend, PDFViewer} from '../previewer';

// </editor-fold>

@observer
class Document extends React.Component {
    // <editor-fold defaultstate="collapsed" desc="fields">
    static propTypes = {
        fileName: PropTypes.string.isRequired,
        data: PropTypes.object.isRequired,
        onCreateTextField: PropTypes.func,
        onCreateShape: PropTypes.func
    };

    @observable
    state = {
        previewPath: null
    };
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="componentDidMount">
    async componentDidMount() {
        const {fileName} = this.props;
        let DEFAULT_URL = `./pdf/claims/${fileName}`;
        const mainPdfDocBytes = await fetch(DEFAULT_URL).then(res => res.arrayBuffer());
        this.mainPdfDoc = await PDFDocument.load(mainPdfDocBytes);

        this.form = this.mainPdfDoc.getForm();

        await this.createTextFieldImpl();
        await this.createShapeImpl();
        await this.setValues();

//        const fields = this.form.getFields();
//        fields.forEach(f => {
//            console.log(f.getName(), f)
//        });

        await this.save();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createTextFieldImpl">
    async createTextFieldImpl(pageNum = 1) {
        const {onCreateTextField} = this.props;
        if (onCreateTextField && isFunction(onCreateTextField)) {
            let list = onCreateTextField();
            if (isArray(list)) {
                await Promise.all(
                    list.map(async ({pageNum = 1, onDraw}) => {
                        try {
                            const page = await this.mainPdfDoc.getPage(pageNum - 1);
                            if (onDraw) {
                                await onDraw(page, this.form);
                            }
                        } catch (err) {
                            console.error('ClaimDocument', err);
                        }
                    })
                );
            }
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="createShapeImpl">
    async createShapeImpl() {
        const {onCreateShape} = this.props;
        if (onCreateShape && isFunction(onCreateShape)) {
            let list = onCreateShape();
            if (isArray(list)) {
                await Promise.all(list.map(async ({pageNum = 1, onDraw}) => {
                    const page = await this.mainPdfDoc.getPage(pageNum - 1);
                    if (onDraw) {
                        await onDraw(page);
                    }
                }));
            }
        }
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="setValues">
    async setValues() {
        const {data} = this.props;
        await Promise.all(Object.keys(data).map(async k => {
            const exec = async (fnName = 'getTextField') => {
                try {
                    let fn = this.form[fnName];
                    if (fn) {
                        fn = fn.bind(this.form);
                        const f = fn(k);
                        if (f) {
                            if (fnName === 'getTextField') {
                                const helvetica = await this.mainPdfDoc.embedFont(StandardFonts.Helvetica);
                                f.defaultUpdateAppearances(helvetica);
                                f.setFontSize(9);
                                const text = data[k];
                                if (text) {
                                    f.setText(text);
                                }
                            } else if (fnName === 'getSignature') {
//                                f.setFontSize(10);
//                                const text = data[k];
//                                if (text) {
//                                    f.setText(text);
//                                }
                            }
                        }
                    }
                } catch (err) {
                    if (fnName === 'getTextField') {
                        await exec('getSignature');
                    } else {
//                        console.error('err', err)
                    }
                }
            };
            await exec();
        }));
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="save">
    async save() {
//        this.form.flatten();
        const newBase64Src = await this.mainPdfDoc.saveAsBase64({dataUri: true});
//        this.state.previewPath = newBase64Src;
        const url = dataUriToUrl(newBase64Src);
        this.state.previewPath = createPDFPreviewUrlFromRemote(url);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="download">
    async download(evt) {
        const {previewPath} = this.state;

        const jqEl = $(evt.target);
        const src = decodeURIComponent(previewPath.substring(previewPath.indexOf('file=blob') + 5, previewPath.length));

        jqEl.attr('href', src).click();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="print">
    async print(evt) {
        const el = findDOMNode(this);
        const frame = el.querySelector('iframe') || el.querySelector('webview');
        frame.focus();
//        frame.print();
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        let {state: {previewPath}} = this;
        if (!previewPath) {
            return <div className="results-loading">
                <CircularProgress/>
                Loading...
            </div>;
        }
        return <PDFViewer backend={PDFJSBackend} previewPath={previewPath}/>;
    }

    // </editor-fold>
}

// <editor-fold defaultstate="collapsed" desc="funs">
const calcX = (x, w) => (x - (w / 2)) + 1;

const calcY = (page, y) => page.getHeight() - (y + 7);

const createTextField = (page, form, id, x, y, w) => {
    let newField;
    try {
        newField = form.createTextField(id);
        newField.addToPage(page, {
            x: calcX(x, w),
            y: calcY(page, y),
            width: w,
            height: 11,
            textColor: rgb(0, 0, 0),
            borderWidth: 0
        });
    } catch (err) {

    }
    return newField;
};

const createTimesSVG = (page, x, y, w, scale) => {
    return page.drawSvgPath('M 169.72656,371.38672 L 238.67188,302.44141 L 169.92188,233.69141 L 181.25,222.36328 L 250,291.11328 L 318.75,222.36328 L 329.6875,233.49609 L 260.9375,302.24609 L 330.07812,371.38672 L 318.94531,382.71484 L 249.80469,313.57422 L 180.85938,382.51953 L 169.72656,371.38672 z', {
        x: calcX(x, w),
        y: calcY(page, y),
        color: rgb(1.0, 0, 0),
        opacity: 0.6,
        scale: scale || 0.1,
        borderColor: rgb(1.0, 0, 0),
        borderWidth: 2,
        borderOpacity: 0.6
    });
};
// </editor-fold>

export {Document as ClaimDocument, calcX, calcY, createTextField, createTimesSVG};