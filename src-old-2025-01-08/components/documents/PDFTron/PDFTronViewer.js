import React, {createRef} from 'react';
import WebViewer from '@pdftron/webviewer';
import {execWhen} from "utils/Utils";
import MKBox from "../../MK/MKBox";
import {findDOMNode} from "react-dom";

class Comp extends React.Component {

    constructor() {
        super();

        this.loadDocument = this.loadDocument.bind(this);
    }

    async componentDidMount() {
        const {url, onApplyTemplateValues} = this.props;
        const node = await execWhen(() => findDOMNode(this));

        WebViewer({
                path: '/webviewer/lib',
                // initialDoc: '/files/PDFTRON_about.pdf',
            },
            node,
        ).then((instance) => {
            this.instance = instance;

            instance.loadDocument(`/${url}`, {
                officeOptions: {
                    doTemplatePrep: true
                }
            });

            const {documentViewer, annotationManager, Annotations} = instance.Core;
            documentViewer.addEventListener('documentLoaded', async () => {
                const doc = documentViewer.getDocument();

                // it is possible to extract document template keys in WebViewer
                // const keys = doc.getTemplateKeys();

                // create an options object and add your template
                // replacement values to it
                // const options = {};
                // for (const i in keys) {
                //     options[keys[i]] = json_data_string;
                // }

                if (onApplyTemplateValues) {
                    const options = await onApplyTemplateValues(doc);

                    // apply the template values to the currently loaded document in WebViewer
                    await doc.applyTemplateValues(options);
                }
            });
        });
    }

    async loadDocument(url, options = {}) {
        const instance = await execWhen(() => this.instance);
        instance.loadDocument(`/${url}`, options);
    }

    render() {
        return <MKBox
            className="PDFTronViewer"
            ref={this.viewer}
            sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                zIndex: 2,
            }}/>
    }
}

export default Comp;