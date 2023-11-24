
export default async (input: number) => {
    const findById = sockets.of('incidents/cause-analysis/root').fn('findById');
    return findById(input);
}