import {execWhen} from 'utils/UtilsFuns';

const show = ({mainSection, childLevel1Ref, childLevel2Ref}) => {
    mainSection.onFormGoto();
    childLevel1Ref && execWhen(() => mainSection.refs[childLevel1Ref]).then(ref => {
        ref.onFormGoto();
        childLevel2Ref && execWhen(() => ref.refs[childLevel2Ref]).then(ref => {
            ref.onFormGoto();
        });
    });
};

//http://localhost:4000/static/js/C:/Users/850 G5/WebstormProjects/sheqaid/src/views/plugins/plugin_hr_management/Employees/forms/ProfileDialog.js
export function onOpenSections(id) {
    const {
        optionalInfoSection,
        documentsSection,
        counselingSection,
        warningSection,
        timeOffSection,
    } = this.refs;

    console.log(this)

    alert(id)

    switch (id) {
        //Employment Info: 3
        case "living_address":
            show({mainSection: optionalInfoSection, childLevel1Ref: 'residentialAddress'});
            break;
        case "banking_detail":
            show({mainSection: optionalInfoSection, childLevel1Ref: 'bankingDetails'});
            break;
        case "next_of_kin":
            show({mainSection: optionalInfoSection, childLevel1Ref: 'next_of_kins'});
            break;
        case "dependent":
            show({mainSection: optionalInfoSection, childLevel1Ref: 'dependants'});
            break;
        //Documents: 4
        //Personal Documents: 4.1
        case "document_id_passport":
            show({
                mainSection: documentsSection,
                childLevel1Ref: 'personalDocuments',
                childLevel2Ref: 'document_id_passport',
            });
            break;
        case "work_permit":
            show({
                mainSection: documentsSection,
                childLevel1Ref: 'personalDocuments',
                childLevel2Ref: 'work_permit',
            });
            break;
        case "license":
            show({
                mainSection: documentsSection,
                childLevel1Ref: 'personalDocuments',
                childLevel2Ref: 'license',
            });
            break;
        case "document_prdp":
            show({
                mainSection: documentsSection,
                childLevel1Ref: 'personalDocuments',
                childLevel2Ref: 'document_prdp',
            });
            break;

        case "competency":
            show({mainSection: documentsSection, childLevel1Ref: 'competency'});
            break;
        case "contract":
            show({mainSection: documentsSection, childLevel1Ref: 'contract'});
            break;
        case "job_appointment":
            show({mainSection: documentsSection, childLevel1Ref: 'job_appointment'});
            break;
        case "medical":
            show({mainSection: documentsSection, childLevel1Ref: 'medical'});
            break;

        //5
        case "counselling":
            show({mainSection: counselingSection});
            break;
        //6
        case "warning":
            show({mainSection: warningSection});
            break;
        //7
        case "leave":
            show({mainSection: timeOffSection});
            break;
        //8
        // case "trainer_training":
        //
        //     break;
        //9
        // case "ppe_type":
        //
        //     break;
        //10
        // case "supervisor_employee":
        //
        //     break;
    }
}
