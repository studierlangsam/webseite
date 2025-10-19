<script>
	import Tutors from '$lib/tutors/Tutors.svelte';
	import Section from '../lib/Section.svelte';
	import Wochenplan from '../lib/Wochenplan/Wochenplan.svelte';
	import Faq from '../lib/faq/FAQ.svelte';
	import { language } from '../lib/stores';

	export let data;
</script>

<!-- <Section address=""> -->
{#if $language.german}
	<h1>Hallo du!</h1>
	<p>Willkommen bei Studier Langsam!</p>
	<p>
		Bei uns erwartet dich eine abwechslungsreiche O-Phase mit Spiele- sowie Cocktailabend,
		gemeinsamem Essen und weiteren spannenden Aktivitäten in Karlsruhe und um den Campus. Dabei
		lernst du deine zukünftigen Mitstudierenden kennen und kannst hier neue Freund:innen finden.
		Auch nach der O-Phase treffen wir uns regelmäßig zu Spieleabenden, an denen abgesehen von Spielen
		auch Gespräche, Diskussionen und schlechte Wortwitze nicht zu kurz kommen.
		Aber vor allem: Komm zu uns, denn wir haben Kekse! 🍪
	</p>
	<p>Auf dieser Seite findest du Informationen über uns, die O-Phase und das Studium am KIT.</p>
{:else}
	<h1>Hello there!</h1>
	<p>Welcome to Studier Langsam (Study Slowly)!</p>
	<p>
		With us, you can expect a varied O-Phase (introduction week) with a games night, a cocktail night,
		eating out together and other exciting activities on the university campus and around Karlsruhe.
		You'll get to know your fellow students and make friends. After the O-Phase, we have weekly games nights
		which we complement with conversations, discussions and bad word play.
		But above all: We have cookies! 🍪
	</p>
	<p>On this page, you'll find important information about us, the O-Phase and studying at KIT.</p>
{/if}
<!-- </Section> -->
<Wochenplan wochenplan={data.wochenplan} />
<Tutors tutors={data.tutors} />
<Faq faq={data.faq} />

<style lang="scss">
	@use '$style/base';
</style>
