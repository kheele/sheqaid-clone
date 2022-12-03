import React from 'react';
import {observer} from 'mobx-react';
import {autorun, computed, extendObservable, isObservableArray, observable} from 'mobx';

import {
    addResponseMessage,
    addUserMessage,
    deleteMessages,
    toggleWidget,
    Widget as ChatWidget
} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import Popover from './Popover';

import style from './ChatBox.lazy.css';

@observer
class ChatBox extends React.Component {
    
    @observable state = {
        parentId: null,
        index: null,
        ques: null
    };
    
    constructor(props) {
        super(props);
        
        this.setActiveQuestion = this.setActiveQuestion.bind(this);
        this.onNewUserMessage = this.onNewUserMessage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        style.use();
    }

    componentDidMount() {
        autorun(() => {
            const {list, willAddInternal, hasLoaded} = this;
            if(hasLoaded) {
                return;
            }
            
            const listDistinct = list;//.distinct('date');
//            alert(listDistinct.length)
            
            if(!willAddInternal) {
               deleteMessages(listDistinct.length); 
               setTimeout(() => this.addMessages(), 500);
            }
        });
    }

    componentWillUnmount() {
        style.unuse();
    }
        
    onNewUserMessage(msg){
//        alert(msg)
//        this.list.push(newMessage);
//        addUserMessage(newMessage);
    }
        
    handleSubmit(msg){
        const {id: uid} = storage.loggedUser.user;
        msg = {sender: {uid}, msg, read: false, date: new Date()};
        this.willAddInternal = true;
        this.list.push(msg);
        setTimeout(() => {
            this.willAddInternal = false;
        });
        this.onChange && this.onChange(msg);
    }
    
    readonly(readonly) {
        this._readonly = readonly;
        return this;
    }
    
    setActiveQuestion({parentId, quesPath, ques, btn}, onChange) {
        this.hasLoaded = true;
        
        this.onChange = onChange;
        if(!ques.message_list || (ques.message_list && !isArray(ques.message_list) && !isObservableArray(ques.message_list))) {
            extendObservable(ques, {message_list: []});
        }
        
        const open = btn.toggle();
        
        const index = quesPath.filter(v => v.isNumeric()).map(v => parseInt(v) + 1).join('.');
        
        const current = this.isCurrent(parentId, index);
        
        const createSettings = () => {
            return {
                strictPos: true,    
                style: {width: 370, height: 450, position: 'fixed'},
                className: 'chatbox-popover',
                contentNode: <div className={"ChatBox" + (this._readonly ? " readonly" : "")}>
                    <ChatWidget 
                        key={parentId + index}
                        subtitle={ques.questionText}
                        showCloseButton={false}
                        handleNewUserMessage={this.onNewUserMessage}
                        handleSubmit={this.handleSubmit}/>
                </div>,
                onClosed: () => {
                    const list = ques.message_list.map(v => v);
                    const listDistinct = list;//.distinct('date');
                    deleteMessages(listDistinct.length);
                    ques.message_list = listDistinct;
                    
                    btn.close();
                    toggleWidget();
                }
            };
        };
        
        const activate = () => {
            this.refs.popover.settings(createSettings()).open();
            toggleWidget();
            setTimeout(() => this.addMessages(), 500);
        };
        
        const oldIdx = this.state.index;
        if(!current) {
            this.state.ques = null;
            this.state.ques = ques;
            this.state.parentId = parentId;
            this.state.index = index;
            
            setTimeout(() => activate(), 500);
        } else if(open && current) {
            activate();
        } else if(!open && current) {
            this.refs.popover.close();
        }
    }
    
    isCurrent(_parentId, _index) {
        const {parentId, index} = this.state;
        return parentId === _parentId && index === _index;
    }
    
    addMessages() {
        const listDistinct = (this.list || []);//.distinct('date');
        listDistinct.forEach(({sender, read, msg, date}) => {
            if(sender.uid === storage.loggedUser.user.id) {
                addUserMessage(msg);
            } else {
                addResponseMessage(msg);
            }
        });
        this.hasLoaded = false;
    }
    
    @computed get list() {
        if(!this.state.ques) return [];
        return (this.state.ques.message_list || []);
    }
    
    render() {
        return <Popover ref="popover" preventAutoClose/>;
    }
}

export default ChatBox;
