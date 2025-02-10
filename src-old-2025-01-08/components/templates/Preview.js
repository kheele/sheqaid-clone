import React from 'react';
import {observer} from 'mobx-react';

import {InputCheckboxes, InputDropdown, InputMultipleChoice} from './Inputs';

@observer
class Preview extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        const {isSummary, ques, idx, uploadOptionImage, removeOptionImage, readonly} = this.props;
        return <React.Fragment>
                <InputMultipleChoice 
                    isSummary={isSummary}
                    ques={ques} 
                    idx={idx}
                    uploadOptionImage={uploadOptionImage}
                    removeOptionImage={removeOptionImage}
                    readonly={readonly}/>
                <InputCheckboxes 
                    isSummary={isSummary}
                    ques={ques} 
                    idx={idx} 
                    uploadOptionImage={uploadOptionImage}
                    removeOptionImage={removeOptionImage}
                    readonly={readonly}/>
                <InputDropdown 
                    isSummary={isSummary}
                    ques={ques} 
                    idx={idx} 
                    uploadOptionImage={uploadOptionImage}
                    removeOptionImage={removeOptionImage}
                    readonly={readonly}/>
        </React.Fragment>;
    }
}

export default Preview;
