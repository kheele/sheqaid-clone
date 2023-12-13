/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('job-categories').fn('findById');
  return findById(input);
}
