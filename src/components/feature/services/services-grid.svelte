<script lang="ts">
	import type { ServiceStatusResponse } from '$/models/ServiceStatusResponse';
	import NewServiceCard from './new-service-card.svelte';
	import Service from './service.svelte';

	export let services: ServiceStatusResponse[];
</script>

<div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3" data-component="services-grid">
	{#each services as service}
		<Service {service} />
	{/each}
	<NewServiceCard />
</div>

<style lang="scss">
</style>
