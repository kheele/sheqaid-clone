/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityClaimsEmployerDetails} from "mutations/types.d.ts";
import findByIdClaimsEmployerDetails from "./findByIdClaimsEmployerDetails";
import findByIdClaimsClient from "../ClaimsClient/findByIdClaimsClient";

// 2
const mutation = graphql`
    mutation updateClaimsEmployerDetailsMutation($id: coida_claims_employer_details_pk_columns_input!, $_set: coida_claims_employer_details_set_input!) {
        update_coida_claims_employer_details_by_pk(pk_columns: $id, _set: $_set) {
            id
        }
    }
`;

// 3
export default async (attrs: EntityClaimsEmployerDetails) => {
	const {
		id,
	} = attrs;
	
	const item = await findByIdClaimsEmployerDetails(id);
	if (!item) return;
	
	const promises = [];
	
	// if(sector_list) {
	//     delete attrs.sector_list;
	//     promises.push(Promise.all(sector_list.map(async (v, n) => {
	//         if(v.id) {
	//             return updateProxySectorClaimsEmployerDetails(v);
	//         } else {
	//             return insertProxySectorClaimsEmployerDetails({...v, course_id: id});
	//         }
	//     })));
	// }
	// if(job_position_list) {
	//     delete attrs.job_position_list;
	//     promises.push(Promise.all(job_position_list.map(async (v, n) => {
	//         if(v.id) {
	//             return updateProxyJobPositionClaimsEmployerDetails(v);
	//         } else {
	//             return insertProxyJobPositionClaimsEmployerDetails({...v, job_position_id: id});
	//         }
	//     })));
	// }
	
	await Promise.all(promises);
	
	return updateMutationImpl({
		mutation,
		id: attrs.id,
		attrs,
	}).then(res => res && findByIdClaimsClient(res.id));
};
