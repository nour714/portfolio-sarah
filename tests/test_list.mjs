import fs from 'fs';

const firebaseConfig = {
    apiKey:            "AIzaSyA2Y3RuOABffeNJmWfg_uBGqF3chsaTwfQ",
    projectId:         "portfolio-9a88b",
};
const FIRESTORE_DB_ID = "default";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${FIRESTORE_DB_ID}/documents`;

function fromFirestoreValue(firestoreValue) {
    if (!firestoreValue) return null;
    if ("nullValue"    in firestoreValue) return null;
    if ("booleanValue" in firestoreValue) return firestoreValue.booleanValue;
    if ("integerValue" in firestoreValue) return parseInt(firestoreValue.integerValue, 10);
    if ("doubleValue"  in firestoreValue) return firestoreValue.doubleValue;
    if ("stringValue"  in firestoreValue) return firestoreValue.stringValue;
    if ("bytesValue"   in firestoreValue) return firestoreValue.bytesValue;
    if ("timestampValue" in firestoreValue) return firestoreValue.timestampValue;
    if ("referenceValue" in firestoreValue) return firestoreValue.referenceValue;
    if ("geoPointValue" in firestoreValue) return firestoreValue.geoPointValue;
    if ("arrayValue" in firestoreValue) return (firestoreValue.arrayValue.values || []).map(fromFirestoreValue);
    if ("mapValue" in firestoreValue) {
        let result = {};
        for(let [k,v] of Object.entries(firestoreValue.mapValue.fields || {})) result[k] = fromFirestoreValue(v);
        return result;
    }
    return null;
}

function firestoreDocToObject(doc) {
    if (!doc || !doc.fields) return {};
    const obj = {};
    for (const [k, v] of Object.entries(doc.fields)) {
        obj[k] = fromFirestoreValue(v);
    }
    return obj;
}

async function testList() {
    console.log("Fetching messages...");
    const url = `${FIRESTORE_BASE}/messages?key=${firebaseConfig.apiKey}&pageSize=200`;
    const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
    if (!res.ok) {
        console.error("FAIL", res.status, await res.text());
        return;
    }
    const json = await res.json();
    const docs = json.documents || [];
    
    console.log("Found", docs.length, "docs");
    const arr = docs.map(doc => {
        const obj = firestoreDocToObject(doc);
        obj._id = doc.name.split("/").pop();
        return obj;
    });
    console.log(JSON.stringify(arr, null, 2));
}

testList();
