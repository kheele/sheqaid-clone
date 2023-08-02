/* eslint-disable camelcase */

// @ts-ignore
import updateMutationImpl from "mutations/updateMutationImpl";

export default async (
    {
        mutation,
        attrs,
        findByIdEmployeeFn,
        name,
        plural,
    }
) => {
    const {id, doc} = attrs;
    if (doc) {
        const item = await findByIdEmployeeFn(id);
        if(!item) return;

        const {employee} = item;
        const path = `employees/${employee.id}/docs/${plural}/${id}`;
        const gcsUri = await workers.emit("files/upload", {
            file: doc,
            path,
            name,
        });
        console.log("gcsUri", gcsUri);

        attrs.doc = gcsUri;
    }

    return updateMutationImpl({
        mutation,
        id: attrs.id,
        attrs,
    });
};
