/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("assets/details").fn("findById");
  return findById(input);
}
