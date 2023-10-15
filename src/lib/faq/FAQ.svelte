<script lang="ts">
	import Link from "../Link.svelte";
	import Section from "../Section.svelte";
	import type { FAQ } from "./faq";
    export let faq: FAQ;
</script>

<Section address="FAQ">
<svelte:fragment slot="title">
    Fragen und Antworten
</svelte:fragment>
<p>
	Auf viele Fragen hat die Fachschaft schon auf ihrer 
    <Link href='https://o-phase.com/de/faq-ws/'> FAQ-Seite</Link>
    Antwort gegeben. 
    Solltest du noch Fragen haben, die hier nicht beantwortet werden,
    dann schreib uns unter <a href='mailto:tutoren@studierlangsam.de'>tutoren@studierlangsam.de</a>!
</p>
{#each faq as qa}
<section>
    <h3>{@html qa.Frage}</h3>
    <p>{@html qa.Antwort}</p>
    {#if !!qa.Fragen} 
    <ul>
        {#each qa.Fragen as subqa}
            <li>
                <p><b>{@html subqa.Frage}</b></p>
                <p>{@html subqa.Antwort}</p>
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