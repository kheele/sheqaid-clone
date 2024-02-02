/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of("assets/calibration-record-list").fn("findById");
  return findById(input);
}
