/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('ppe-items').fn('findById');
  return findById(input);
};
