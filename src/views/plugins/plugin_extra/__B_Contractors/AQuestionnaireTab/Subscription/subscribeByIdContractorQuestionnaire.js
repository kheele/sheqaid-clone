import GQLClient from "graphql/GQLClient";
import { gql } from '@urql/core';

export default (
	{
		id,
		onEvent,
	}
) => {
	return GQLClient.subscription({
		query: gql`
				subscription subscribeByIdContractorQuestionnaireSubscription {
				  default_contractor_questionnaires_by_pk(id: ${id}) {
				    id
				    name
				    status
				  }
				}
			`,
		onEvent,
	});
};