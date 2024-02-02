/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("assets/monitoring-plan-working-hrs-or-km-list").fn("findById");
  return findById(input);
}
