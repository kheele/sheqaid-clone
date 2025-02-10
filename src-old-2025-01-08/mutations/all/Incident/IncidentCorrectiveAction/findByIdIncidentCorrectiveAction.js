
export default async (input: number) => {
    const findById = sockets.of('incidents/corrective-actions').fn('findById');
    return findById(input);
}