import AOrgSuper from './AOrgSuper';

class Client extends AOrgSuper {

    constructor(
        {
            id,
            created_at,
            name,
            company,
        }: {
            id?: number;
            created_at?: string;
            name?: string;
            company?: object;
        } = {}
    ) {
        super({
            id,
            created_at,
            name,
            company,
        });
    }

    converter(item: { [key: string]: any }): Client {
        return new Client(item);
    }

    async save(): Promise<Client | null> {
        // Add your implementation here
        return null;
    }

    get findByIdReturn(): string {
        return '';
    }
}

export default Client;
