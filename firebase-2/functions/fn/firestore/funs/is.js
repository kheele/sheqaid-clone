
exports.IS_REMOVED = 0;
exports.IS_ADDED = 1;
exports.IS_CHANGED = 2;
exports.IS_UNCHANGED = -1;

exports.isNoRestoredRemoved = (change) => {
    const {removed: oldRemoved} = change.before.data();
    const {removed: newRemoved} = change.after.data();
    return !oldRemoved && !newRemoved;
};

exports.isRemoved = (change) => {
    const {removed: oldRemoved} = change.before.data();
    const {removed: newRemoved} = change.after.data();
    return !oldRemoved && newRemoved;
};

exports.isRestored = (change) => {
    const {removed: oldRemoved} = change.before.data();
    const {removed: newRemoved} = change.after.data();
    return oldRemoved && !newRemoved;
};

exports.objectHasKey = objectHasKey = (obj, key) => {
    const props = key.split('.');
    key = props.pop();
    try {
        const reduced = props.reduce((prev, curr) => prev[curr], obj);
        return key in reduced;
    } catch (e) {
        return false;
    }
};

//
exports.valueBefore = valueBefore = (change, val) => {
    const before = change.before.exists ? change.before.data() : null;
    if (before) {
        if (val === 'id') {
            return true;
        }
        return objectHasKey(before, val);
    }
    return false;
};

exports.valueAfter = valueAfter = (change, val) => {
    const after = change.after.exists ? change.after.data() : null;
    if (after) {
        if (val === 'id') {
            return true;
        }
        return objectHasKey(after, val);
    }
    return false;
};

exports.valueCreate = valueCreate = (change, val) => {
    if (!valueBefore(change, val) && valueAfter(change, val)) {
        return true;
    }
    return false;
};

exports.valueDelete = valueDelete = (change, val) => {
    if (valueBefore(change, val) && !valueAfter(change, val)) {
        return true;
    }
    return false;
};

exports.valueChange = (change, val) => {
    if (valueDelete(change, val) || valueCreate(change, val)) {
        return true;
    }
    
    const {getBefore, getAfter} = require('./get');

    if (arraysEqual(getBefore(change, val), getAfter(change, val))) {
        return false;
    }
    return true;
};

exports.eventExists = async (ctx, eventsCol = '_events') => {
    // TODO: add date input

    const eventId = ctx.eventId;

    // only check events once per invocation
    if ((global).AFF_EVENT === eventId) {
        return false;
    }
    (global).AFF_EVENT = eventId;

    // create event for accurate increment
    const eventRef = db_hr.doc(`${eventsCol}/${eventId}`);
    const eventSnap = await eventRef.get();

    // do nothing if event exists
    if (eventSnap.exists) {
        console.log('Duplicate function run: ', eventId);
        return true;
    }
    // add event and update size
    eventRef.set({
        completed: admin_hr.firestore.FieldValue.serverTimestamp()
    }).catch((e) => {
        console.log(e);
    });
    // get yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // delete all _event docs older than yesterday
    const delDocs = [];
    const eventFilter = db_hr.collection(eventsCol).where('completed', '<=', yesterday);
    const eventFilterSnap = await eventFilter.get();
    eventFilterSnap.forEach((doc) => {
        // collect all document references
        delDocs.push(doc.ref);
    });
    const numDocs = delDocs.length;
    // chunk index array at 100 items
    const chunks = new ArrayChunk(delDocs);
    chunks.forEachChunk(async (ch) => {
        const batch = db_hr.batch();
        ch.forEach((docRef) => {
            batch.delete(docRef);
        });
        // delete chunk of events
        console.log('Deleting old events');
        await batch.commit().catch((e) => {
            console.log(e);
        });
        console.log('Finished deleting ', numDocs, ' events');
    });
    return false;
};

exports.arraysEqual = arraysEqual = (a1, a2) => {
    return JSON.stringify(a1) === JSON.stringify(a2);
};

class ArrayChunk {

    constructor(arr, chunk = 100) {
        this.arr = arr;
        this.chunk = chunk;
    }
    
    /**
     * for each chunk
     * @param funct - chunk function
     */
    forEachChunk(funct) {
        for (let i = 0, j = this.arr.length; i < j; i += this.chunk) {
            const tempArray = this.arr.slice(i, i + this.chunk);
            funct(tempArray);
        }
    }
}