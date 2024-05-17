export default async (id) => {
  const findById = sockets.of("manuals").fn('findById');
  return findById(id);
};
