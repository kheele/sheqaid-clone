/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("audits/items").fn("findById");
  return findById(input);
}
