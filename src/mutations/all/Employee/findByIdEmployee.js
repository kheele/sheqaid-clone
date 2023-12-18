/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('employees').fn('findById');
  return findById(input);
}