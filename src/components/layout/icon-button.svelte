<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from 'svelte-icons-pack';
	export let icon: unknown;
	export let label: string;
	export let variant: 'primary' | 'secondary' | 'danger' = 'secondary';
	export let href: string | null = null;
	export let useGoto: boolean = true;

	const handleClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> = (e) => {
		if (href) {
			e.preventDefault();
			useGoto ? goto(href) : window.open(href, '_blank');
		}
	};
</script>

<button
	class="aspect-square rounded-md p-2 text-lg transition-colors"
	class:hover:bg-sky-100={variant === 'primary'}
	class:hover:text-sky-600={variant === 'primary'}
	class:hover:bg-gray-200={variant === 'secondary'}
	class:hover:bg-red-200={variant === 'danger'}
	class:hover:text-red-600={variant === 'danger'}
	aria-label={label}
	title={label}
	on:click={handleClick}
	on:click
>
	<Icon src={icon} color="currentColor" />
</button>

<style lang="scss">
</style>
