import {observable} from 'mobx';
import AOrgSuper from './AOrgSuper';

class Company extends AOrgSuper {
    @observable
    consultant?: boolean;

    @observable
    no_projects?: boolean;

    constructor(
        {
            id,
            created_at,
            name,
            consultant,
            no_projects,
        }: {
            id?: number;
            created_at?: string;
            name?: string;
            consultant?: boolean;
            no_projects?: boolean;
        } = {}
    ) {
        super({
            id,
            created_at,
            name,
        });
        this.consultant = consultant;
        this.no_projects = no_projects;
    }

    converter(item: { [key: string]: any }): Company {
        return new Company(item);
    }
    //
    // static fromForm(item: { [key: string]: any }): Company {
    //     return new Company(item);
    // }

    async save(): Promise<Company | null> {
        // Add your implementation here
        return null;
    }

    get findByIdReturn(): string {
        return '';
    }
}

export default Company;
