<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params }) => {
		const { action, id } = params;

		if (!['edit', 'new'].includes(action)) {
			return {
				status: 404
			};
		}

		if (action === 'new' && id) {
			return {
				status: 404
			};
		}

		return {
			props: {
				isNew: action === 'new',
				id
			}
		};
	};
</script>

<script lang="ts">
	export let isNew: boolean;
	export let id: string | null;
</script>

<div class="[id]">{isNew}{id}</div>

<style lang="scss">
</style>
