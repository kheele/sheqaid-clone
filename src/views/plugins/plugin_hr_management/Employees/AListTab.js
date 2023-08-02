import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {TRow} from 'components/tables';
import {ActionsButton} from 'components/inputs';

@observer
class AListTab extends React.Component {
    constructor(props) {
        super(props);
        
        this.form = new Form();
    }

    renderItem(n, item, onClick, fragment) {
        return <TRow key={"item-" + n}>
            <div className="td fixed-flex">{item.id}</div>
            {fragment}
            <div className="td fixed-flex padding-l-10 padding-r-0 min-w-50">
            	<ActionsButton idx={n} className="btn btn-primary pull-right min-w-40" onClick={onClick}/>
            </div>
        </TRow>;
    }
    
}

export default AListTab;