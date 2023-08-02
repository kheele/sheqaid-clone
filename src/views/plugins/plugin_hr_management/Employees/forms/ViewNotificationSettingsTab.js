import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {ProfileField} from 'components/inputs';

@observer
class ViewNotificationSettingsTab extends React.Component {
    pageKey = "ViewNotificationSettingsTab";
    
    @observable
    state = {
    };
    
    constructor(props) {
        super(props);
    }

    render() {
        const {
            onFormNext, onFormBack, onFormOpen,
            item: {
                id, data: {
                    receive_expired_docs_notifs, 
                }
            }
        } = this.props;
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper">
                <div className="controls pos-relative">
                    <ProfileField title="Receive Expired Documents Notifications" name="receive_expired_docs_notifs" value={receive_expired_docs_notifs ? 'Yes' : 'No'} className="col-lg-12"/>
                </div>
            </div>
        </div>;
    }
}

export default ViewNotificationSettingsTab;