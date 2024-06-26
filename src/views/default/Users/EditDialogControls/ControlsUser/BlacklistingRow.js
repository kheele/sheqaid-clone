// <editor-fold defaultstate="collapsed" desc="imports">
import React from "react";
import {observer} from 'mobx-react';
import {FormControls, Row} from "components/FormComponents";
import {Permissions} from "utils/Utils";
import NewClientListUpdateBlacklistTable from "components/FormTableComponents/NewClientListUpdateBlacklistTable";
import NewProjectListUpdateBlacklistTable from "components/FormTableComponents/NewProjectListUpdateBlacklistTable";
import NewSiteListUpdateBlacklistTable from "components/FormTableComponents/NewSiteListUpdateBlacklistTable";

// </editor-fold>

@observer
class BlacklistingRow extends React.Component {

    // <editor-fold defaultstate="collapsed" desc="constructor">
    constructor(props) {
        super(props);
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="render">
    render() {
        const {
            isConsultant,
            isNoProjects,
            isClientBlacklisted,
            isProjectBlacklisted,
            isSiteBlacklisted
        } = storage.is;

        const {
            item: {
                id, data: {
                    client,
                    project,
                    site,
                    client_blacklist = [],
                    project_blacklist = [],
                    site_blacklist = [],
                }
            }
        } = this.props;

        const showBlacklisting = !isClientBlacklisted(client) && !isProjectBlacklisted(project) && !isSiteBlacklisted(site);
        if (!showBlacklisting) return null;

        if (Permissions.disallowOther("Blacklisting")) {
            return null;
        }

        const {
            idx,
            onFormOpen,
            onFormBack,
            onFormNext,
            onFormSave,
            onChange,
        } = this.props;

        let idx_1 = 1;
        return <Row
            rendered
            active={isNoProjects}
            idx={'Blacklisting'}
            title={`${idx}. Blacklisting`}
            onFormOpen={onFormOpen}
            onFormNext={onFormNext}
            onFormBack={!isNoProjects && onFormBack}
        >
            <FormControls>
                {isConsultant && !isClientBlacklisted(client) && <Row
                    rendered
                    idx={'BlacklistedCompanies'}
                    title={(idx + "." + idx_1) + ". Blacklisted Companies"}
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormSave={onFormSave}
                >
                    <NewClientListUpdateBlacklistTable
                        name="client_blacklist"
                        defaultValue={[...client_blacklist, null]}
                        onChange={onChange}
                    />
                </Row>}
                {!isProjectBlacklisted(project) && <Row
                    rendered
                    idx={'BlacklistedProjects'}
                    title={(idx + "." + (idx_1++)) + ". Blacklisted Projects"}
                    onFormOpen={onFormOpen}
                    onFormNext={onFormNext}
                    onFormBack={onFormBack}
                    onFormSave={onFormSave}
                >
                    <NewProjectListUpdateBlacklistTable
                        name="project_blacklist"
                        defaultValue={[...project_blacklist, null]}
                        onChange={onChange}
                    />
                </Row>}
                {!isSiteBlacklisted(project) && <Row
                    rendered
                    idx={'BlacklistedSites'}
                    title={(idx + "." + (idx_1++)) + ". Blacklisted Sites"}
                    onFormOpen={onFormOpen}
                    onFormBack={onFormBack}
                    onFormSave={onFormSave}
                >
                    <NewSiteListUpdateBlacklistTable
                        name="site_blacklist" defaultValue={[...site_blacklist, null]}
                        onChange={onChange}
                    />
                </Row>}
            </FormControls>
        </Row>;
    }

    // </editor-fold>
}

export default BlacklistingRow;
