export default async () => {
  const list = sockets.of("manuals").fn('listAll');
  return list();
};
