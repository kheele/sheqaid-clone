/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('claims/clients/wcl5').fn('findById');
  return findById(input);
}
