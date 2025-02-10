import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Row} from 'components/FormComponents';

@observer
class ViewPPESection extends React.Component {
    pageKey = "ViewPPESection";

    @observable
    state = {};

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);
    }

    //</editor-fold>

    render() {
        const {onFormNext, onFormBack, onFormOpen, item, idx} = this.props;

        const {
            id,
            data: {
                department, job_position, supervisor,
                employment_date, employment_num,
            }
        } = item;

        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls pos-relative">
                    <Row
                        rendered
                        idx={idx + ".1"}
                        title={idx + ".1 PPE Attire"}
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >

                    </Row>
                    <Row
                        rendered
                        idx={idx + ".2"}
                        title={idx + ".2 PPE Issue"}
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                        onFormNext={onFormNext}
                    >

                    </Row>
                    <Row
                        rendered
                        idx={idx + ".3"}
                        title={idx + ".3 PPE Matrix"}
                        sectionClassName="h-370 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >

                    </Row>
                </div>
            </div>
        </div>
    }
}

export default ViewPPESection;
