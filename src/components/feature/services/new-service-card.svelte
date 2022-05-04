<script lang="ts">
	import Card from '$/components/layout/card.svelte';
	import Routes from '$/constants/routes';
	import Icon from 'svelte-icons-pack';
	import IoExtensionPuzzleOutline from 'svelte-icons-pack/io/IoExtensionPuzzleOutline';
</script>

<a href={Routes.NEW} data-component="new-service-card">
	<Card class="flex h-full cursor-pointer items-center justify-center hover:bg-gray-50">
		<div class="flex flex-col items-center gap-2">
			<span class="text-3xl">
				<Icon src={IoExtensionPuzzleOutline} label="Service" />
			</span>
			<h2 class="text-lg font-medium">Create new service</h2>
		</div>
	</Card>
</a>

<style lang="scss">
</style>
