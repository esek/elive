import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true
	}),

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$: path.resolve('./src')
				}
			}
		}
	}
};

export default config;
