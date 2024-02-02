const findByIdImpl = require('../../findByIdImpl');

const details_fragment = `
  id
`;

eventManager.on("audits/definitions/findById", findByIdImpl({
	name: "AuditDefinition", tbl: "sheq_compliance_audits_definitions", details_fragment,
}));
