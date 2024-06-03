import React from 'react';
import { observer } from 'mobx-react';
import { TabledTopPanel } from "components/tables";

@observer
class PageTitle extends React.Component {

    render() {
        const {renderBackBtn, title, children} = this.props;
        return <div key="pageTitle" className="page-title">
            {renderBackBtn && renderBackBtn()}
            {title && <h3 key="title">{title}</h3>}
            {children && <TabledTopPanel ref="tabledTopPanel">
                {children}
            </TabledTopPanel>}
        </div>;
    }
}

export default PageTitle;