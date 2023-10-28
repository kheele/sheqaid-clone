/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('claims/clients/annexture1').fn('findById');
  return findById(input);
}
