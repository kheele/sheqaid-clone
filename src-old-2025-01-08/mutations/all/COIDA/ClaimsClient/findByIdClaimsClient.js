/* eslint-disable camelcase */

export default async (input: number) => {
    const findById = sockets.of('claims/clients').fn('findById');
    return findById(input);
}
