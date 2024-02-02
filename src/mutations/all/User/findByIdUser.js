/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("users").fn("findById");
  return findById(input);
};
