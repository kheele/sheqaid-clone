import React, {Suspense} from "react";
import {observer} from 'mobx-react';

import {NearbyPlaces} from 'components/maps';
import PageLoadingProgress from 'components/PageLoadingProgress';

import style from "./NearbyServicesTab.lazy.css";

@observer
class NearbyServicesTab extends React.Component {
    pageKey = "NearbyServicesTab";

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        return <div id="NearbyServicesTab-tab" className="NearbyServicesTab-tab">
            <Suspense fallback={<PageLoadingProgress />}>
                <NearbyPlaces />
            </Suspense>
        </div>;
    }
}

export default NearbyServicesTab;
