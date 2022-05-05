<script lang="ts" context="module">
	import EditCard from '$/components/feature/services/edit-card.svelte';
	import ColorInput from '$/components/ui/color-input.svelte';
	import Input from '$/components/ui/input.svelte';
	import MultiInput from '$/components/ui/multi-input.svelte';
	import RadioButtons from '$/components/ui/radio-buttons.svelte';
	import DefaultColors from '$/constants/colors';
	import type { Option } from '$/models/Form';
	import type { ServiceResponse } from '$/models/ServiceResponse';
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

		const service: ServiceResponse = await fetch(`/api/services/${id}`).then((res) => res.json());

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
	export let service: ServiceResponse | null;

	let form = {
		name: service?.name ?? '',
		description: service?.description ?? '',
		status: {
			label: service?.status.label ?? '',
			method: service?.status.method ?? 'GET',
			statusUrl: service?.status.statusUrl ?? '',
			type: service?.status.type ?? 'JSON',
			successString: service?.status.successString ?? '',
			successColor: service?.status.successColor ?? DefaultColors.success,
			errorString: service?.status.errorString ?? '',
			errorColor: service?.status.errorColor ?? DefaultColors.error,
			parser: service?.status.parser ?? ''
		}
	};

	let headers: Option[] =
		service?.status.headers.map((h) => ({ label: h.key, value: h.value })) ?? [];

	const handleSubmit = () => {
		if (isNew) {
			createService();
		} else {
			updateService();
		}
	};

	const createService = async () => {
		const res = await fetch('/api/services', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: form.name,
				description: form.description,
				status: {
					label: form.status.label,
					method: form.status.method,
					statusUrl: form.status.statusUrl,
					type: form.status.type,
					successString: form.status.successString,
					successColor: form.status.successColor,
					errorString: form.status.errorString,
					errorColor: form.status.errorColor,
					parser: form.status.parser,
					headers: headers
						.filter((h) => h.label && h.value)
						.map((h) => ({ key: h.label, value: h.value }))
				}
			})
		});

		if (res.status === 201) {
			window.location.href = '/services';
		}

		console.log(res);
	};

	const updateService = async () => {
		const res = await fetch(`/api/services/${service?.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: form.name,
				description: form.description,

				status: {
					label: form.status.label,
					method: form.status.method,
					statusUrl: form.status.statusUrl,
					type: form.status.type,
					successString: form.status.successString,
					successColor: form.status.successColor,
					errorString: form.status.errorString,
					errorColor: form.status.errorColor,
					parser: form.status.parser,
					headers: headers
						.filter((h) => h.label && h.value)
						.map((h) => ({ key: h.label, value: h.value }))
				}
			})
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
			bind:value={form.status.label}
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
			bind:value={form.status.statusUrl}
			label="URL"
			placeholder="Ex. https://esek.se"
			helper="The URL that the status is fetched from"
		/>

		<RadioButtons
			options={['GET', 'POST', 'PUT', 'PATCH', 'DELETE']}
			bind:value={form.status.method}
			helper="What method should be used to fetch the status?"
		/>

		<div class="col-span-full">
			<MultiInput label="Request headers" bind:values={headers} />
		</div>
	</EditCard>

	<EditCard title="Data settings">
		<RadioButtons
			options={['JSON', 'XML', 'YAML']}
			value={form.status.type}
			helper="What type of response are you fetching?"
		/>

		<Input
			name="parser"
			bind:value={form.status.parser}
			label="Parsing"
			placeholder="Ex. $.name"
			helper="Leave this field empty to get entire response"
		/>

		<Input
			name="success-override"
			bind:value={form.status.successString}
			label="Success message"
			helper="Override the fetched success message if the request suceeds"
		/>

		<Input
			name="error-override"
			bind:value={form.status.errorString}
			label="Error message"
			helper="Override the fetched error message if the request fails"
		/>

		<ColorInput
			name="success-color"
			bind:value={form.status.successColor}
			label="Success color"
			placeholder={DefaultColors.success}
		/>

		<ColorInput
			name="error-color"
			bind:value={form.status.errorColor}
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
