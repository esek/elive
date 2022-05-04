<script lang="ts" context="module">
	import ServicesGrid from '$/components/feature/services/services-grid.svelte';
	import type { ServiceStatusResponse } from '$/models/ServiceStatusResponse';
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
	export let services: ServiceStatusResponse[];
</script>

<ServicesGrid {services} />

<style lang="scss">
</style>
