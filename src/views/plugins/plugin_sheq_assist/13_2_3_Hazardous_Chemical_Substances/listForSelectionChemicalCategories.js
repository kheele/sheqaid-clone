import GQLClient from "graphql/GQLClient";

export default () => {
	return Promise.all([
		GQLClient
		.query({
			query: `
      query listAllChemicalProductCategoriesQuery {
        sheq_chemical_products(
          where: {category: {_is_null: false}},
          order_by: {category: asc},
          distinct_on: category,
        ) {
          category
        }
      }
    `,
		}),
		GQLClient
		.query({
			query: `
      query listAllSDSCategoriesQuery {
        sheq_chemical_sds(
          where: {category: {_is_null: false}},
          order_by: {category: asc},
          distinct_on: category,
        ) {
          category
        }
      }
    `,
		}),
	]).then(res => res.reduce((a1, a2) => [...a1, ...a2], []).map(({category}) => category.toTitleCase()).distinct()
	);
};