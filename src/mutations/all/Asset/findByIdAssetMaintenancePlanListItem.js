/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("assets/maintenance-plan-list").fn("findById");
  return findById(input);
}
