<script lang="ts" context="module">
	import Navbar from '$/components/layout/navbar.svelte';
	import '$/styles/main.scss';
</script>

<script lang="ts">
</script>

<div class="space-y-4 pb-24">
	<Navbar />
	<main class="max-w">
		<slot />
	</main>
</div>

<style lang="scss" global>
</style>
