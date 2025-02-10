
export default async (input: number) => {
    const findById = sockets.of('incidents/cause-analysis').fn('findById');
    return findById(input);
}