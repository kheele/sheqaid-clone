import React from 'react';
import {observer} from 'mobx-react';
import {computed, extendObservable, isObservableArray, observable, toJS} from 'mobx';
import moment from 'moment';

import {
    addResponseMessage,
    addUserMessage,
    deleteMessages,
    renderCustomComponent,
    toggleWidget,
    Widget as ChatWidget
} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import {Dates, execWhen} from '../../utils/Utils';
import {Button} from '../inputs';

import Popover from './Popover';

import style from './ChatBox.lazy.css';

@observer
class ChatBox extends React.Component {
    
    @observable state = {
        id: null,
        item: null
    };
    
    constructor(props) {
        super(props);
        
        this.setActiveItem = this.setActiveItem.bind(this);
        this.onNewUserMessage = this.onNewUserMessage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onEmail = this.onEmail.bind(this);
    }

    componentWillMount() {
        style.use();
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
        const {id: sender_id} = storage.loggedUser.user;
        msg = {sender_id, msg, read: false, date: new Date()};
        this.list.push(msg);
        this.onChange && this.onChange(msg);
    }
        
    onEmail(evt, _btn){
        const {item, list, btn, onChange} = this;
        if(list.isEmpty()) {
            infoDialog.open('No messages available');
            return;
        }
        
        execWhen(() => document.querySelector('.InputDialog')).then(InputDialog => {
            $(InputDialog).css('z-index', 1402);
        });
        
        inputDialog.onClosing(() => {
            ;
            $(document.querySelector('.InputDialog')).css('z-index', 1400);
            
            this.setActiveItem(item, btn, onChange);
        }).open("Email Address").then(text => {
            if(!text) return;
            if(text.replaceAll(' ', '').isEmpty()) {
                infoDialog.open('Email Address is required');
                return;
            }
            if(!text.isEmailAddress()) {
                infoDialog.open('Please enter a valid Email Address');
                return;
            }
            
            progressDialog.open();
            neonBinding.events.emit(`plugin_sheq_assist/COIDA_Management/claims/client/email-chat`, toJS(item), list.slice(), text).then(res => {
                console.log("email-chat res", res)
                if(res) {
                    infoDialog.open("Chat successfully sent to email.");
                } else {
                    infoDialog.open("An error occurred. Please try again.");
                }
            }).finally(() => {
                setTimeout(() => {
                    progressDialog.close();
                }, 100);
            });
        });
    }
    
    readonly(readonly) {
        this._readonly = readonly;
        return this;
    }
    
    setActiveItem(item, btn, onChange) {
        this.btn = btn;
        this.onChange = onChange;
        const {
            id, data: {
                claim_number,
                message_list_provider = []
            }
        } = item;
        if(!message_list_provider || (!isArray(message_list_provider) && !isObservableArray(message_list_provider))) {
            extendObservable(item.data, {message_list_provider: []});
        }
        item.data.message_list_provider = message_list_provider || [];
        
//        this.state.item = item;
        
        const open = btn.toggle();
        const current = this.isCurrent(id);
        
        const createSettings = () => {
            const subtitle = <React.Fragment>
                Claim #: {claim_number || 'N/A'}
                <Button className="btn btn-primary pull-right -margin-t-5 -margin-b-5 padding-t-5 padding-b-5 _888" onClick={this.onEmail}> 
                    <i className="fa fa-envelope"/> Email Chat
                </Button>
            </React.Fragment>;
            return {
                strictPos: true,
                style: {width: 370, height: 375, position: 'fixed'},
                className: 'chatbox-popover chatbox-claim-popover',
                contentNode: <div className={"ChatBox" + (this._readonly ? " readonly" : "")}>
                    <ChatWidget 
                        key={id}
                        subtitle={subtitle}
                        showCloseButton={false}
                        handleNewUserMessage={this.onNewUserMessage}
                        handleSubmit={this.handleSubmit}/>
                </div>,
                onClosed: () => {
                    const list = (item.data.message_list_provider || []).map(v => v);
                    deleteMessages();
                    item.data.message_list_provider = list;
                    
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
        
        const oldId = this.state.id;
        if(!current) {
            this.state.item = null;
            
            setTimeout(() => {
                this.state.item = item;
                this.state.id = id;

                activate();
            }, 500);
        } else if(open && current) {
            activate();
        } else if(!open && current) {
            this.refs.popover.close();
        }
    }
    
    isCurrent(_id) {
        const {id} = this.state;
        return id === _id;
    }
    
    addMessages() {
        (this.list || []).forEach(({sender_id, read, msg, date}) => {
            if(sender_id === storage.loggedUser.user.id) {
                addUserMessage(msg);
            } else {
                addResponseMessage(msg);
            }
            renderCustomComponent(CustomTimeStampFragment, {date})
        });
    }
    
    @computed get item() {
        return this.state.item;
    }
    
    @computed get list() {
        return this.item.data.message_list_provider;
    }
    
    render() {
        return <Popover ref="popover" preventAutoClose/>;
    }
}

const CustomTimeStampFragment = ({date}) => {
    date = Dates.parse(date);
    date = new Date().getDate() === date.getDate() ? 
            moment(date).format('LT') : 
            moment(date).format('ddd LT');
    return <div style={{fontSize: 10, margin: '-24px 0 0', background: '#fff'}}>
	{date}
    </div>;
}

export default ChatBox;
