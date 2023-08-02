import React from "react";
import {observer} from 'mobx-react';

@observer
class InitViewNotSelected extends React.Component {
    render() {
        const {selected: {selectedClient}, is: {isConsultant, isContractorViewIncContractorPack, isEmployee}, list: {clients}} = storage;
        if (isEmployee || isContractorViewIncContractorPack) return null;
        if (isConsultant && (selectedClient || clients.isEmpty())) return null;
        if (!isConsultant && selectedClient) return null;
        return <div className="InitViewNotSelected"/>;
    }
}

export default InitViewNotSelected;