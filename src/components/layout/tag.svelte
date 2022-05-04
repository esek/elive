<script lang="ts">
	export let size: 'xs' | 'sm' | 'md' = 'md';
</script>

<div
	class="inline-block overflow-hidden rounded-full px-4 py-1 {$$props.class}"
	class:text-xs={size === 'xs'}
	class:text-sm={size === 'sm'}
	class:text-base={size === 'md'}
	data-component="tag"
	style={$$props.style}
>
	<slot />
</div>

<style lang="scss">
</style>
