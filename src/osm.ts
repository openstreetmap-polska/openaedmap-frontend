export async function fetchNodeDataFromOsm(nodeId: string) {
    const url = `https://www.openstreetmap.org/api/0.6/node/${nodeId}.json`;
    console.log("Request object info for node with osm id:", nodeId, " via url: ", url);
    return fetch(url)
        .then(response => response.json())
        .then(response => {
            const node = response["elements"][0];
            const tags = Object.fromEntries(
                Object.entries(node["tags"]).map(([key, val]) => [key.replaceAll(":", "_"), val])
            );
            const {lon, lat} = node;

            return {
                osm_id: node["id"],
                osm_type: "node",
                lat: lat,
                lon: lon,
                ...tags,
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return {};
        });
}

export function updateOsmUsernameState(auth: OSMAuth.OSMAuthInstance, setOsmUsername: (username: string | null) => void) {
    auth.xhr(
        { method: "GET", path: "/api/0.6/user/details" },
        function (err: Error, result: XMLDocument) {
            // result is an XML DOM containing the user details
            if (err) {
                console.log(err);
                throw err;
            }
            const userObject = result.getElementsByTagName('user')[0];
            setOsmUsername(userObject.getAttribute('display_name'));
        }
    );
}

export function getOpenChangesetId(auth: OSMAuth.OSMAuthInstance, openChangesetId: string, openChangesetIdSetter: (changesetId: string) => void, lang: string) {
    return new Promise((resolve, reject) => {
        if (openChangesetId) {
            console.log("Open changeset exists:", openChangesetId);
            resolve(openChangesetId);
        } else {
            const root = document.implementation.createDocument(null, "osm");
            const changeset = document.createElementNS(null, "changeset");
            const comment = document.createElementNS(null, "tag");
            comment.setAttribute("k", "comment");
            comment.setAttribute("v", "Defibrillator added via https://openaedmap.org #aed");
            const created_by = document.createElementNS(null, "tag");
            created_by.setAttribute("k", "created_by");
            created_by.setAttribute("v", "https://openaedmap.org");
            const locale = document.createElementNS(null, "tag");
            locale.setAttribute("k", "locale");
            locale.setAttribute("v", lang);
            const hashtags = document.createElementNS(null, "tag");
            hashtags.setAttribute("k", "hashtags");
            hashtags.setAttribute("v", "#aed");
            changeset.appendChild(comment);
            changeset.appendChild(created_by);
            changeset.appendChild(locale);
            changeset.appendChild(hashtags);
            root.documentElement.appendChild(changeset);
            let serializer = new XMLSerializer();
            let data = serializer.serializeToString(root);

            auth.xhr({
                method: 'PUT',
                path: '/api/0.6/changeset/create',
                content: data,
                headers: {
                    "Content-Type": "text/xml"
                },
            }, (err: Error, res) => {
                if (err) {
                    reject(err);
                } else {
                    openChangesetIdSetter(res);
                    console.log('Api returned changeset id: ' + res);
                    resolve(res);
                }
            });
        }
    });
}

export function addDefibrillatorToOSM(auth: OSMAuth.OSMAuthInstance, changesetId: string, data: DefibrillatorData) {
    console.log(data);
    return new Promise((resolve, reject) => {
        console.log('sending request to create node in changeset: ' + changesetId);

        const root = document.implementation.createDocument(null, "osm");
        const node = document.createElementNS(null, "node");
        node.setAttribute("changeset", changesetId);
        node.setAttribute("lat", data.lat);
        node.setAttribute("lon", data.lng);
        Object.entries(data.tags).map(([key, value]) => {
            const tag = document.createElementNS(null, "tag");
            tag.setAttribute("k", key);
            tag.setAttribute("v", value);
            return tag;
        }).forEach(el => {
            node.appendChild(el);
        });
        root.documentElement.appendChild(node);
        let serializer = new XMLSerializer();
        let xml = serializer.serializeToString(root);

        console.log('payload: ' + xml);
        auth.xhr({
            method: 'PUT',
            path: '/api/0.6/node/create',
            content: xml,
            headers: {
                "Content-Type": "text/xml"
            },
        }, (err: Error, res: string) => {
            if (err) reject(err);
            else {
                console.log(`API returned node id: ${res}`);
                resolve(res);
            }
        });
    });
}

interface DefibrillatorData {
    lng: string,
    lat: string,
    tags: { [key: string]: string },
};