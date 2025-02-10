
class ShouldCreate {
    static check(data, newVal, key) {
        if (newVal) {
            data[key] = newVal;
        }
    }
//    static checkMany(data, newVals, keys) {
//        if(newVal) {
//            data[key] = newVal;
//        }
//    }
}

export default ShouldCreate;