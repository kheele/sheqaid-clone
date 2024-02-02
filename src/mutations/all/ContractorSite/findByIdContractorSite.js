/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("contractors/sites").fn("findById");
  return findById(input);
};
