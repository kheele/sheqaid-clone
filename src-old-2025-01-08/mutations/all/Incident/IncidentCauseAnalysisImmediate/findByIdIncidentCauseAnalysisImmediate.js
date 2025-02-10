
export default async (input: number) => {
    const findById = sockets.of('incidents/cause-analysis/immediate').fn('findById');
    return findById(input);
}