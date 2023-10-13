<script lang="ts">

	import Link from "$lib/Link.svelte";

</script>

<svelte:head>
    <meta name="robots" content="noindex,follow" />
</svelte:head>

<h1>Impressum</h1>
<h3>Kontakt</h3>
<p>Wir sind für alle Fragen unter <a href="mailto:tutoren@studierlangsam.de">tutoren@studierlangsam.de</a> erreichbar. </p>

<h3>Rechte</h3>
<p>
    <Link href="https://creativecommons.org/licenses/by-sa/4.0/" rel="license" class="cc-logo">
        <img alt="Creative Commons Lizenzvertrag" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"/>
    </Link>
    Diese Webseite ist lizenziert unter einer 
    <Link href='https://creativecommons.org/licenses/by-sa/4.0/' rel='license'>
        Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International Lizenz
    </Link>. 
    Graphiken und Bilder sind urheberrechtlich geschützt. Der Quellcode ist 
    <Link href='https://github.com/studierlangsam/webseite'>
        online
    </Link> 
    verfügbar.
</p>
<p>
    Das Studierlangsam-Logo und -Banner wurde von <Link href='http://www.artbuexxe.de/'> Artbüxxe</Link> gestaltet und ist urheberrechtlich geschützt.
</p>

<style lang="scss">
@import "$style/base";

@import '$style/responsive';

p {
	position: relative;
}

.cc-logo {
	position: absolute;
	right: 100%;

	padding-top: .3em;
	padding-right: 1em;

	@include from-width(55rem) {
		display: block;

		position: relative;
		right: auto;

		margin: 0;

		padding: 0;

		text-align: center;
	}
}

</style>