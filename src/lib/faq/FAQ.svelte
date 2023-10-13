<script lang="ts">
	import Link from "../Link.svelte";
	import Section from "../Section.svelte";
	import type { FAQ } from "./faq";
    export let faq: FAQ;
</script>

<Section address="FAQ">Fragen und Antworten</Section>
<p>
	Auf viele Fragen hat die Fachschaft schon auf ihrer 
    <Link href='https://o-phase.com/de/faq-ws/'> FAQ-Seite</Link>
    Antwort gegeben. 
    Solltest du noch Fragen haben, die hier nicht beantwortet werden,
    dann schreib uns unter <a href='mailto:tutoren@studierlangsam.de'>tutoren@studierlangsam.de</a>!
</p>
{#each faq.Allgemein as qa}
    <h3>{@html qa.Frage}</h3>
    <p>{@html qa.Antwort}</p>
{/each}
<br>
<ul>
{#each faq.Wichtig as qa}
    <li>
        <p><b>{@html qa.Frage}</b></p>
        <p>{@html qa.Antwort}</p>
    </li>
{/each}
</ul>