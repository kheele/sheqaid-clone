import React from "react";
import {observer} from 'mobx-react';

import {TinyMCE} from 'components/documents';

import {ClearableInput, SelectClientInput} from 'components/inputs';

import style from "./NewTinyMCEHeader.lazy.css";

@observer
class NewTinyMCEHeader extends React.Component {
    
    componentWillMount() {
        style.use();
    }
    
    componentWillUnmount() {
        style.unuse();
    }
    
    render() {
        const {name, state, onChange} = this.props;
        const {isConsultant} = storage.is;
        return state.showTinyMCE && <div className="NewTinyMCEHeader row sec-group padding-r-10">
            <div className="row flex margin-0 margin-t-10 margin-b-20 row-header">
                <div className="row margin-0 fixed-flex min-w-300">
                    <h3 className="fixed-center margin-0">SHEQ Aid</h3>
                </div>
                <div className="row row-header-name margin-0">
                    <div className="row margin-0 h-half padding-10">
                        {isConsultant && <div className="row">
                            <SelectClientInput name="client" placeholder="Company Name" required className="col-lg-12 form-control" onChange={onChange}/>
                        </div>}
                        {!isConsultant && <h3 className="text-center margin-0">Company Name</h3>}
                    </div>
                    <div className="row margin-0 h-half padding-10">
                        <ClearableInput name="title" type="textarea" placeholder="Document Title" required className="col-lg-12 form-control" onChange={onChange}/>
                    </div>
                </div>
                <div className="row row-header-numbers margin-0 fixed-flex min-w-300">
                    <div className="row margin-0 padding-10">
                        <ClearableInput name="doc_num" type="text" placeholder="Document Number" required className="col-lg-12 form-control" onChange={onChange}/>
                    </div>
                    <div className="row margin-0 padding-10">
                        <ClearableInput name="doc_rev_num" type="text" placeholder="Revision Number" required className="col-lg-12 form-control" onChange={onChange}/>
                    </div>
                    <div className="row margin-0 padding-10">
                        <ClearableInput name="doc_page_num" type="text" placeholder="Page Number" required className="col-lg-12 form-control" onChange={onChange}/>
                    </div>
                </div>
            </div>
            <TinyMCE state={state} name={name} onChange={onChange}/>
        </div>;
    }
}

export default NewTinyMCEHeader;
