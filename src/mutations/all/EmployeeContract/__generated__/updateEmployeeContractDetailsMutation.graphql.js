/**
 * @generated SignedSource<<cf88478bc1fab1ef796f20525a90b4a5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "_set"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_set",
        "variableName": "_set"
      },
      {
        "kind": "Variable",
        "name": "pk_columns",
        "variableName": "id"
      }
    ],
    "concreteType": "hr_employees_docs_contracts_details",
    "kind": "LinkedField",
    "name": "update_hr_employees_docs_contracts_details_by_pk",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "contract_type",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "daily_working_hours",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "end_of_trial_period",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "end_time",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "expiry_date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "notes",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "start_date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "start_time",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateEmployeeContractDetailsMutation",
    "selections": (v2/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "updateEmployeeContractDetailsMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "8c8988744f296350a2a1066772ec9b5a",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeContractDetailsMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeContractDetailsMutation(\n  $id: hr_employees_docs_contracts_details_pk_columns_input!\n  $_set: hr_employees_docs_contracts_details_set_input!\n) {\n  update_hr_employees_docs_contracts_details_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    contract_type\n    daily_working_hours\n    end_of_trial_period\n    end_time\n    expiry_date\n    notes\n    start_date\n    start_time\n  }\n}\n"
  }
};
})();

node.hash = "620029cb816f6f61a5e70ef4e70d30b9";

module.exports = node;
