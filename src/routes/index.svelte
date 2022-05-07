<script lang="ts" context="module">
	import ServicesGrid from '$/components/feature/services/services-grid.svelte';
	import type { ServiceWithStatus } from '$/models/ServiceResponse';
	import type { Load } from '.svelte-kit/types/src/routes';

	export const load: Load = async ({ fetch }) => {
		const services = await fetch('/api/services/status').then((res) => res.json());

		return {
			props: {
				services
			}
		};
	};
</script>

<script lang="ts">
	export let services: ServiceWithStatus[];
</script>

<ServicesGrid {services} />

<style lang="scss">
</style>
