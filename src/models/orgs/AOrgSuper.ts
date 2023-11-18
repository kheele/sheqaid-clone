import {observable} from 'mobx';
import IEntity from '../IEntity';

abstract class AOrgSuper extends IEntity {

    @observable
    name?: string;

    protected constructor(
        {
            id,
            created_at,

            name,

            company,
            client,
            project,
            site,
        }: {
            id?: number;
            created_at?: string;

            name?: string;

            company?: object;
            client?: object;
            project?: object;
            site?: object;
        } = {}) {
        super({
            id,
            created_at,

            company,
            client,
            project,
            site,
        });

        this.name = name;
    }

}

export default AOrgSuper;
