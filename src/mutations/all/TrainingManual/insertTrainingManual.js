/* eslint-disable camelcase */

// 1
import { graphql } from "react-relay";
// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {EntityTrainingManual} from "mutations/types.d.ts";
import crudUtils from "../CRUDUtils/CRUDUtils";
import {Dates} from "../../../utils/Dates";
import updateEmployee from "../Employee/updateEmployee";
import updateTrainingManual from "./updateTrainingManual";

// 2
const mutation = graphql`
  mutation insertTrainingManualMutation($object: sheq_training_manuals_insert_input!) {
    insert_sheq_training_manuals_one(
      object: $object
    ) {
      id
      type
      title
      thumb
      doc
      course{
        id
        name
      }
      client{
        id
        name
      }
      project{
        id
        name
      }
      site{
        id
        name
      }
    }
  }
`;

// 3
export default async (input: EntityTrainingManual) => {
  const {
    type,
    title,
    thumb,
    doc,
    course_id,
    client_id,
    project_id,
    site_id,
  } = input;

  if (thumb) {
    delete input.thumb;
  }
  if (doc) {
    delete input.doc;
  }

  crudUtils.injectCreate(input);

  const res = await createMutationImpl({mutation, input});
  if (res) {
    if (thumb || doc) {
      const id = convertIdToBigint(res.id);
      const updateAttrs = {};

      const updoad = async ({key, doc, name}) => {
        const path = `training-manuals/${id}`;
        const gcsUri = await workers.emit("files/upload", {
          file: doc,
          path,
          name,
        });
        console.log("gcsUri", gcsUri);
        if (key) {
          updateAttrs[key] = gcsUri;
        } else {
          return gcsUri;
        }
      };

      const promises = [];
      if (thumb) {
        const name = `thumb-${Dates.formatTimestamp(new Date())}`;
        promises.push(updoad({
          key: "thumb",
          doc: thumb,
          name,
        }));
      }
      if (doc) {
        const name = `doc-${Dates.formatTimestamp(new Date())}`;
        promises.push(updoad({
          key: "doc",
          doc,
          name,
        }));
      }

      await Promise.all(promises);

      return updateTrainingManual({id, ...updateAttrs});
    }
  }

  return res;
};
