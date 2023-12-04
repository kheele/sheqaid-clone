/* eslint-disable camelcase */

// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";
import {Dates} from "utils/Dates";

export default async (
    {
        mutation,
        attrs,
        findByIdEmployeeFn,
        name,
        plural,
    }
) => {
    const {id, doc, job_profile_doc} = attrs;

    const has_doc = doc && !doc.dlUrls;
    const has_job_profile_doc = name === "Contract" && (job_profile_doc && !job_profile_doc.dlUrls);
    if(has_doc || has_job_profile_doc) {
        const item = await findByIdEmployeeFn(id);
        if(!item) return;
        const {employee} = item.data;

        const updoad = async ({key, doc, name}) => {
            const path = `employees/${employee.id}/docs/${plural}/${id}`;
            const gcsUri = await workers.emit("files/upload", {
                file: doc,
                path,
                name,
            });
            console.log("gcsUri", gcsUri);
            attrs[key] = gcsUri;
        };

        const promises = [];
        if(has_doc) {
            const __name = `${name}-doc-${Dates.formatTimestamp(new Date())}`;
            promises.push(updoad({
                key: "doc",
                doc,
                name: __name,
            }));
        }
        if(has_job_profile_doc) {
            const __name = `${name}-job-profile-${Dates.formatTimestamp(new Date())}`;
            promises.push(updoad({
                key: "job_profile_doc",
                doc: job_profile_doc,
                name: __name,
            }));
        }

        await Promise.all(promises);
    }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    }).then(res => res && findByIdEmployeeFn(res.id));
};
