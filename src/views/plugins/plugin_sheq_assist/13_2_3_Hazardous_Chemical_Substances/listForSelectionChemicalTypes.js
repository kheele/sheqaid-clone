import GQLClient from "graphql/GQLClient";

export default () => {
	return GQLClient
		.query({
			query: `
      query listAllHazchemSheetTypesQuery {
        sheq_chemical_hazchem_sheets(
          where: {type: {_is_null: false}},
          order_by: {type: asc},
          distinct_on: type,
        ) {
          type
        }
      }
    `,
		}).then(res => res.map(({type}) => type.toTitleCase()).distinct()
	);
};