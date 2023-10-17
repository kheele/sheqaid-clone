/**
 * @generated SignedSource<<6e34f69c00b3157428da462bc201eb5c>>
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
    "concreteType": "sheq_incident_investigation_investigations_findings",
    "kind": "LinkedField",
    "name": "update_sheq_incident_investigation_investigations_findings_by_pk",
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateInvestigationFindingMutation",
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
    "name": "updateInvestigationFindingMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "4415e606c0e584c885a4333e3c28855b",
    "id": null,
    "metadata": {},
    "name": "updateInvestigationFindingMutation",
    "operationKind": "mutation",
    "text": "mutation updateInvestigationFindingMutation(\n  $id: sheq_incident_investigation_investigations_findings_pk_columns_input!\n  $_set: sheq_incident_investigation_investigations_findings_set_input!\n) {\n  update_sheq_incident_investigation_investigations_findings_by_pk(pk_columns: $id, _set: $_set) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "93243dbe8ecf86e6d8d1b825d1495ed6";

module.exports = node;
