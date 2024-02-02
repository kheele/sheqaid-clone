/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("companies/categories").fn("findById");
  return findById(input);
};
