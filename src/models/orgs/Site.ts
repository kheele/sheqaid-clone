import AOrgSuper from './AOrgSuper';

class Site extends AOrgSuper {

    constructor(
        {
            id,
            created_at,
            name,
            company,
            client,
            project,
        }: {
            id?: number;
            created_at?: string;
            name?: string;
            company?: object;
            client?: object;
            project?: object;
        } = {}
    ) {
        super({
            id,
            created_at,
            name,
            company,
            client,
            project,
        });
    }

    converter(item: { [key: string]: any }): Site {
        return new Site(item);
    }

    async save(): Promise<Site | null> {
        // Add your implementation here
        return null;
    }

    get findByIdReturn(): string {
        return '';
    }
}

export default Site;
