import workers from "workers/Workers";

window.DATA_LOAD_STATUS = {
    LOADING: "loading",
    ERROR: "error",
    LOADED: "loaded",
};

window.workers = workers;
