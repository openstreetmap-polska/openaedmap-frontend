import { expect, test } from "bun:test";

import { _private } from "./location";

test("parseLocationFromString", () => {
	expect(_private.parseLocationFromString("12/52.5269/14.8466")).toStrictEqual({
		latitude: 52.5269,
		longitude: 14.8466,
		zoom: 12,
	});
});

test("serializeParametersToUrlTarget", () => {
	expect(
		_private.serializeParametersToUrlTarget({
			map: "12/52.5269/14.8466",
			nodeId: "123456789",
		}),
	).toBe("map=12/52.5269/14.8466&nodeId=123456789");
});
