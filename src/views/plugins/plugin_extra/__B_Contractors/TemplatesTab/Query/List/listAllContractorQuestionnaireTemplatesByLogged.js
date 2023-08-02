import listAllContractorQuestionnaireTemplatesByLoggedImpl from "./listAllContractorQuestionnaireTemplatesByLoggedImpl";

export const byCompany = (
    {
        company_id,
    }
) => {
    return listAllContractorQuestionnaireTemplatesByLoggedImpl({
        org_id: {key: 'company_id', value: company_id},
    });
};

export const byClient = (
    {
        client_id,
    }
) => {
    return listAllContractorQuestionnaireTemplatesByLoggedImpl({
        org_id: {key: 'client_id', value: client_id},
    });
};