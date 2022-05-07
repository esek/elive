<script lang="ts" context="module">
	import EditCard from '$/components/feature/services/edit-card.svelte';
	import ColorInput from '$/components/ui/color-input.svelte';
	import Input from '$/components/ui/input.svelte';
	import MultiInput from '$/components/ui/multi-input.svelte';
	import RadioButtons from '$/components/ui/radio-buttons.svelte';
	import DefaultColors from '$/constants/colors';
	import type { Option } from '$/models/Form';
	import type { FullService, StrippedService } from '$/models/ServiceResponse';
	import type { ServiceButtonOptions } from '@prisma/client';
	import type { Load } from '@sveltejs/kit';
	import Icon from 'svelte-icons-pack';
	import FiSave from 'svelte-icons-pack/fi/FiSave';

	export const load: Load = async ({ params, fetch }) => {
		const { action, id } = params;

		if (!['edit', 'new'].includes(action)) {
			return {
				status: 404
			};
		}

		const isNew = action === 'new';

		if (isNew) {
			if (id) {
				return {
					status: 404
				};
			}

			return {
				props: {
					isNew
				}
			};
		}

		if (!isNew && !id) {
			return {
				status: 404
			};
		}

		const service: FullService = await fetch(`/api/services/${id}`).then((res) => res.json());

		return {
			props: {
				isNew: action === 'new',
				service
			}
		};
	};
</script>

<script lang="ts">
	export let isNew: boolean;
	export let service: FullService | null;

	let form: StrippedService<'id' | 'createdAt' | 'updatedAt'> & {
		button: Omit<ServiceButtonOptions, 'id' | 'serviceId'>;
	} = {
		name: service?.name ?? '',
		description: service?.description ?? '',
		statusUrl: service?.statusUrl ?? '',
		errorOverride: service?.errorOverride ?? '',
		method: service?.method ?? 'GET',
		successOverride: service?.successOverride ?? '',
		type: service?.type ?? 'JSON',
		parser: service?.parser ?? '',
		button: {
			label: service?.button?.label ?? '',
			successColor: service?.button?.successColor ?? DefaultColors.success,
			errorColor: service?.button?.errorColor ?? DefaultColors.error
		}
	};

	let headers: Option[] = service?.headers?.map((h) => ({ label: h.key, value: h.value })) ?? [];

	const handleSubmit = () => {
		const body = {
			...form,
			headers: headers.map((h) => ({ key: h.label, value: h.value }))
		};

		const bodyStr = JSON.stringify(body);

		if (isNew) {
			createService(bodyStr);
		} else {
			updateService(bodyStr);
		}
	};

	const createService = async (body: string) => {
		const res = await fetch('/api/services', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body
		});

		if (res.status === 201) {
			window.location.href = '/services';
		}

		console.log(res);
	};

	const updateService = async (body: string) => {
		const res = await fetch(`/api/services/${service?.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body
		});

		if (res.status === 200) {
			window.location.href = '/services';
		}

		console.log(res);
	};
</script>

<form class="grid gap-8" on:submit|preventDefault={handleSubmit}>
	<EditCard title="Base settings">
		<Input
			name="name"
			bind:value={form.name}
			label="Service name"
			helper="Give your service a describing name"
		/>

		<Input
			name="label"
			bind:value={form.button.label}
			label="Label"
			helper="This is what will be shown on badges etc."
		/>
	</EditCard>

	<EditCard
		title="URL Settings"
		description="Settings regarding the webpage/api that the status is fetched from"
	>
		<Input
			name="url"
			bind:value={form.statusUrl}
			label="URL"
			placeholder="Ex. https://esek.se"
			helper="The URL that the status is fetched from"
		/>

		<RadioButtons
			options={['GET', 'POST', 'PUT', 'PATCH', 'DELETE']}
			bind:value={form.method}
			helper="What method should be used to fetch the status?"
		/>

		<div class="col-span-full">
			<MultiInput label="Request headers" bind:values={headers} />
		</div>
	</EditCard>

	<EditCard title="Data settings">
		<RadioButtons
			options={['JSON', 'XML', 'YAML']}
			value={form.type}
			helper="What type of response are you fetching?"
		/>

		<Input
			name="parser"
			bind:value={form.parser}
			label="Parsing"
			placeholder="Ex. $.name"
			helper="Leave this field empty to get entire response"
		/>

		<Input
			name="success-override"
			bind:value={form.successOverride}
			label="Success message"
			helper="Override the fetched success message if the request suceeds"
		/>

		<Input
			name="error-override"
			bind:value={form.errorOverride}
			label="Error message"
			helper="Override the fetched error message if the request fails"
		/>

		<ColorInput
			name="success-color"
			bind:value={form.button.successColor}
			label="Success color"
			placeholder={DefaultColors.success}
		/>

		<ColorInput
			name="error-color"
			bind:value={form.button.errorColor}
			label="Error color"
			placeholder={DefaultColors.error}
		/>
	</EditCard>

	<button
		class="fixed bottom-8 right-8 flex aspect-square h-16 items-center justify-center gap-4 rounded-full bg-sky-100 px-4 text-sky-400 shadow-md transition-all hover:bg-sky-200/70"
		type="submit"
	>
		<span class="text-2xl">
			<Icon src={FiSave} color="currentColor" />
		</span>
	</button>
</form>

<style lang="scss">
</style>
