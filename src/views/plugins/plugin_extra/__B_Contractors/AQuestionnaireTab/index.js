// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import byLogged from "./Query/List/listAllContractorQuestionnaireByLogged";
// </editor-fold>

@observer
class ATab extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);

        this.onLoadList = this.onLoadList.bind(this);
    }

    // </editor-fold>

    //<editor-fold desc="onLoadList">
    onLoadList(params = {}) {
        const {page, lastItem, filterData, filtered, isNew} = params;

        const {status} = this;

        const {
            name,
        } = filterData || {};

        const limit = 50;

        const args = {
            name,
            //
            status,
            //
            limit,
            //
            exact_orgs: true,
        };

        if(!isNew) {
            args.offset = this.refs.root.list.length;
        } else {
            args.offset = 0;
        }

        return byLogged(args).then((res) => {
            console.log('onLoadList res', res)
            return res;
        });
    }

    //</editor-fold>

}

export default ATab;
