<script lang="ts">
	import { onMount } from "svelte";
	import { writable } from "svelte/store";

    const emoji = writable("");

    onMount(async () => {
        const emojione = await import("emojione");
        emojione.imageType = "svg";
        emoji.set(emojione.shortnameToImage(`:${name}:`).replace(/standby=".*?"/, ""))
    })

    export let name: string;
</script>
<span>{@html $emoji}</span>

<style lang="scss">
:global(.emojione) {
	width: 1.1em;
	height: 1.1em;

	vertical-align: -.1em;
}
</style>