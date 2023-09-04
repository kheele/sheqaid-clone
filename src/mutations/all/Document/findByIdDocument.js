/* eslint-disable camelcase */

import GQLClient from "graphql/GQLClient";
import {orgs_fragment} from "graphql/Fragments";
import {document_details_fragment} from "views/plugins/common/documents/Query/Fragments";

export default async (input: number) => {
  return GQLClient
  .query({
    query: `
       query findOneDocumentsByLoggedQuery {
           sheq_documents(where: {id: {_eq: ${input}}}) {
               ${document_details_fragment}
               ${orgs_fragment}
           }
       }
    `,
  }).then(res => res && res[0]);
}
