/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("documents/categories").fn("findById");
  return findById(input);
};
