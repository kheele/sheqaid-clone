import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';

import {PDFJSBackend, PDFViewer} from '../previewer';

@observer
class Document extends React.Component {
    static propTypes = {
        state: PropTypes.object.isRequired
    };

    render() {
        let {state, previewPath} = this.props;
        previewPath = previewPath || (state && state.doc && state.doc.previewPath);
        return !!previewPath && <PDFViewer backend={PDFJSBackend} previewPath={previewPath}/>;
    }
}

export default Document;
