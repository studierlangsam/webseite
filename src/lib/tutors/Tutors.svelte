<script lang="ts">
	import Section from "../Section.svelte";
	import Tutor from "./Tutor.svelte";
    import type {Tutor as T} from "./tutors.ts";
    import { language } from '../stores';
    export let tutors: T[];
</script>

<Section address="Tutor:innen">
{#if $language.german}
    <p>
        Wir sind die Menschen, die dich durch deine O-Phase begleiten werden. 
        Falls du irgendwelche Fragen hast, kannst du uns jederzeit eine Email an 
        <a href="mailto:tutoren@studierlangsam.de">tutoren@studierlangsam.de</a> schreiben.
    </p>
{:else}
    <p>
        We're the people who will guide you through your O-Phase. If you have any questions,
        you can always write an email to <a href="mailto:tutoren@studierlangsam.de">tutoren@studierlangsam.de</a>.
    </p>
{/if}
<div class="tutors">
{#each tutors as tutor}
    <Tutor {tutor} />
{/each}
</div>
</Section>
<style lang="scss">
@use "$style/base";
</style>