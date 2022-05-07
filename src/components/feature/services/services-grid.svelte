<script lang="ts">
	import type { ServiceWithStatus } from '$/models/ServiceResponse';
	import NewServiceCard from './new-service-card.svelte';
	import Service from './service.svelte';

	export let services: ServiceWithStatus[];
</script>

<div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3" data-component="services-grid">
	{#each services as service}
		<Service data={service} />
	{/each}
	<NewServiceCard />
</div>

<style lang="scss">
</style>
