import GQLClient from "graphql/GQLClient";
import {getVariablesAndQueryConfig} from "../Utils";
import {orgs_fragment} from "graphql/Fragments";
import {document_details_fragment} from "../Fragments";
import {orgsFilter} from "../../../../../../graphql/Filters";

export default (
	{
		exact_orgs = true,
	}
) => {
	let filter = orgsFilter({
		exact_orgs: false,
		exact_orgs_company: true,
	});
	filter = filter.join(',');

	//<editor-fold desc="ByEach">
	return GQLClient
	.query({
		query: `
       query listForSelectionDocumentCategoriesByLoggedQuery {
           default_document_categories(
		           where: {
		              _or: [
		                {document_owner: {_eq: "Public"}},
		                {_and: [
		                  {document_owner: {_eq: "Private"}}, 
		                  {${filter}}
		                ]}
		              ],
		           },
               order_by: {name: asc}
           ) {
              id
		          name
		          document_owner
           }
       }
    `,
	});
	//</editor-fold>
};