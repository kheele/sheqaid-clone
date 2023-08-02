/**
 * @generated SignedSource<<2c873e227820b6422007640b3159111f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "object"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "hr_employees_living_address",
    "kind": "LinkedField",
    "name": "insert_hr_employees_living_address_one",
    "plural": false,
    "selections": [
      (v1/*: any*/),
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
          (v1/*: any*/)
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
        "selections": (v2/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_zones",
        "kind": "LinkedField",
        "name": "zone",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "default_countries",
        "kind": "LinkedField",
        "name": "country",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "insertEmployeeDocLivingAddressMutation",
    "selections": (v3/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertEmployeeDocLivingAddressMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "4d21c73bfc90daf852ca2760d59af81b",
    "id": null,
    "metadata": {},
    "name": "insertEmployeeDocLivingAddressMutation",
    "operationKind": "mutation",
    "text": "mutation insertEmployeeDocLivingAddressMutation(\n  $object: hr_employees_living_address_insert_input!\n) {\n  insert_hr_employees_living_address_one(object: $object) {\n    id\n    is_default\n    doc\n    local_address\n    street_address\n    employee_id\n    employee {\n      id\n    }\n    city {\n      id\n      name\n    }\n    zone {\n      id\n      name\n    }\n    country {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

node.hash = "84c1faba378fdd6ef8632025a1ae3916";

module.exports = node;
