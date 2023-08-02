/* eslint-disable camelcase */

// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";
import {Dates} from "utils/Dates";
import crudUtils from "../CRUDUtils/CRUDUtils";

export default async (
    {
        mutation,
        input,
        updateEmployeeDocFn,
        name,
        plural,
    }
) => {
    const {doc, job_profile_doc, employee_id} = input;
    if(name === "Contract") {
        if (job_profile_doc && isFile(job_profile_doc)) {
            delete input.job_profile_doc;
        }
    }

    if (doc && isFile(doc)) {
        delete input.doc;
    }

    crudUtils.injectCreate(input);

    const res = await createMutationImpl({mutation, input});
    if (res) {
        if ((doc && isFile(doc)) || (job_profile_doc && isFile(job_profile_doc))) {
            const id = convertIdToBigint(res.id);
            const updateAttrs = {};
            const updoad = async ({key, doc, name}) => {
                const path = `employees/${employee_id}/docs/${plural}/${id}`;
                const gcsUri = await workers.emit("files/upload", {
                    file: doc,
                    path,
                    name,
                });
                console.log("gcsUri", gcsUri);
                updateAttrs[key] = gcsUri;
            };

            const promises = [];
            if(doc) {
                const __name = `${name}-doc-${Dates.formatTimestamp(new Date())}`;
                promises.push(updoad({
                    key: "doc",
                    doc,
                    name: __name,
                }));
            }
            if(job_profile_doc) {
                const __name = `${name}-job-profile-${Dates.formatTimestamp(new Date())}`;
                promises.push(updoad({
                    key: "job_profile_doc",
                    doc: job_profile_doc,
                    name: __name,
                }));
            }

            await Promise.all(promises);

            return updateEmployeeDocFn({id, ...updateAttrs});
        }
    }

    return res;
};
