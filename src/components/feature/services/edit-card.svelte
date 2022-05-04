<script lang="ts">
import Card from '$/components/layout/card.svelte';


	export let title: string;
	export let description: string | null = null;
	
</script>

<Card class="col-span-full">
	<h2 class="text-lg font-bold">{title}</h2>
	{#if description}
	<p class="text-gray-600">{description}</p>
	{/if}

	<div class="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
		<slot />
	</div>
</Card>

<style lang="scss">
</style>