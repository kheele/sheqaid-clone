/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTeam} from "../../types.d.ts";

// 2
const mutation = graphql`
  mutation insertTeamMutation($object: default_teams_insert_input!) {
    insert_default_teams_one(
      object: $object
    ) {
      id
    }
  }
`;

// 3
export default (input: EntityTeam) =>
  createMutationImpl({ mutation, input });
