/* eslint-disable camelcase */

// @ts-ignore
import createMutationImpl from "mutations/createMutationImpl";

export default async (
    {
        mutation,
        input,
        updateEmployeeDocFn,
        name,
        plural,
    }
) => {
    // const {doc, employee_id} = input;
    // if (doc) {
    //     delete input.doc;
    // }

    const res = await createMutationImpl({mutation, input});
    if (res) {
        // if (doc) {
        //     const id = convertIdToBigint(res.id);
        //     const path = `employees/${employee_id}/docs/${plural}/${id}`;
        //     const gcsUri = await workers.emit("files/upload", {
        //         file: doc,
        //         path,
        //         name,
        //     });
        //     console.log("gcsUri", gcsUri);
        //
        //     const updateAttrs = {doc: gcsUri};
        //
        //     return updateEmployeeDocFn({id, ...updateAttrs});
        // }
    }

    return res;
};
