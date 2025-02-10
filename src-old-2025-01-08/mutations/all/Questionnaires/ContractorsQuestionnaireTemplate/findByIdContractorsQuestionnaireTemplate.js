/* eslint-disable camelcase */

export default async (input: number) => {
  const findById = sockets.of('contractors/questionnaires').fn('findByIdTemplate');
  return findById(input);
};
