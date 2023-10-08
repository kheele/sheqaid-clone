/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityClaimsClient} from "mutations/types.d.ts";
import crudUtils from "../../CRUDUtils/CRUDUtils";

// 2
const mutation = graphql`
    mutation insertClaimsClientMutation($object: coida_claims_insert_input!) {
        insert_coida_claims_one(
            object: $object
        ) {
            id
        }
    }
`;

// 3
export default async (input: EntityClaimsClient) => {
    const {
        company_id,
        contractor_id,
        contractor_site_id,
        contractor_user_id,
        //0
        client_id,
        project_id,
        site_id,
        //1
        name,
        physical_state,
        type,
        product_id,
        sds_id,
        //2
        precaution_photo_list,//type: "Concentrate" precaution_photo_concentrate_list, type: "Application" precaution_photo_application_list
        //3, 4, 5, 6, 7
        list,
        //8
        contacts_emergency_name,
        contacts_emergency_num,
        contacts_manufacturer_name,
        contacts_manufacturer_num,
        //9
        doc,
    } = input;

    crudUtils.injectCreate(input);

    return await createMutationImpl({mutation, input});
};
