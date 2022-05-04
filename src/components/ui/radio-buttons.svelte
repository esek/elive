<script lang="ts">
import type { Option } from '$/models/Form';
import { createEventDispatcher } from 'svelte';


	export let options: (Option | string)[];
	export let value: string;

	export let helper: string | null = null;

	const dispatch = createEventDispatcher();

	const parseOptions = () => {
		return options.map(o => (typeof o === 'string' ? { label: o, value: o } : o));
	}

	const isActive = (v: string) => {
		return v === value;
	}

	const handleClick = (v: string) => () => {
		value = v;
		dispatch('click', v);
	}
</script>

<div class="radio-buttons flex flex-col flex-1">
	<div class="h-16 flex border border-gray-300 rounded-md">
	{#each parseOptions() as {label, value}}
		{@const active = isActive(value)}

		<button class="flex items-center justify-center flex-1" class:bg-sky-100={active} class:text-sky-600={active} on:click={handleClick(value)}>
			{label}
		</button>
	{/each}
</div>

	{#if helper}
	<p class="text-xs mt-1 text-gray-600 pl-2">{helper}</p>
	{/if}
</div>

<style lang="scss">
</style>