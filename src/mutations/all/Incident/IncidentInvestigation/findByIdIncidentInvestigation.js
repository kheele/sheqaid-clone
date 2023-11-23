
export default async (input: number) => {
    const findById = sockets.of('incidents/investigations').fn('findById');
    return findById(input);
}