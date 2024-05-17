const findByIdImpl = require("./findByIdImpl");

//<editor-fold desc="createImpl">
module.exports = (
    {
        name, 
        tbl, 
        details_fragment, 
        orgs_fragment,
    }
) => {
	return async (socket, input) => {
		console.log('createImpl:', input);

        const res = await insertGraphQL({
            mutation: `
                mutation insert${name}Mutation($object: ${tbl}_insert_input!) {
                    insert_${tbl}_one(
                        object: $object
                    ) {
                        id
                    }
                }
            `,
            input,
            operationName: `insert${name}Mutation`,
        });

        if(res) {
            const findById = findByIdImpl({
                name, 
                tbl, 
                details_fragment, 
                orgs_fragment,
            })
            return findById(socket, res.id);
        }
    };
};
//</editor-fold>
