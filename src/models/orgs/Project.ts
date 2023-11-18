import AOrgSuper from './AOrgSuper';

class Project extends AOrgSuper {

    constructor(
        {
            id,
            created_at,
            name,
            company,
            client,
        }: {
            id?: number;
            created_at?: string;
            name?: string;
            company?: object;
            client?: object;
        } = {}
    ) {
        super({
            id,
            created_at,
            name,
            company,
            client,
        });
    }

    converter(item: { [key: string]: any }): Project {
        return new Project(item);
    }

    async save(): Promise<Project | null> {
        // Add your implementation here
        return null;
    }

    get findByIdReturn(): string {
        return '';
    }
}

export default Project;
