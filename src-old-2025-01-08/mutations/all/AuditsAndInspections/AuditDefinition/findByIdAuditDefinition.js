/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("audits/definitions").fn("findById");
  return findById(input);
}
