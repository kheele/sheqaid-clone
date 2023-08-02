import React from 'react';
import {findDOMNode} from 'react-dom';
import {observer} from 'mobx-react';
import {computed, isObservableArray} from 'mobx';

import {Button} from '../inputs';

@observer
class OpenCloseBtn extends React.Component {
    
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    
    onClick() {
        const {ques, question_list} = this.props;
        setTimeout(() => {
            if(!ques.open) {
                question_list.forEach(q => q.open = false);
            }
            ques.open = !ques.open;
            
            setTimeout(() => {
                try{
                    const jq = $(findDOMNode(this)).closest('.ListDraggable');
                    const scrollTop = jq.height() + jq.offset().top - 30;
                    jq.closest('.dialog-content').animate({scrollTop}, 1500, () => {
                        
                    });
                } catch(err) {

                }
            }, 500);
        });
    }

    render() {
        const {ques, top} = this.props;
        return <Button key={new Date().getTime()} className={"btn btn-primary pull-left fa open-close-btn font-size-24 " + (top ? "open-close-btn-top " : "") + (ques.open ? "fa-angle-up" : "fa-angle-down")} onClick={this.onClick}/>;
    }
}

export default OpenCloseBtn;
