import findByUsernameUser from "../User/findByUsernameUser";
import insertUser from "../User/insertUser";

export default async (input) => {
    const {
        uid,
        token: customToken,
        fname,
        lname,
        username,
        phone,
        password,
        company: {
            data: {
                account_type,
                consultant,
                name,
                phone: company_phone,
                email,
                address,
                category_id,
                country_id,
                city_id
            }
        }
    } = input;

    const existingUser = await findByUsernameUser(username);
    if (existingUser) {
        return "EMAIL_DUP";
    }

    delete input.password;
    delete input.uid;
    delete input.token;

    const newUser = await insertUser(input);

    if (newUser) {
        const {data: {company, company: {id: company_id, ...company_data}}} = newUser;
        company.id = convertIdToBigint(company_id);
        company.data = company_data;
        return await workers.emit("users/accounts/signup", {newUser, password, uid, customToken});
    }
};
