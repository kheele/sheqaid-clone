import React from "react";
import {observer} from 'mobx-react';

import {Row} from 'components/FormComponents';
import NextOfKinSection from "./NextOfKinSection";
import DependantSection from "./DependantSection";

@observer
class ViewDependentsAndNextOfKinSection extends React.Component {
    pageKey = "DependentsAndNextOfKinSection";

    constructor(props) {
        super(props);
    }
    
    render() {
        const {onFormNext, onFormBack, onFormOpen, item, idx} = this.props;
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls pos-relative">
                    <Row
                        rendered
                        idx={idx + ".1"}
                        title={idx + ".1 Next Of Kin"}
                        sectionClassName="h-380 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NextOfKinSection item={item} isEmbedded/>
                    </Row>
                    <Row
                        rendered
                        idx={idx + ".2"}
                        title={idx + ".2 Dependant(s)"}
                        sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <DependantSection item={item} isEmbedded/>
                    </Row>
                </div>
            </div>
        </div>;
    }
}

export default ViewDependentsAndNextOfKinSection;