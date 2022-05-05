<script lang="ts">
	import Card from '$/components/layout/card.svelte';
	import Tag from '$/components/layout/tag.svelte';
	import IconButton from '$/components/ui/icon-button.svelte';
	import Routes from '$/constants/routes';
	import { toDate } from '$/helpers/date.helpers';
	import type { ServiceStatusResponse } from '$/models/ServiceStatusResponse';
	import { invalidate } from '$app/navigation';
	import Icon from 'svelte-icons-pack';
	import FiCheck from 'svelte-icons-pack/fi/FiCheck';
	import FiEdit2 from 'svelte-icons-pack/fi/FiEdit2';
	import FiExternalLink from 'svelte-icons-pack/fi/FiExternalLink';
	import FiTrash2 from 'svelte-icons-pack/fi/FiTrash2';
	import FiX from 'svelte-icons-pack/fi/FiX';

	export let service: ServiceStatusResponse;

	const doDelete = async () => {
		if (!window.confirm('Are you sure you want to delete this service?')) {
			return;
		}

		const response = await fetch(`/api/services/${service.id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			invalidate('/api/services/status');
		}
	};
</script>

<Card>
	<div class="flex items-center justify-between" data-component="service">
		<a href={Routes.EDIT(service.id)}>
			<h2 class="text-xl font-bold hover:text-sky-400">
				{service.name}
			</h2>
		</a>

		<div
			class="flex aspect-square w-fit items-center justify-center rounded-full p-2 text-xl"
			title="Service {service.name} is {service.status.success ? 'up' : 'down'}"
			class:bg-green-200={service.status.success}
			class:text-green-600={service.status.success}
			class:bg-red-200={!service.status.success}
			class:text-red-600={!service.status.success}
		>
			<Icon src={service.status.success ? FiCheck : FiX} />
		</div>
	</div>

	<p class="text-sm text-gray-600">Created at: {toDate(service.createdAt)}</p>
	<p class="text-sm text-gray-600">Last updated at: {toDate(service.updatedAt)}</p>

	<Tag class="mt-2 border border-gray-400 bg-gray-200" size="xs">
		{service.label}: {service.status.data}
	</Tag>

	<div class="mt-2 flex gap-2">
		<IconButton
			icon={FiEdit2}
			label="Edit {service.name}"
			variant="primary"
			href={Routes.EDIT(service.id)}
		/>

		<IconButton
			icon={FiTrash2}
			label="Remove {service.name}"
			variant="danger"
			on:click={doDelete}
		/>

		<IconButton
			icon={FiExternalLink}
			label="View {service.name}"
			href={service.url}
			useGoto={false}
		/>
	</div>
</Card>

<style lang="scss">
</style>
