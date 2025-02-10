import React from "react";
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {isObservableArray, observable, toJS} from 'mobx';
import {CircularProgress} from '@material-ui/core';
import html2canvas from 'html2canvas';

import {drawChart} from '../../utils/Hierarchies';

import style from "./Hierarchies.lazy.css";
import Draggable from 'react-draggable';
import MKBox from "../MK/MKBox";

@observer
class Hierarchies extends React.Component {
    static propTypes = {

    };

    @observable
    state = {
        isOffLine: false,
        isLoaded: false
    };

    constructor() {
        super();

        this.callback = this.callback.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        this.state.isOffLine = false;
        this.state.isLoaded = false;
        if (!!window.google) {
            setTimeout(() => {
                drawChart().then(this.callback).catch(err => {
                    console.error(err)
                });
            }, 0);
        } else {
            this.state.isOffLine = true;
        }
    }

    componentWillUpdate() {
        this.state.isOffLine = false;
        if (!!window.google) {
            setTimeout(() => {
                drawChart().then(this.callback).catch(err => {
                    console.error(err)
                });
            }, 0);
        } else {
            this.state.isOffLine = true;
        }
    }

    componentWillUnmount() {
        style.unuse();
        this.state.isOffLine = false;
        this.state.isLoaded = false;
    }

    callback(list) {
        this.data = new google.visualization.DataTable();
        this.data.addColumn('string', 'Name');
        this.data.addColumn('string', 'Manager');
        this.data.addColumn('string', 'ToolTip');

        // Create the chart.
        this.chart = new google.visualization.OrgChart(findDOMNode(this).querySelector("#drag-container"));

        this.update(list || this.props.list, true);
        this.state.isLoaded = true;
    }

    update(list, internal = false) {
        if (list && (isObservableArray(list) || isArray(list))) {
            if(internal) {
                this.data.addRows(toJS(list));

                setTimeout(() => {
                    // Draw the chart, setting the allowHtml option to true for the tooltips.
                    this.chart.draw(this.data, {'allowHtml': true});
                }, 0);
            } else {
                this.callback(list);
            }
        }
    }

    async getPrintCanvas() {
        const node = this.getDOMNode();
        const nodeJq = $(node);
        nodeJq.addClass('print');
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const canvas = await html2canvas(node);
                nodeJq.removeClass('print');

                resolve(canvas);
            }, 500);
        });
    }

    getDOMNode() {
        return findDOMNode(this);
    }

    render() {
        const {isLoaded, isOffLine} = this.state;
        return <div className="Hierarchies">
            <Draggable draggableId="Hierarchies">
                <MKBox id="drag-container" sx={{width: "100%", height: "100%",}}/>
            </Draggable>
            {(!isOffLine && !isLoaded) && <div className="results-loading fixed-center hor-center text-center">
                <CircularProgress/>
                Loading organogram...
            </div>}
            {isOffLine && <div className="offline">
                Please connect to the <b>Internet</b> in order to view <b>Organogram</b>
            </div>}
        </div>;
    }
}

export default Hierarchies;
