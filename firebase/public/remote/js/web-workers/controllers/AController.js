
class AController extends AControllerRead {

    constructor(events, db, name, root, tbl, fn) {
        super(events, db, name, root, tbl, fn);
    }

    onChange(val, changeType) {
    }

    generateKeywords(keywords) {
        const createKeywords = (name) => {
            const arrName = [];
            let curName = '';
            name.toLowerCase().split('').forEach(letter => {
                curName += letter;
                arrName.push(curName);
            });
            return arrName;
        };

        return [
            ...new Set([
                '',
                ...createKeywords(keywords.join(' ')),
                ...createKeywords(keywords.reverse().join(' '))
            ])
        ];
    }

    addAction(name, fn) {
        const {events, root} = this;
        self.on(root + name, fn);
    }

}