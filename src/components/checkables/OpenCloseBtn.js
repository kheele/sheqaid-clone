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
        const {ques} = this.props;
        setTimeout(() => {
            if(!ques.open) {
                this.questions.forEach(q => q.open = false);
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
    
    @computed
    get questions() {
        const {questions} = this.props;
        if(isArray(questions) || isObservableArray(questions)) {
            return questions;
        } else {
            return Object.values(questions);
        }
    }
    
    render() {
        const {ques, top} = this.props;
        return <Button key={new Date().getTime()} className={"btn btn-primary pull-left fa open-close-btn font-size-24 " + (top ? "open-close-btn-top " : "") + (ques.open ? "fa-angle-up" : "fa-angle-down")} onClick={this.onClick}/>;
    }
}

export default OpenCloseBtn;
