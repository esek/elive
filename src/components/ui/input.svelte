<script lang="ts">
	export let placeholder: string = '';
	export let value: string | null;
	export let name: string;

	export let isDisabled: boolean = false;
	export let label: string | null = null;
	export let helper: string | null = null;

	const n = `input-${name}`;
</script>

<div class="relative" data-component="input">
	{#if label}
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="absolute top-3 left-4 block text-sm text-gray-800" htmlfor={n}>{label}</label>
	{/if}
	<input
		bind:value
		{placeholder}
		id={n}
		class="h-18 w-full rounded-md border border-gray-300 px-4 pt-8 pb-3 outline-none transition-all focus:border-gray-600 disabled:cursor-not-allowed disabled:bg-gray-200"
		disabled={isDisabled}
	/>
	{#if helper}
		<p class="mt-1 pl-2 text-xs text-gray-600">{helper}</p>
	{/if}
</div>

<style lang="scss">
</style>
