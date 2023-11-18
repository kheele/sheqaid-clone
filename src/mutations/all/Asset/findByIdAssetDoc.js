/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findByIdAssetDocQuery {
        asset_docs(
          where: {id: {_eq: ${input}},},
        ) {
            id
            created_at
            doc
            date
            expiry
            title
            desc
            type
            asset_id
            asset{
                id
            }
        }
      }
    `,
  }).then(res => res[0]);//.then(fillNullLists);
  //</editor-fold>
}