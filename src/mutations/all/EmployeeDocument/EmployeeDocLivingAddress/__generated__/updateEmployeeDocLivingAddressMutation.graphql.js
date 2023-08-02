/**
 * @generated SignedSource<<90705ab8d687819c0246a142293a2445>>
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  (v2/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v4 = [
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
    "concreteType": "hr_employees_living_address",
    "kind": "LinkedField",
    "name": "update_hr_employees_living_address_by_pk",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "is_default",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "doc",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "local_address",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "street_address",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "employee_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "hr_employees",
        "kind": "LinkedField",
        "name": "employee",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_cities",
        "kind": "LinkedField",
        "name": "city",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_zones",
        "kind": "LinkedField",
        "name": "zone",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_countries",
        "kind": "LinkedField",
        "name": "country",
        "plural": false,
        "selections": (v3/*: any*/),
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
    "name": "updateEmployeeDocLivingAddressMutation",
    "selections": (v4/*: any*/),
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
    "name": "updateEmployeeDocLivingAddressMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "b488ad81af1df8666cbf800a9c70e85b",
    "id": null,
    "metadata": {},
    "name": "updateEmployeeDocLivingAddressMutation",
    "operationKind": "mutation",
    "text": "mutation updateEmployeeDocLivingAddressMutation(\n  $id: hr_employees_living_address_pk_columns_input!\n  $_set: hr_employees_living_address_set_input!\n) {\n  update_hr_employees_living_address_by_pk(pk_columns: $id, _set: $_set) {\n    id\n    is_default\n    doc\n    local_address\n    street_address\n    employee_id\n    employee {\n      id\n    }\n    city {\n      id\n      name\n    }\n    zone {\n      id\n      name\n    }\n    country {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "f393aa60e4c74e27202940c8260acc7c";

module.exports = node;
