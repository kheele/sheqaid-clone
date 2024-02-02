/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("assets/docs").fn("findById");
  return findById(input);
}
