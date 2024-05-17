import findByFirestoreIdUser from "../../mutations/all/User/findByFirestoreIdUser";
import findByFirestoreIdContractorUser from "../../mutations/all/ContractorUser/findByFirestoreIdContractorUser";
import findByFirestoreIdEmployee from "../../mutations/all/Employee/findByFirestoreIdEmployee";
import findByFirestoreIdContractorsQuestionnaireTemplate
    from "../../mutations/all/Questionnaires/ContractorsQuestionnaireTemplate/findByFirestoreIdContractorsQuestionnaireTemplate";
import {Dates} from "../Dates";

//<editor-fold desc="transfer">
export const process_questionnaire_map = is_page_title => {
    return async (
        {
            answer,//
            expiry,//
            hasExpiry,//
            isEditableDoc,
            isMandatory,//
            isMultiAnswer,//
            maxScore,//
            notifiedList,//
            notify,//
            notifyAction,//
            questionImage,//
            questionText,//
            questionType,//
            score,//
            linkDoc,//
            questions,//
            message_list: __message_list,//
            //
            sectionText,//
        }
    ) => {
        if(!questionText && !sectionText) return;

        const pg_link_doc = await findByFirestoreIdContractorsQuestionnaireTemplate(linkDoc);

        const notified_list = (await Promise.all((notifiedList || []).map(async v => {
            if (!v.id) return;

            const pg_employee = await findByFirestoreIdEmployee(v.id);
            if (!pg_employee) return;

            return {employee_id: pg_employee.id};
        }))).filter(v => !!v);
        const message_list = (await Promise.all((__message_list || []).map(async (
            {
                msg,
                read,
                date,
                sender,
                recipient_id,
                contractor_sender_id,
                contractor_recipient_id,
                logged_user_id
            }
        ) => {
            const pg_sender = await findByFirestoreIdUser(sender && sender.uid);
            const pg_recipient = await findByFirestoreIdUser(recipient_id);
            const pg_contractor_sender = await findByFirestoreIdContractorUser(contractor_sender_id);
            const pg_contractor_recipient = await findByFirestoreIdContractorUser(contractor_recipient_id);
            const pg_logged_user = await findByFirestoreIdUser(logged_user_id);

            if(!pg_logged_user) return;

            return {
                msg,
                read,
                date: Dates.formatTimestampSQL(date),
                sender_id: pg_sender && pg_sender.id,
                recipient_id: pg_recipient && pg_recipient.id,
                contractor_sender_id: pg_contractor_sender && pg_contractor_sender.id,
                contractor_recipient_id: pg_contractor_recipient && pg_contractor_recipient.id,
                logged_user_id: pg_logged_user && pg_logged_user.id
            };
        }))).filter(v => !!v);

        const item = {
            is_page_title,//
            answer,//
            expiry: Dates.formatTimestampSQL(expiry),//
            hasExpiry,//
            isEditableDoc,
            isMandatory,//
            isMultiAnswer,//
            maxScore,//
            notified_list: {data: notified_list},//
            notify,//
            notifyAction,//
            questionImage,//
            questionText,//
            questionType,//
            score,//
            message_list: {data: message_list},
            link_doc_id: pg_link_doc && pg_link_doc.id,
        };
        if (questions && questions.length) {
            item.question_list = {data: (await Promise.all(questions.map(process_questionnaire_map(is_page_title)))).filter(v => !!v)};
        }
        if (sectionText) {
            item.questionText = sectionText;
        }
        return item;
    };
};
//</editor-fold>
