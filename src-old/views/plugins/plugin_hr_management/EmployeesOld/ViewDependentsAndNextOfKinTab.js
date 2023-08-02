import React from "react";
import {observer} from 'mobx-react';
import {observable} from 'mobx';

import {Row} from '../../../../components/FormComponents';
import {ProfileField} from '../../../../components/inputs';

@observer
class ViewDependentsAndNextOfKinTab extends React.Component {
    pageKey = "ViewDependentsAndNextOfKinTab";
    
    @observable
    selfState = {
    };

    constructor(props) {
        super(props);
    }
    
    render() {
        const {
            onFormNext, onFormBack, onFormOpen,
            item: {
                id, data: {
                    next_of_kin_1, next_of_kin_2, dependants
                }
            },
            idx
        } = this.props;
        
        const className = this.pageKey + "-tab" + (this.props.active ? ' active' : '');
        return <div id={this.pageKey + "-tab"} className={className}>
            <div className="controls-wrapper controls-sectioned">
                <div className="controls pos-relative">
                    <Row 
                        rendered 
                        idx={idx + ".1"} 
                        title={idx + ".1 Next Of Kin #1"}  
                        onFormOpen={onFormOpen} 
                        onFormNext={onFormNext}
                    >
                            <ProfileField name="next_of_kin_1_fname" placeholder="First Name" value={next_of_kin_1 && next_of_kin_1.fname} className="col-lg-6"/>
                            <ProfileField name="next_of_kin_1_lname" placeholder="Last Name" value={next_of_kin_1 && next_of_kin_1.lname} className="col-lg-6"/>
                            <ProfileField name="next_of_kin_1_phone1" placeholder="1) Phone No." value={next_of_kin_1 && next_of_kin_1.phone1} className="col-lg-6"/>
                            <ProfileField name="next_of_kin_1_phone2" placeholder="2) Phone No." value={next_of_kin_1 && next_of_kin_1.phone2} className="col-lg-6"/>
                            <ProfileField name="next_of_kin_1_relationship" placeholder="Relationship" value={next_of_kin_1 && next_of_kin_1.relationship} className="col-lg-12"/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".2"} 
                        title={idx + ".2 Next Of Kin #2"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                        onFormNext={onFormNext}
                    >
                        <ProfileField name="next_of_kin_2_fname" placeholder="First Name" value={next_of_kin_2 && next_of_kin_2.fname} className="col-lg-6"/>
                        <ProfileField name="next_of_kin_2_lname" placeholder="Last Name" value={next_of_kin_2 && next_of_kin_2.lname} className="col-lg-6"/>
                        <ProfileField name="next_of_kin_2_phone1" placeholder="1) Phone No." value={next_of_kin_2 && next_of_kin_2.phone1} className="col-lg-6"/>
                        <ProfileField name="next_of_kin_2_phone2" placeholder="2) Phone No." value={next_of_kin_2 && next_of_kin_2.phone2} className="col-lg-6"/>
                        <ProfileField name="next_of_kin_2_relationship" placeholder="Relationship" value={next_of_kin_2 && next_of_kin_2.relationship} className="col-lg-12"/>
                    </Row>
                    <Row 
                        rendered 
                        idx={idx + ".3"} 
                        title={idx + ".3 Dependant(s)"}  
                        onFormOpen={onFormOpen} 
                        onFormBack={onFormBack} 
                    >
                        {/*<NewDependantsTable name="dependants"/>*/}
                    </Row>
                </div>
            </div>
        </div>
    }
}

export default ViewDependentsAndNextOfKinTab;