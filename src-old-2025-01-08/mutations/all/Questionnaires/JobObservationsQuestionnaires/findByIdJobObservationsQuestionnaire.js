/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('job-observations').fn('findById');
  return findById(input);
}
