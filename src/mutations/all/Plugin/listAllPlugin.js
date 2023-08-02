/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import findOneMutationImpl from "mutations/findOneMutationImpl";
import {EntityUser} from "mutations/types.d.ts";
import listMutationImpl from "../../listMutationImpl";

// 2
const query = graphql`
  query listAllPluginQuery {
    default_manager_plugin_connection {
      edges {
        node {
          id
          app
          desc
          key
          status
          title
          module_list(order_by: [{sort: asc}]) {
            id
            borderColor
            desc
            discount
            faIconLeft
            faIconRight
            has_update
            hover
            key
            price
            sort
            status
            svgIconLeft
            svgIconRight
            title
            plugin {
              key
            }
          }
        }
      }
    }
  }
`;
//firestore_id
// 3
export default async () =>
    listMutationImpl({checkLogin: false, query });
