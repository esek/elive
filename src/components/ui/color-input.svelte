<script lang="ts">
	import { toInlineStyles } from '$/helpers/style.helpers';
	export let placeholder: string = '';
	export let value: string;
	export let name: string;

	export let isDisabled: boolean = false;
	export let label: string | null = null;
	export let helper: string | null = null;
	
	const n = `input-${name}`;
</script>

<div class="relative" data-component="input">
	{#if label}
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="block absolute top-3 left-20 text-sm text-gray-800" htmlfor={n}>{label}</label>
	{/if}

	<div class="flex">
		<div class="aspect-square h-16 rounded-l-md" style={toInlineStyles({background: value})}></div>
	<input bind:value={value} {placeholder} id={n} class="h-16 border border-gray-300 rounded-r-md pt-8 pb-3 px-4 w-full outline-none focus:border-gray-600 transition-all disabled:bg-gray-200 disabled:cursor-not-allowed" disabled={isDisabled} />
</div>
	{#if helper}
	<p class="text-xs mt-1 text-gray-600 pl-2">{helper}</p>
	{/if}
</div>

<style lang="scss">
</style>