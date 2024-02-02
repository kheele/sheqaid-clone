/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("assets/monitoring-plan-fuel-usage-list").fn("findById");
  return findById(input);
}
