/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("contractors/users").fn("findById");
  return findById(input).then(res => {
    console.log('contractors/users', res);
    return res;
  });
};
