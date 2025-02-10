/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('claims/clients/wcl5-proxy').fn('findById');
  return findById(input);
}
