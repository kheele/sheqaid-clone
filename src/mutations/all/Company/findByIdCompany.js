/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("companies").fn("findById");
  return findById(input);
};
