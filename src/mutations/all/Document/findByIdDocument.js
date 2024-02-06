/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("documents").fn("findById");
  return findById(input);
}
