import {observer} from 'mobx-react';
import {computed, observable} from 'mobx';
import CircularProgress from '@material-ui/core/CircularProgress';
import {LoadingStatus} from "./ACol";

@observer
class ARow extends React.Component {
    @observable state = {
        list: [],
        loadingStatus: LoadingStatus.LOADING,
    };

    constructor(props) {
        super(props);

        this.getArgs = this.getArgs.bind(this);
        this.renderList = this.renderList.bind(this);
    }

    @computed get loadingStatus() {
        return this.state.loadingStatus;
    }

    set loadingStatus(status) {
        this.state.loadingStatus = status;
    }

    @computed get list() {
        return this.state.list;
    }

    set list(list) {
        this.state.list = list;
    }

    componentDidMount() {
        const args = this.getArgs();

        this.loadingStatus = LoadingStatus.LOADING;

        const list = this.listFn;
        list(args).then(res => {
            this.list = res;
            this.loadingStatus = LoadingStatus.LOADED;
        }).catch(err => {
            console.log(err);
            this.loadingStatus = LoadingStatus.ERROR;
        });
    }

    render() {
        const {loadingStatus} = this;
        if (loadingStatus === LoadingStatus.LOADING) return <CircularProgress className="fixed-center" size="20px"/>;
        if (loadingStatus === LoadingStatus.ERROR) return <p className="fixed-center">
            Sorry! Couldn't load results. Please check internet connection or reload the page.
        </p>;

        return this.renderList();
    }
}

export default ARow;
