import GQLClient from "graphql/GQLClient";

export default () => {
	return Promise.all([
		GQLClient
		.query({
			query: `
      query listAllChemicalProductManufacturersQuery {
        sheq_chemical_products(
          where: {manufacturer: {_is_null: false}},
          order_by: {manufacturer: asc}
        ) {
          manufacturer
        }
      }
    `,
		}),
		GQLClient
		.query({
			query: `
      query listAllSDSManufacturersQuery {
        sheq_chemical_sds(
          where: {manufacturer: {_is_null: false}},
          order_by: {manufacturer: asc},
          distinct_on: manufacturer,
        ) {
          manufacturer
        }
      }
    `,
		}),
	]).then(res => res.reduce((a1, a2) => [...a1, ...a2], []).map(({manufacturer}) => manufacturer.toTitleCase()).distinct()
	);
};