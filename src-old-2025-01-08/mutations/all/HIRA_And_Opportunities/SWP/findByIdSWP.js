/* eslint-disable camelcase */

export default async (input: number) => {
	const findById = sockets.of("hira-and-opportunities/swp").fn("findById");
	return findById(input);
}
