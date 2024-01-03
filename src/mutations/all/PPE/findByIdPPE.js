/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('ppe').fn('findById');
  return findById(input);
};
