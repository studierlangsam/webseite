<script lang="ts">
	import Link from "../Link.svelte";
	import Section from "../Section.svelte";
	import type { FAQ } from "./faq";
    import { language } from "../stores";
	import exp from "constants";
    export let faq: FAQ;
    export let faq_en: FAQ;
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
        Auf viele Fragen hat die Fachschaft schon auf ihrer 
        <Link href='https://o-phase.com/de/ws2526/faq/'> FAQ-Seite</Link>
        Antwort gegeben. 
        Solltest du noch Fragen haben, die hier nicht beantwortet werden,
        dann schreib uns unter <a href='mailto:tutoren@studierlangsam.de'>tutoren@studierlangsam.de</a>!
    </p>
{:else}
    <p>
        The Fachschaft already has the answers to many questions on their
        <Link href='https://o-phase.com/en/ws2526/faq/'> FAQ page</Link>.
        If you have any questions which aren't answered here, write to us at
        <a href='mailto:tutoren@studierlangsam.de'>tutoren@studierlangsam.de</a>!
    </p>
{/if}
{#each faq as qa}
<section>
    {#if $language.german}
        <h3>{qa.Frage}</h3>
        <p>{qa.Antwort}</p>
    {:else if !!qa.Question}
        <h3>{@html qa.Question}</h3>   
        <p>{@html qa.Answer}</p>
    {/if}
    {#if !!qa.Fragen} 
    <ul>
        {#each qa.Fragen as subqa}
            <li>
                <p><b>{@html $language.german ? subqa.Frage : qa.Question}</b></p>
                <p>{@html $language.german ? subqa.Antwort : qa.Answer}</p>
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