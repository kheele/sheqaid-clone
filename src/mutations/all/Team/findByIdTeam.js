/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('teams').fn('findById');
  return findById(input);
}
