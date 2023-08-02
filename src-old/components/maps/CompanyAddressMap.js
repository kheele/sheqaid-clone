import React from "react";
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import style from "./CompanyAddressMap.lazy.css";

@observer
class CompanyAddressMap extends React.Component {
    static propTypes = {

    };

    @observable
    state = {
        isOffLine: false,
        isLoaded: false
    };
    map;

    constructor() {
        super();
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        this.state.isLoaded = false;
        if (!!window.google) {
            this.state.isOffLine = false;
            const location = new google.maps.LatLng(-25.762093, 28.237200);
            setTimeout(() => {
                this.map = new google.maps.Map(ReactDOM.findDOMNode(this), {
                    center: location,
                    zoom: 17
                });
                new google.maps.Marker({
                    position: location,
                    map: this.map,
                    title: "SHEQ Aid Offices",
                });
            }, 0);
        } else {
            this.state.isOffLine = true;
        }
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        const {isLoaded, isOffLine} = this.state;
        return <div className="geo-map CompanyAddressMap">
            {(!isOffLine && !isLoaded) && <div className="results-loading fixed-center hor-center text-center">
                <CircularProgress/>
                Loading company address...
            </div>}
            {isOffLine && <div className="offline">
                Please connect to the <b>Internet</b> in order to view <b>company address</b>
            </div>}
        </div>;
    }
}

export default CompanyAddressMap;
