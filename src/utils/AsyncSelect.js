function onAsyncSelectLoadImpl(path, value, mapResults) {
    value = isString(value) ? value : value.value;
    if (value.isEmpty()) {
        return Promise.resolve([]);
    } else {
        return neonBinding.events.emit(path, value).then(res => {
            if (res.isEmpty()) {
                return res;
            } else {
                return res.map(mapResults);
            }
        }).catch(e => {
            console.log(e)
            return [];
        });
    }
}

export {onAsyncSelectLoadImpl};
