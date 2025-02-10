import React from "react";
import ReactDOM from 'react-dom';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import {CircularProgress} from '@material-ui/core';

import {getNearbySearch} from '../../utils/Maps';

import style from "./NearbyPlaces.lazy.css";

@observer
class NearbyPlaces extends React.Component {
    static propTypes = {

    };

    @observable
    state = {
        isOffLine: false,
        isLoaded: false
    };
    map;
    infowindow;
    results;

    constructor() {
        super();

        this.callback = this.callback.bind(this);
        this.createMarker = this.createMarker.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        this.state.isLoaded = false;
        if (!!window.google) {
                getNearbySearch(ReactDOM.findDOMNode(this)).then(this.callback).catch(err => {
                    console.error(err)
                });
        } else {
            this.state.isOffLine = true;
        }
    }

    componentWillUnmount() {
        style.unuse();
    }

    callback({map, results, status}) {
        this.map = map;
        this.infowindow = new google.maps.InfoWindow();
        this.results = results;
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(this.createMarker);
        }
//        this.state.isLoaded = true;
    }

    createMarker(place, n) {
        if(!place.opening_hours) return;
        
//        console.log('place', place)
                
        const {infowindow, map} = this;
        const marker = new google.maps.Marker({
            map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function (e) {
//            console.log(e, this)
            infowindow.setContent('<div>\n\
                <img src="' + place.icon + '" height="60"/>\n\
                <h4>Name: ' + place.name + '</h4>\n\
                <h4>Open Now: ' + (place.opening_hours.isOpen() ? 'Yes' : 'No') + '</h4>\n\
                <h4>Rating: ' + place.rating + '</h4>\n\
                <h4>Rated People: ' + place.user_ratings_total + '</h4>\n\
            </div>');
            infowindow.open(map, this);
        });
    }

    render() {
        const {isLoaded, isOffLine} = this.state;
        return <div className="NearbyPlaces">
            {(!isOffLine && !isLoaded) && <div className="results-loading fixed-center hor-center text-center">
                <CircularProgress/>
                Loading nearby places...
            </div>}
            {isOffLine && <div className="offline">
                Please connect to the <b>Internet</b> in order to view <b>Nearby Places</b>
            </div>}
        </div>;
    }
}

export default NearbyPlaces;
