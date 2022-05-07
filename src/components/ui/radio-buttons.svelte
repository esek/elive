<script lang="ts">
	import type { Option } from '$/models/Form';
	import { createEventDispatcher } from 'svelte';

	export let options: (Option | string)[];
	export let value: string;

	export let helper: string | null = null;

	const dispatch = createEventDispatcher();

	const parseOptions = () => {
		return options.map((o) => (typeof o === 'string' ? { label: o, value: o } : o));
	};

	const handleClick = (v: string) => () => {
		value = v;
		dispatch('click', v);
	};

	$: isActive = (v: string) => {
		return v === value;
	};
</script>

<div class="radio-buttons flex flex-1 flex-col">
	<div class="flex h-16 rounded-md border border-gray-300">
		{#each parseOptions() as { label, value }}
			{@const active = isActive(value)}

			<button
				class="flex flex-1 items-center justify-center"
				class:bg-sky-100={active}
				class:text-sky-600={active}
				on:click={handleClick(value)}
				type="button"
			>
				{label}
			</button>
		{/each}
	</div>

	{#if helper}
		<p class="mt-1 pl-2 text-xs text-gray-600">{helper}</p>
	{/if}
</div>

<style lang="scss">
</style>
