/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('claims/clients/wcl2').fn('findById');
  return findById(input);
}
