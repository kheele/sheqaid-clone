
export default async (input: number) => {
    const findById = sockets.of('incidents').fn('findById');
    return findById(input);
}