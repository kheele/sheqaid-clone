import {computed, observable} from 'mobx';
// @ts-ignore
import {Dates} from 'utils/Utils';
import Company from "./orgs/Company";
import Client from "./orgs/Client";
import Project from "./orgs/Project";
import Site from "./orgs/Site";

abstract class IEntity {
    @observable
    id?: number;

    @observable
    created_at?: Date;

    //
    @observable
    company?: Company;

    @observable
    client?: Client;

    @observable
    project?: Project;

    @observable
    site?: Site;

    protected constructor(
        {
            id,
            created_at,

            company,
            client,
            project,
            site,
        }: {
            id?: number;
            created_at?: string;

            company?: object;
            client?: object;
            project?: object;
            site?: object;
        } = {}
    ) {
        this.id = id;
        this.created_at = created_at ? Dates.parse(created_at) : undefined;

        this.company = company ? new Company(company) : undefined;
        this.client = client ? new Client(client) : undefined;
        this.project = project ? new Project(project) : undefined;
        this.site = site ? new Site(site) : undefined;

        // this._onSaveChanges();
    }

    @computed
    get isNew() {
        return this.id === undefined;
    }

    @computed
    get isNotNew() {
        return !this.isNew;
    }

    abstract save(): Promise<IEntity | null>;

    abstract converter(data: {
        [key: string]: any
    }): IEntity;

    private async _upsert(attrs: {
        [key: string]: any
    }): Promise<IEntity | null> {
        const name = this.constructor.name;
        if (this.isNotNew) {
            return await this._update({
                mutation: `
                    mutation update${name}Mutation($id: bigint!, $set: ${name}_set_input!) {
                      update_${name}_by_pk(pk_columns: {id: $id}, _set: $set) {
                        id
                      }
                    }
                `,
                operationName: `update${name}Mutation`,
                attrs,
            });
        }
        return await this._insert({
            mutation: `
                  mutation insert${name}Mutation($object: ${name}_insert_input!) {
                    insert_${name}_one(object: $object) {
                      id
                    }
                }
            `,
            operationName: `insert${name}Mutation`,
            object: attrs,
        });
    }

    private async _insert({mutation, operationName, object}: {
        mutation: string;
        operationName: string;
        object?: {
            [key: string]: any
        };
    }): Promise<IEntity | null> {
        // try {
        //     const {data} = await gqlClient.mutate({
        //         mutation,
        //         variables: {object},
        //     });
        //
        //     if (!data) return null;
        //
        //     return await this.findById(data.id);
        // } catch (err) {
        //     console.error('_insert error:', err);
        //     return null;
        // }
        return null;
    }

    private async _update({mutation, operationName, attrs}: {
        mutation: string;
        operationName: string;
        attrs: {
            [key: string]: any
        };
    }): Promise<IEntity | null> {
        if (this.isNotNew) {
            return null;
        }

        attrs.id = this.id;

        // try {
        //     const {data} = await gqlClient.mutate({
        //         mutation,
        //         variables: attrs,
        //     });
        //
        //     if (!data) return null;
        //
        //     return this.converter(data);
        // } catch (err) {
        //     console.error('_update error:', err);
        //     return null;
        // }

        return null;
    }

    private async findById(id: number): Promise<IEntity | null> {
        // try {
        //     const name = this.constructor.name;
        //     const {data} = await gqlClient.query({
        //         query: `
        //           query findById${name}Query($id: bigint!) {
        //             ${name}_by_pk(id: $id) {
        //               id
        //               ${this.findByIdReturn}
        //             }
        //           }
        //         `,
        //         variables: {id},
        //     });
        //
        //     if (!data) return null;
        //
        //     return this.converter(data);
        // } catch (err) {
        //     console.error('findById error:', err);
        //     return null;
        // }

        return null;
    }

    abstract get findByIdReturn(): string;

}

export default IEntity;
