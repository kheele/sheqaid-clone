/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('employees-external').fn('findById');
  return findById(input);
}
