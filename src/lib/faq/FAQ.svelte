<script lang="ts">
	import Link from "../Link.svelte";
	import Section from "../Section.svelte";
	import type { FAQ } from "./faq";
    import { language } from "../stores";
	import exp from "constants";
    export let faq: FAQ;
</script>

<Section address="FAQ">
<svelte:fragment slot="title">
    {#if $language.german}
        Fragen und Antworten
    {:else}
        Questions and Answers
    {/if}
</svelte:fragment>
{#if $language.german}
    <p>
        Viele Fragen hat die Fachschaft schon auf ihrer
        <Link href='https://o-phase.com/de/ws2627/faq/'> FAQ-Seite</Link>
        beantwortet.
        Solltest du noch Fragen haben, die hier nicht beantwortet werden,
        dann schreib uns auf Discord (oder frag uns in Person, falls du gerade in der O-Phase vor Ort bist)!
    </p>
{:else}
    <p>
        The Fachschaft already have the answers to many questions on their
        <Link href='https://o-phase.com/en/ws2627/faq/'> FAQ page</Link>.
        If you have any questions which aren't answered here, you can write to us on Discord (or ask in person in case you are currently "on-site" at the O-Phase).
    </p>
{/if}
{#each faq as qa}
<section>
    {#if $language.german}
        <h3>{@html qa.Frage}</h3>
        <p>{@html qa.Antwort}</p>
    {:else if !!qa.Question}
        <h3>{@html qa.Question}</h3>   
        <p>{@html qa.Answer}</p>
    {/if}
    {#if !!qa.Fragen} 
    <ul>
        {#each qa.Fragen as subqa}
            <li>
                <p><b>{@html $language.german ? subqa.Frage : subqa.Question}</b></p>
                <p>{@html $language.german ? subqa.Antwort : subqa.Answer}</p>
            </li>
        {/each}
    </ul>
{/if}
</section>
{/each}
</Section>


<style lang="scss">
ul {
    list-style-type: disc !important;
    margin-left: 4em;
}
</style>