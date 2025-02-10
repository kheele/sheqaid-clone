// <editor-fold defaultstate="collapsed" desc="import">
import React from "react";
import {observer} from 'mobx-react';

import {ChatButton} from 'components/inputs';
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="ChatBtn">
@observer
class ChatBtn extends React.Component {
    
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    
    onClick() {
        const {onClick} = this.props;
        onClick(this.refs.btn);
    }
    
    render() {
        const {idx, item: {data: {message_list_provider = []}}} = this.props;
        return <button 
            onClick={this.onClick}
            type="button" 
            className="rcw-launcher fixed-center Claim-chat-btn" 
            aria-controls="rcw-chat-container">
                {!message_list_provider.isEmpty() && <span className="counter">{message_list_provider.length}</span>}
                <ChatButton ref="btn" idx={idx}/>
        </button>;
    }
}
// </editor-fold>

export default ChatBtn;