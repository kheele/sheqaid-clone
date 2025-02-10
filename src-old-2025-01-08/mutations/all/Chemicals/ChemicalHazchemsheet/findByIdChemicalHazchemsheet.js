/* eslint-disable camelcase */

export default async (input: number) => {
    const findById = sockets.of("chemicals/hazchem-sheets").fn("findById");
    return findById(input);
};
