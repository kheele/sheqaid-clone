/**
 * @generated SignedSource<<fa0da88fbc1b827790cd88b232b59d4a>>
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
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "object",
        "variableName": "object"
      }
    ],
    "concreteType": "proxy_employee__organogram",
    "kind": "LinkedField",
    "name": "insert_proxy_employee__organogram_one",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "insertProxyEmployeeOrganogramMutation",
    "selections": (v1/*: any*/),
    "type": "mutation_root",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "insertProxyEmployeeOrganogramMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "6d699661cc396368c012883bcc24dd7b",
    "id": null,
    "metadata": {},
    "name": "insertProxyEmployeeOrganogramMutation",
    "operationKind": "mutation",
    "text": "mutation insertProxyEmployeeOrganogramMutation(\n  $object: proxy_employee__organogram_insert_input!\n) {\n  insert_proxy_employee__organogram_one(object: $object) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "f367ff6287f302f3ccc5d68766cdb09a";

module.exports = node;
