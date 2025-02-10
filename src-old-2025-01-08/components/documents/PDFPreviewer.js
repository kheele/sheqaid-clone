import React from "react";
import PropTypes from "prop-types";
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import {execWhen} from '../../utils/Utils';

import style from "./PDFPreviewer.lazy.css";

@observer
class PDFPreviewer extends React.Component {
    static propTypes = {
        url: PropTypes.object.isRequired
    };
    
    @observable state = {
        dataLoaded: false,
        dataError: false
    };

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        const {url} = this.props;
        if(!url) return;
        
        pdfjsLib.getDocument(url).then((pdf) => {
            pdf.getPage(1).then((page) => {
                this.state.dataLoaded = true;
                this.state.dataError = false;
                execWhen(() => this.refs.canvas).then(canvas => {
                    const canvasContext = canvas.getContext('2d');
                    let viewport = page.getViewport(1);

                    const nodeJQ = $(canvas);
                    canvas.width = nodeJQ.width();
                    canvas.height = nodeJQ.height();
                    const zoom = canvas.width / viewport.width;
                    viewport = page.getViewport(zoom);
                    page.render({canvasContext, viewport});
                });
            }).catch(err => {
                console.error(err);
                this.state.dataLoaded = true;
                this.state.dataError = true;
            });
        });
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        const {dataLoaded, dataError} = this.state;
        return <div className="PDFPreviewer">
            {!dataLoaded && <div className="results-loading">
                <CircularProgress/>
                Loading...
            </div>}
            {(dataLoaded && dataError) && <div className="results-none">
                An error occurred
            </div>}
            {(dataLoaded && !dataError) && <canvas ref="canvas"/>}
        </div>;
    }
}

export default PDFPreviewer;
