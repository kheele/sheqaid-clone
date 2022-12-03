import {observer} from 'mobx-react';

import APageList from "./APageList";

@observer
class APageListReadOnly extends APageList {

    constructor(props) {
        super(props);
        
        this.hasCreateBtn = this.hasCreateBtn.bind(this);//
    }

    hasCreateBtn = () => false;
    
    renderPopoverOptions(idx, e, btn, onView, Options) {
        return this.props.renderPopoverOptions(idx, {onView, Options}, e, btn);
    }

}

export default APageListReadOnly;
