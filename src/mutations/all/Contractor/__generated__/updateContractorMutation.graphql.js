/**
 * @generated SignedSource<<d73b80344ef70f64b431f285499846cd>>
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  (v3/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "default_companies",
  "kind": "LinkedField",
  "name": "company",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "default_clients",
  "kind": "LinkedField",
  "name": "client",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "default_projects",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateContractorMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "default_contractors",
        "kind": "LinkedField",
        "name": "update_default_contractors_by_pk",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      }
    ],
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
    "name": "updateContractorMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "default_contractors",
        "kind": "LinkedField",
        "name": "update_default_contractors_by_pk",
        "plural": false,
        "selections": [
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "402cad1cc11406347ccb978680d0299c",
    "id": null,
    "metadata": {},
    "name": "updateContractorMutation",
    "operationKind": "mutation",
    "text": "mutation updateContractorMutation(\n  $id: default_contractors_pk_columns_input!\n  $_set: default_contractors_set_input!\n) {\n  update_default_contractors_by_pk(pk_columns: $id, _set: $_set) {\n    company {\n      id\n      name\n    }\n    client {\n      id\n      name\n    }\n    project {\n      id\n      name\n    }\n    id\n  }\n}\n"
  }
};
})();

node.hash = "c3efba96e736a6b3f920b0ad00d39a07";

module.exports = node;
