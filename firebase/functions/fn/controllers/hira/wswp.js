
class Cntr extends ACntr {
    constructor(Functions) {
        super(Functions, "plugin_sheq_assist/09_HIRA_And_Opportunities/swp/", "plugin_sheq_assist_09_HIRA_And_Opportunities_swp");
    }

    async createPDF(ctx, id) {
        const item = await this.find_by_id(ctx, id);

        return await this.onCreatePDFImpl(path.join(__dirname + "/report-wswp.ejs"), {

        });
    }
}

exports.run = (Functions) => {
    new Cntr(Functions);
};