import * as fs from "fs";
import { describe, expect, it } from "vitest";
import { googlePlayPath } from "~/3rdparty/reactStoreBadges";
import languages from "~/languages";

describe("reactStoreBadges", () => {
	for (const language of Object.keys(languages)) {
		it(`google play badge for ${language}`, () => {
			expect(fs.existsSync(`public/${googlePlayPath(language)}`)).toStrictEqual(
				true,
			);
		});
	}
});
