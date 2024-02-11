/* eslint-disable camelcase */

export default async (input) => {
  const findByClientIdAndName = sockets.of('departments').fn('findByClientIdAndName');
  return findByClientIdAndName(input);
}
