<script>

	import Tutors from "$lib/tutors/Tutors.svelte";
	import Wochenplan from "../lib/Wochenplan/Wochenplan.svelte";
	import Faq from "../lib/faq/FAQ.svelte";

    export let data;
</script>

<h1>Hallo du!</h1>
<p>Willkommen bei Studier Langsam</p>
<p>
    Bei uns erwartet dich eine abwechslungsreiche O-Phase mit Spiele- sowie Cocktailabend, 
    gemeinsamem Essen und weiteren spannenden Aktivitäten in Karlsruhe und um den Campus. 
    Dabei lernst du deine zukünftigen Mitstudierenden kennen und kannst hier neue Freund:innen finden. 
    Auch nach der O-Phase treffen wir uns regelmäßig zu Stammtischen, die wir mit Spielen, Gesprächen, Diskussionen und schlechten Wortwitzen verbringen. 
    Aber vor allem: Komm zu uns, denn wir haben Kekse! 🍪
</p>
<p>
    Auf dieser Seite findest du Informationen über uns, die O-Phase und das Studium am KIT.
</p>
<Wochenplan wochenplan={data.wochenplan}/>
<Tutors tutors={data.tutors}/>
<Faq faq={data.faq}/>

<style lang="scss">
@use '$style/base';
// @use '$style/page';
@use '$style/index';
</style>