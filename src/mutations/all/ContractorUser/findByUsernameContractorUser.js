import findByEmailContractorUser from "./findByEmailContractorUser";
import findByPhoneContractorUser from "./findByPhoneContractorUser";

export default async (input: string) => {
  // console.log('findByEmailContractorUser, findByPhoneContractorUser', input);
  return Promise.all([
    findByEmailContractorUser(input),
    findByPhoneContractorUser(input)
  ]).then(list => {
    return list.find(v => !!v);
  });
};
