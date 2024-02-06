/* eslint-disable camelcase */

export default async (input: number) => {
    const findById = sockets.of("hira-and-opportunities/task-based-ra").fn("findById");
    return findById(input);
}
