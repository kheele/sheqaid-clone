import React from "react";
import {observer} from 'mobx-react';

@observer
class AList extends React.Component {

    constructor(props, style) {
        super(props);
        this.style = style;

        if (this.onLoadList) {
            this.onLoadList = this.onLoadList.bind(this);
        }

        if (this.onExport) {
            this.onExport = this.onExport.bind(this);
        }
        if (this.onSaveAsPDF) {
            this.onSaveAsPDF = this.onSaveAsPDF.bind(this);
        }
        if (this.onDownload) {
            this.onDownload = this.onDownload.bind(this);
        }

        if (this.renderTHead) {
            this.renderTHead = this.renderTHead.bind(this);
        }
        if (this.renderItem) {
            this.renderItem = this.renderItem.bind(this);
        }

        if (this.renderPopoverOptions) {
            this.renderPopoverOptions = this.renderPopoverOptions.bind(this);
        }
        if (this.renderFilterNode) {
            this.renderFilterNode = this.renderFilterNode.bind(this);
        }

        if (this.renderDefaultLeftButtons) {
            this.renderDefaultLeftButtons = this.renderDefaultLeftButtons.bind(this);
        }
        if (this.renderLeftButtons) {
            this.renderLeftButtons = this.renderLeftButtons.bind(this);
        }
        if (this.renderRightButtons) {
            this.renderRightButtons = this.renderRightButtons.bind(this);
        }
    }


    // <editor-fold defaultstate="collapsed" desc="componentWillMount">
    componentWillMount() {
        this.style && this.style.use();
    }

    // <editor-fold defaultstate="collapsed" desc="componentWillUnmount">
    componentWillUnmount() {
        this.style && this.style.unuse();
    }

    // </editor-fold>

}

export default AList;
