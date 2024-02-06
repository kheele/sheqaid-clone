import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {document_details_fragment} from "../Fragments";

export default (
	{
		offset = 0,
		limit = 50,
		//
		removed = false,
		doc_type
	}
) => {
	const {filter} = getVariablesAndQueryConfig({
		doc_type,
	});

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
       query listAllDocumentsByLoggedQuery {
           sheq_documents(
               where: {
                   removed: {_eq: ${removed}},
                   ${filter}
               },
               order_by: {title: asc},  
               offset: ${offset},
               limit: ${limit}
           ) {
               ${document_details_fragment}
               ${orgs_fragment}
           }
       }
    `,
	});
	//</editor-fold>
};
