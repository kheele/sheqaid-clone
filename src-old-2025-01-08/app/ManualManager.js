import {computed, observable} from 'mobx';
import {listManuals} from "mutations/list";

class Manager {

    @observable
    state = {
        list: [],
        listState: 'action',
        dataError: false,
        dataLoaded: false
    };

    constructor() {
        this.onLoadList = this.onLoadList.bind(this);
    }

    @computed
    get isLoadError() {
        return this.state.dataError;
    }

    @computed
    get isLoaded() {
        return this.state.dataLoaded;
    }

    @computed
    get listAll() {
        return this.state.list;
    }

    start() {
        this.onLoadList();
    }

    onLoadList() {
        this.state.dataLoaded = false;
        this.state.dataError = false;

        return listManuals().then(res => {
            this.state.list = res;

            this.state.listState = 'initial';
            this.state.dataError = false;
            this.state.dataLoaded = true;

            return res;
        }).catch(e => {
            console.log(e)
            this.state.listState = 'initial';
            this.state.dataError = true;
            this.state.dataLoaded = true;
            return e;
        });
    }

}

const manager = new Manager();
export default manager;
