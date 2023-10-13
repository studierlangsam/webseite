<script lang="ts">
	import Section from "../Section.svelte";
	import Tutor from "./Tutor.svelte";
    import type {Tutor as T} from "./tutors.ts";
    export let tutors: T[];
</script>

<Section address="Tutor:innen" />
<p>
    Wir sind die Menschen, die dich durch deine O-Phase begleiten werden. 
    Falls du irgendwelche Fragen hast, kannst du uns jederzeit eine Email an 
    <a href="mailto:tutoren@studierlangsam.de">tutoren@studierlangsam.de</a> schreiben.
</p>
<div class="tutors">
{#each tutors as tutor}
    <Tutor {tutor} />
{/each}
</div>

<style lang="scss">
@use "$style/base";
</style>