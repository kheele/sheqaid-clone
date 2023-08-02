import React from "react";
import {observer} from 'mobx-react';
import {ProfileField, SelectClientInput, SelectProjectInput, SelectSiteInput} from "./index";
import {Row} from "../FormComponents";
import {computed} from "mobx";

@observer
class RowOrgs extends React.Component {

    @computed get child() {
        const {children} = this.props;
        if(!children) return null;

        const {onFormOpen, onFormBack, onFormNext, onChange} = this.props;

        const {isContractor, isHasProjects} = storage.is;

        const props = {
            onFormOpen,
            onFormNext
        };

        if(onChange) {
            props.onChange = onChange;
        }
        if (isHasProjects) {
            props.onFormBack = onFormBack;
        }

        return React.Children.map(children, (child, index) => {
            if(!child) return null;
            return React.cloneElement(child, props);
        }).filter(child => !!child);
    }

    render() {
        const {
            onFormOpen, onFormNext, onChange,
            readonly, title, idx = 0, active = true,
            client, project, site, showAll
        } = this.props;

        const {isContractor, isConsultant, isHasProjects} = storage.is;

        if (!isHasProjects) {
            return this.child;
        }
        return <React.Fragment>
            <Row
                rendered
                active={active}
                idx={idx}
                title={`${title || (isConsultant ? 'Company / ' : '')}Project / Site`}
                onFormOpen={onFormOpen}
                onFormNext={onFormNext}
            >
                {readonly && <React.Fragment>
                    {isConsultant && <ProfileField name="client" value={client} renderer={v => v.name || v.data.name}
                                                   placeholder="Company" className="col-lg-12"/>}
                    <ProfileField name="project" value={project} renderer={v => v.name || v.data.name}
                                  placeholder="Project" className="col-lg-12"/>
                    <ProfileField name="site" value={site} renderer={v => v.name || v.data.name} placeholder="Site"
                                  className="col-lg-12"/>
                </React.Fragment>}
                {!readonly && <React.Fragment>
                    {isConsultant && <SelectClientInput name="client" placeholder="Company..." defaultValue={client}
                                                        showAll={showAll} required
                                                        className="col-lg-12 form-control" onChange={onChange}/>}
                    <SelectProjectInput name="project" placeholder="Project..." defaultValue={project} showAll={showAll}
                                        required
                                        className="col-lg-12 form-control" onChange={onChange}/>
                    <SelectSiteInput name="site" placeholder="Site..." defaultValue={site} showAll={showAll} required
                                     className="col-lg-12 form-control" onChange={onChange}/>
                </React.Fragment>}
            </Row>
            {this.child}
        </React.Fragment>;
    }
}

export default RowOrgs;