/* eslint-disable camelcase */

import create, {insertEmployeeDocDocumentIDOrPassport, insertEmployeeDocDocumentPrDP} from "../create";
import crudUtils from "../all/CRUDUtils/CRUDUtils";

//General
export const insertErrorReporting = create("error-reporting", null, input => {
    const {
        error,
        errorInfo,
    } = input;

    input.message = error.message || "";
    input.stack = error.stack || "";
    input.error_info = errorInfo && errorInfo.componentStack || "";

    delete input.error;
    delete input.errorInfo;

    const {is: {isLoggedIn, isConsultant}} = storage;
    if (isLoggedIn) {
        const {loggedUser = {}, selected = {}, loggedContractor} = storage;
        const {access_type, company = {}, user = {}} = loggedUser;
        const {data: user_data = {}} = user;

        const {client, project, site, contractor} = user_data;

        const {selectedClient, selectedProject, selectedSite, selectedContractorSite} = selected;

        input.access_type = access_type;

        input.company_id = company.id;
        if (isConsultant) {
            input.client_id = client && client.id;
            input.project_id = project && project.id;
            input.site_id = site && site.id;

            input.selected_client_id = selectedClient && selectedClient.id;
            input.selected_project_id = selectedProject && selectedProject.id;
            input.selected_site_id = selectedSite && selectedSite.id;
        }
        input.contractor_id = contractor && contractor.id;
        input.logged_contractor_id = loggedContractor && loggedContractor.id;
        input.selected_contractor_site_id = selectedContractorSite && selectedContractorSite.id;

        input.user_id = user && user.id;
    }

    // return onCreate(data).then(res => {
    //     infoDialog.open(<>
    //         <p>Problem successfully reported!</p>
    //         <p>We will fix it as soon as possible.</p>
    //     </>);
    //     infoDialog.close(5000);
    // });
});

//
export const insertEmployeeDocDocument = async (data) => {
    const {formData: {type}} = data;
    const type_funs = {
        'PrDP': insertEmployeeDocDocumentPrDP,
        'ID/Passport': insertEmployeeDocDocumentIDOrPassport,
    };
    const insert = type_funs[type];
    return insert(data);
};
export const insertEmployee = async (data) => {
    const {
        formData,
        optionalInfoFormData,
        documentsFormData,
        counselingFormData,
        warningFormData,
        timeOffFormData,
    } = data;

    const insert = create("employees");

    await insert("START");
    //
    await insert({formData, optionalInfoFormData});
    await insert({counselingFormData});
    await insert({warningFormData});
    await insert({timeOffFormData});
    //
    if (documentsFormData) {
        let {
            'document_list__ID/Passport': document_list__id_or_passport,//
            'document_list__PrDP': document_list__prdp,//
            license_list,//

            competency_list,//
            contract_list,//
            medical_list,//
            work_permit_list,//
            job_appointment_list,//
        } = documentsFormData;

        await Promise.all(Object.keys(documentsFormData).map(async key => {
            return await insert({[key]: documentsFormData[key]});
        }));
    }
    //
    // await insert({documentsFormData});
    //
    return await insert("END");
    // return await insert(data);
};

//Incidents
export const insertIncident = create("incidents", crudUtils, input => {
    const {
        //0
        site,
        project,
        client,
        //6.1
        person_involved_list,
        //6.2
        person_reporting,
        person_reporting_other,
        //6.3
        person_reported_to_other,
        //6.4
        witness_list,
        //6.5
        distribution_list,

        //7.1
        person_injured_other,//
    } = input;

    //6
    if (person_involved_list) {
        person_involved_list.data.forEach(({person_involved_other}) => {
            if (person_involved_other) {
                crudUtils.injectCreate(person_involved_other.data);
            }
        });
    }
    if (witness_list) {
        witness_list.data.forEach(({witness_other}) => {
            if (witness_other) {
                crudUtils.injectCreate(witness_other.data);
            }
        });
    }
    if (distribution_list) {
        distribution_list.data.forEach(({other_person}) => {
            if (other_person) {
                crudUtils.injectCreate(other_person.data);
            }
        });
    }

    if (person_reported_to_other && person_reported_to_other.data) {
        crudUtils.injectCreate(person_reported_to_other.data);
    }
    if (person_reporting_other && person_reporting_other.data) {
        crudUtils.injectCreate(person_reporting_other.data);
    }
    if (person_injured_other && person_injured_other.data) {
        crudUtils.injectCreate(person_injured_other.data);
    }
});