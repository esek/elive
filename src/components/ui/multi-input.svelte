<script lang="ts">
	import type { Option } from '$/models/Form';
	import { onMount } from 'svelte';
	import Icon from 'svelte-icons-pack';
	import FiPlus from 'svelte-icons-pack/fi/FiPlus';
	import FiTrash2 from 'svelte-icons-pack/fi/FiTrash2';
	import IconButton from './icon-button.svelte';
	import Input from './input.svelte';

	export let values: Option[] = [];
	export let keyPlaceholder: string = '';
	export let valuePlaceholder: string = '';

	export let label: string | null = null;

	const addInput = () => {
		values = [...values, { label: '', value: '' }];
	};

	const removeInput = (idx: number) => () => {
		if (values.length < 2) {
			return;
		}
		values = [...values.slice(0, idx), ...values.slice(idx + 1)];
	};

	onMount(() => {
		if (!values?.length) {
			addInput();
		}
	});
</script>

<div class="multi-input space-y-2">
	{#if label}
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="block text-sm text-gray-800">{label}</label>
	{/if}

	<div class="grid gap-4">
		{#each values as { value, label }, i}
			<Input
				label="Key"
				name="{label}{i}"
				bind:value={values[i].label}
				placeholder={keyPlaceholder}
			/>

			<Input
				label="Value"
				name="{value}{i}"
				bind:value={values[i].value}
				placeholder={valuePlaceholder}
			/>

			<div class="place-self-center">
				<IconButton icon={FiTrash2} label="Remove" variant="danger" on:click={removeInput(i)} />
			</div>
		{/each}

		<button class="flex items-center gap-1 text-xs hover:text-sky-600" on:click={addInput}>
			<Icon src={FiPlus} label="Add" />
			Add another field
		</button>
	</div>
</div>

<style lang="scss">
	.grid {
		grid-template-columns: repeat(2, 1fr) auto;
	}
</style>
