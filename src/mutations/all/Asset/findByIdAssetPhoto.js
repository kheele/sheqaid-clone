/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("assets/photos").fn("findById");
  return findById(input);
}
