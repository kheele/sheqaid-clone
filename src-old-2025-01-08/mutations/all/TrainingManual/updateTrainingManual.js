/* eslint-disable camelcase */

// 1
import {graphql} from "react-relay";
// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {EntityTrainingManual} from "mutations/types.d.ts";
import {Dates} from "utils/Dates";
import findByIdTrainingManual from "./findByIdTrainingManual";

// 2
const mutation = graphql`
  mutation updateTrainingManualMutation($id: sheq_training_manuals_pk_columns_input!, $_set: sheq_training_manuals_set_input!) {
    update_sheq_training_manuals_by_pk(pk_columns: $id, _set: $_set) {
      id
    }
  }
`;

// 3
export default async (attrs: EntityTrainingManual) => {
    const {
        id,
        type,
        title,
        thumb,
        doc,
        course_id,
        client_id,
        project_id,
        site_id,
    } = attrs;

    const item = await findByIdTrainingManual(id);
    if (!item) return;

    const has_thumb = thumb && !thumb.dlUrls;
    const has_doc = doc && !doc.dlUrls;

    if (has_thumb || has_doc) {
        const updoad = async ({key, doc, name}) => {
            const path = `training-manuals/${id}`;
            const gcsUri = await workers.emit("files/upload", {
                file: doc,
                path,
                name,
            });
            console.log("gcsUri", gcsUri);
            if (key) {
                attrs[key] = gcsUri;
            } else {
                return gcsUri;
            }
        };

        const promises = [];
        if (has_thumb) {
            const name = `thumb-${Dates.formatTimestamp(new Date())}`;
            promises.push(updoad({
                key: "thumb",
                doc: thumb,
                name,
            }));
        }
        if (has_doc) {
            const name = `doc-${Dates.formatTimestamp(new Date())}`;
            promises.push(updoad({
                key: "doc",
                doc,
                name,
            }));
        }

        await Promise.all(promises);
    }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};