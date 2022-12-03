import React from "react";
import {findDOMNode} from "react-dom";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import style from "./PDFSVGViewer.lazy.css";

//pdfjsLib.GlobalWorkerOptions.workerSrc = "./js/lib/pdfjs-2.3.200-dist/build/pdf.worker.js";

// Some PDFs need external cmaps.
const CMAP_URL = "./js/lib/pdfjs-2.3.200-dist/web/cmaps/";
const CMAP_PACKED = true;
var DEFAULT_URL = "./js/lib/pdfjs-2.3.200-dist/web/compressed.tracemonkey-pldi-09.pdf";

@observer
class PDFSVGViewer extends React.Component {
    static propTypes = {
        state: PropTypes.object.isRequired
    };

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        const {state: {doc}} = this.props;

        setTimeout(() => {
            const container = findDOMNode(this);

            const eventBus = new pdfjsViewer.EventBus();

            // (Optionally) enable hyperlinks within PDF files.
            const pdfLinkService = new pdfjsViewer.PDFLinkService({
                eventBus: eventBus
            });
            const pdfViewer = new pdfjsViewer.PDFViewer({
                container: container,
                eventBus: eventBus,
                linkService: pdfLinkService,
                renderer: "svg",
                textLayerMode: 0,
            });
            pdfLinkService.setViewer(pdfViewer);

            eventBus.on("pagesinit", function () {
                // We can use pdfViewer now, e.g. let's change default scale.
                pdfViewer.currentScaleValue = "page-width";
            });

            // Loading document.
            const loadingTask = pdfjsLib.getDocument({
                url: DEFAULT_URL,//doc.previewPath,
                cMapUrl: CMAP_URL,
                cMapPacked: CMAP_PACKED
            });
            loadingTask.promise.then(pdfDocument => {
                // Document loaded, specifying document for the viewer and
                // the (optional) linkService.
                pdfViewer.setDocument(pdfDocument);
                pdfLinkService.setDocument(pdfDocument, null);
            });
        }, 0);
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        return <div className="PDFSVGViewer">
            <div className="PDFSVGRoot pdfViewer"/>
        </div>;
    }
}

export default PDFSVGViewer;
