/* eslint-disable camelcase */

// @ts-ignore
import GQLClient from "graphql/GQLClient";

// 3
export default async (input: number) => {

  //<editor-fold desc="ByEach">
  return GQLClient
  .query({
    query: `
      query findByIdAssetPhotoQuery {
        asset_photos(
          where: {id: {_eq: ${input}},},
        ) {
            id
            doc
            is_default
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