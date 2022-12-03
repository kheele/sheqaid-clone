
class AdminUserFuns {

    static createDbFilter(searchText) {
        return q => {
            return q.where("keywords", "array-contains", searchText);
        };
    }

    static async mapResults(item) {
        delete item.data.password;

        const promise = [];
        await Promise.all(promise);
        return item;
    }

}