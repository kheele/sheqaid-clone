import {computed} from 'mobx';

class Input {

    @computed
    get inputSelectedClient() {
        return this.storage.attrs.get("inputSelectedClient");
    }

    @computed
    get inputSelectedProject() {
        return this.storage.attrs.get("inputSelectedProject");
    }

    @computed
    get inputSelectedSite() {
        return this.storage.attrs.get("inputSelectedSite");
    }

    set inputSelectedClient(val) {
        this.storage.attrs.set("inputSelectedClient", val);
    }

    set inputSelectedProject(val) {
        this.storage.attrs.set("inputSelectedProject", val);
    }

    set inputSelectedSite(val) {
        this.storage.attrs.set("inputSelectedSite", val);
    }

}

const input = new Input();
export default input;
