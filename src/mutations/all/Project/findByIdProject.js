/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("projects").fn("findById");
  return findById(input);
};
