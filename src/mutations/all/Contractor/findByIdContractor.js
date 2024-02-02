/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("contractors").fn("findById");
  return findById(input);
};
