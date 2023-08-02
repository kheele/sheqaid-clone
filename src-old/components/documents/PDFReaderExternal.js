import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {Document, Page} from 'react-pdf/dist/entry.webpack';

import style from "./PDFReaderExternal.lazy.css";

@observer
class PDFReaderExternal extends React.Component {
    static propTypes = {
        state: PropTypes.object.isRequired
    };

    @observable
    state = {
        doc: null,
        numPages: null,
        pageNumber: 1
    };

    constructor() {
        super();

        this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        const {state: {doc}} = this.props;
        if (doc.data instanceof Promise) {
            doc.data.then(doc => {
                this.state.doc = doc;
                console.log('doc', doc)
            }).catch(e => {
                throw e;
            });
        } else {
            this.state.doc = doc;
        }
    }

    componentWillUnmount() {
        style.unuse();
        this.state.doc = null;
    }

    onDocumentLoadSuccess( {numPages}){
        this.state.numPages = numPages;
    }

    render() {
        const {width, height} = this.props;
        const {pageNumber, doc} = this.state;
        console.log('this.props.state.doc', doc)
        if (!doc) {
            return <div className="PDFReaderExternal">
                Loading...
            </div>;
        }
        return <div className="PDFReaderExternal">
            <Document 
                file={doc} 
                onLoadSuccess={this.onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} width={width} height={height}/>
            </Document>
            <div className="actions">
                <PageNumber state={this.state}/>
            </div>
        </div>;
    }
}
@observer
class PageNumber extends React.Component {
    render() {
        const {pageNumber, numPages} = this.props.state;
        return <p>Page {pageNumber} of {numPages}</p>;
    }
}

export default PDFReaderExternal;
