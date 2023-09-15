import { DefibrillatorData, NewDefibrillatorData } from "./model/defibrillatorData";

export async function fetchNodeData(url: string): Promise<DefibrillatorData | null> {
    return fetch(url)
        .then((response) => response.json())
        .then((response) => {
            const node = response.elements[0];
            return {
                osmId: node.id,
                osmType: "node",
                lat: node.lat,
                lon: node.lon,
                photoId: node["@photo_id"],
                photoRelativeUrl: node["@photo_url"],
                tags: node.tags,
                version: node.version,
            };
        })
        .catch((error) => {
            console.error("Error:", error);
            return null;
        });
}

export async function fetchNodeDataFromOsm(nodeId: string): Promise<DefibrillatorData | null> {
    const url = `https://www.openstreetmap.org/api/0.6/node/${nodeId}.json`;
    console.log("Request object info for node with osm id:", nodeId, " via url: ", url);
    return fetchNodeData(url);
}

export function updateOsmUsernameState(auth: OSMAuth.OSMAuthInstance, setOsmUsername: (username: string) => void) {
    auth.xhr(
        { method: "GET", path: "/api/0.6/user/details" },
        (err: Error, result: XMLDocument) => {
            // result is an XML DOM containing the user details
            if (err) {
                console.log(err);
                throw err;
            }
            const userObject = result.getElementsByTagName("user")[0];
            const username = userObject.getAttribute("display_name");
            if (username !== null) setOsmUsername(username);
        },
    );
}

function createTagElement(key: string, value: string): Element {
    const tag = document.createElementNS(null, "tag");
    tag.setAttribute("k", key);
    tag.setAttribute("v", value);
    return tag;
}

export function getOpenChangesetId(
    auth: OSMAuth.OSMAuthInstance,
    openChangesetId: string,
    openChangesetIdSetter: (changesetId: string) => void,
    lang: string,
    newAED: boolean,
): Promise<string> {
    return new Promise((resolve, reject) => {
        if (openChangesetId) {
            console.log("Open changeset exists:", openChangesetId);
            resolve(openChangesetId);
        } else {
            const root = document.implementation.createDocument(null, "osm");
            const changeset = document.createElementNS(null, "changeset");
            const changesetComment = `Defibrillator ${newAED ? "added" : "modified"} via https://openaedmap.org #aed`;
            changeset.appendChild(createTagElement("comment", changesetComment));
            changeset.appendChild(createTagElement("created_by", "https://openaedmap.org"));
            if (process.env.REACT_APP_GIT_COMMIT) {
                changeset.appendChild(createTagElement("git_commit", process.env.REACT_APP_GIT_COMMIT));
            }
            changeset.appendChild(createTagElement("locale", lang));
            changeset.appendChild(createTagElement("hashtags", "#aed"));
            root.documentElement.appendChild(changeset);
            const serializer = new XMLSerializer();
            const data = serializer.serializeToString(root);

            auth.xhr({
                method: "PUT",
                path: "/api/0.6/changeset/create",
                content: data,
                headers: {
                    "Content-Type": "text/xml",
                },
            }, (err: Error, res) => {
                if (err) {
                    reject(err);
                } else {
                    openChangesetIdSetter(res);
                    console.log(`Api returned changeset id: ${res}`);
                    resolve(res);
                }
            });
        }
    });
}

export function addDefibrillatorToOSM(auth: OSMAuth.OSMAuthInstance, changesetId: string, data: NewDefibrillatorData)
    : Promise<string> {
    return new Promise((resolve, reject) => {
        console.log(`sending request to create node in changeset: ${changesetId}`);

        const root = document.implementation.createDocument(null, "osm");
        const node = document.createElementNS(null, "node");
        node.setAttribute("changeset", changesetId);
        node.setAttribute("lat", data.lat.toString());
        node.setAttribute("lon", data.lon.toString());
        Object.entries(data.tags).forEach(([key, value]) => {
            node.appendChild(createTagElement(key, value));
        });
        root.documentElement.appendChild(node);
        const serializer = new XMLSerializer();
        const xml = serializer.serializeToString(root);

        console.log(`payload: ${xml}`);
        auth.xhr({
            method: "PUT",
            path: "/api/0.6/node/create",
            content: xml,
            headers: {
                "Content-Type": "text/xml",
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

export function editDefibrillatorInOSM(auth: OSMAuth.OSMAuthInstance, changesetId: string, data: DefibrillatorData)
    : Promise<string> {
    return new Promise((resolve, reject) => {
        console.log(`sending request to edit node in changeset: ${changesetId}`);

        const root = document.implementation.createDocument(null, "osm");
        const node = document.createElementNS(null, "node");
        node.setAttribute("changeset", changesetId);
        node.setAttribute("lat", data.lat.toString());
        node.setAttribute("lon", data.lon.toString());
        const { osmId } = data;
        node.setAttribute("id", osmId);
        node.setAttribute("version", data.version);
        node.setAttribute("visible", "true");
        Object.entries(data.tags).forEach(([key, value]) => {
            node.appendChild(createTagElement(key, value));
        });
        root.documentElement.appendChild(node);
        const serializer = new XMLSerializer();
        const xml = serializer.serializeToString(root);

        console.log(`payload: ${xml}`);
        auth.xhr({
            method: "PUT",
            path: `/api/0.6/node/${osmId}`,
            content: xml,
            headers: {
                "Content-Type": "text/xml",
            },
        }, (err: Error, res: string) => {
            if (err) reject(err);
            else {
                console.log(`API returned node version: ${res}`);
                resolve(res);
            }
        });
    });
}