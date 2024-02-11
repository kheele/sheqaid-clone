/* eslint-disable camelcase */

export default async (input) => {
  const findByName = sockets.of('job-positions').fn('findByName');
  return findByName(input);
}
