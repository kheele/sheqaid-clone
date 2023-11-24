
export default async (input: number) => {
    const findById = sockets.of('incidents/cause-analysis/cause').fn('findById');
    return findById(input);
}