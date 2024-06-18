import React from "react";
import {observer} from 'mobx-react';

import Form from 'utils/Form';
import {Dates} from 'utils/Utils';

import {Row} from 'components/FormComponents';
import NextOfKinSection from "./NextOfKinSection";
import DependantSection from "./DependantSection";
import Settings from "../../../../../utils/Settings";

@observer
class EditDependentsAndNextOfKinSection extends React.Component {
    pageKey = "NewDependentsAndNextOfKinTab";
    isValid = Settings.isValidEmployeeDependantsAndNextOfKinViewers;

    //<editor-fold desc="constructor">
    constructor(props) {
        super(props);

        this.form = new Form();
    }

    //</editor-fold>

    //<editor-fold desc="formData">
    get formData() {
        const {data} = this.form;
        let {
            //
            next_of_kin_list,
            //
            dependent_list,
        } = data;

        return {
            next_of_kin_list: {data: (next_of_kin_list || []).slice().map(v => ({...v}))},
            //
            dependent_list: {data: (dependent_list || []).map(v => ({...v, dob: Dates.formatTimestampSQL(v.dob)}))},
        }
    }

    //</editor-fold>

    //<editor-fold desc="render">
    render() {
        const {onFormNext, onFormBack, onFormOpen, item, idx} = this.props;

        let {
            id,
        } = (item && item.data) || {};
        const isNewEmployee = !id;

        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls">
                    {Settings.isValidEmployeeNextOfKinViewers(item) && <Row
                        rendered
                        idx={idx + ".1"}
                        title={idx + ".1 Next Of Kin"}
                        sectionClassName="h-380 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormNext={onFormNext}
                    >
                        <NextOfKinSection item={item} isNewEmployee={isNewEmployee} isEmbedded
                                          onChange={this.form.onChange}/>
                    </Row>}
                    {Settings.isValidEmployeeDependantsViewers(item) && <Row
                        rendered
                        idx={idx + ".2"}
                        title={idx + ".2 Dependant(s)"}
                        sectionClassName="h-300 -margin-l-10 -margin-t-5 -margin-b-10 w-full-calc-add-20"
                        onFormOpen={onFormOpen}
                        onFormBack={onFormBack}
                    >
                        <DependantSection item={item} isNewEmployee={isNewEmployee} isEmbedded
                                          onChange={this.form.onChange}/>
                    </Row>}
                </div>
            </div>
        </div>
    }

    //</editor-fold>
}

export default EditDependentsAndNextOfKinSection;