/* eslint-disable camelcase */

import findByEmailEmployee from "./findByEmailEmployee";
import findByPhoneEmployee from "./findByPhoneEmployee";
import {insertEmployee} from "mutations/create";

export default async (list) => {
    const dups = (await Promise.all(list.map(async ({email, phone}) => {
        if (!email && !phone) return;
        let existingUser = await findByEmailEmployee(email);
        if (existingUser) {
            return {id: existingUser.id, email};
        }
        existingUser = await findByPhoneEmployee(phone);
        if (existingUser) {
            return {id: existingUser.id, phone};
        }
    }))).filter(v => !!v);

    if (dups.isNotEmpty()) {
        return {
            dups_email: dups.map(({email}) => list.find(v => v.email === email)),
            dups_phone: dups.map(({phone}) => list.find(v => v.phone === phone)),
        };
    }

    return await Promise.all(list.map(async data => {
        return await insertEmployee(data);
    }));
};
