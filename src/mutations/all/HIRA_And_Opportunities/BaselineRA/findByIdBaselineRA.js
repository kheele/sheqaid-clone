/* eslint-disable camelcase */

export default async (input: number) => {
	const findById = sockets.of("hira-and-opportunities/baseline-ra").fn("findById");
	return findById(input);
}
