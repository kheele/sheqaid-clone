/* eslint-disable camelcase */

export default async (input: number) => {
    const findById = sockets.of('inspections').fn('findById');

    return findById(input).then((res) => {
        console.log('findById res', res)
        return res;
    });
}