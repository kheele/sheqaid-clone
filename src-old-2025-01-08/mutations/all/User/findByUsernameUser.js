import findByEmailUser from "./findByEmailUser";
import findByPhoneUser from "./findByPhoneUser";

export default async (input: string) => {
    // alert(input)
    return Promise.all([
        findByEmailUser(input),
        findByPhoneUser(input)
    ]).then(list => {
        return list.find(v => !!v);
    });
};
