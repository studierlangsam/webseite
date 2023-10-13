<script lang="ts">
	import Link from "$lib/Link.svelte";
	import Section from "../Section.svelte";
	import Tutor from "./Tutor.svelte";
    import { loadTutors } from "./tutors";
</script>

<Section address="Tutor:innen" />
<p>
    Wir sind die Menschen, die dich durch deine O-Phase begleiten werden. 
    Falls du irgendwelche Fragen hast, kannst du uns jederzeit eine Email an 
    <a href="mailto:tutoren@studierlangsam.de">tutoren@studierlangsam.de</a> schreiben.
</p>
{#await loadTutors() then tutors}
<div class="tutors">
{#each tutors as tutor}
    <Tutor {tutor} />
{/each}
</div>
{/await}

<style lang="scss">
@use "$style/base";
</style>