import DocsSource from './DocsSource';

const REPO = 'ScarysMonsters/palantir.js';

class PalantirSource extends DocsSource {
	public async fetchDocs(_tag?: string | null): Promise<any[]> {
		const tags = await this.fetchTags().catch(() => ['main']);

		const rawBase = `https://raw.githubusercontent.com/${REPO}/refs/heads/main`;

		const res = await fetch(`${rawBase}/docs/main.json`);
		if (!res.ok) {
			throw new Error(`Failed to fetch palantir.js docs data file from GitHub (status: ${res.status})`);
		}

		const documentation = await res.json();

		let readme: string | null = null;
		try {
			const readmeRes = await fetch(`${rawBase}/README.md`);
			if (readmeRes.ok) readme = await readmeRes.text();
		} catch {
			readme = null;
		}

		if (readme) {
			documentation.custom = {
				...documentation.custom,
				general: {
					...(documentation.custom?.general ?? { name: 'General' }),
					files: {
						...(documentation.custom?.general?.files ?? {}),
						welcome: { name: 'Welcome', type: 'md', content: readme },
					},
				},
			};
		}

		return [tags, documentation];
	}
}

export default new PalantirSource({
	id: 'palantir',
	name: 'palantir.js',
	global: 'palantir',
	docsRepo: REPO,
	repo: REPO,
	defaultTag: 'main',
	branchFilter: (branch: string) => branch === 'main',
	tagFilter: () => false,
});
