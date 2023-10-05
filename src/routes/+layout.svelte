<script lang="ts">
    import "../app.postcss";
    import "../app.postcss";
    import { page } from "$app/stores";
    const tags = $page.data.tags ? "," + $page.data.tags : "";
    import logo from "$root/src/svg/logo.svg?raw";
    import banner from "$root/src/svg/banner.svg?raw";
</script>

<svelte:head>
    <title>{$page.data.title ?? ' - '} Studier Langsam</title>
    <meta name="keywords" content="Studier Langsam,KIT,O-Phase,Studenten,Ersti{tags},Semesterbeginn,Karlsruhe,Karlsruher Institut für Technologie">
    <link rel="preload" href="https://fonts.gstatic.com/s/coda/v11/HfZzsBW2eqpsWXkIkeLL_Q.woff2" as="font" crossorigin="anonymous">
    <script type="text/javascript" src="/heading-style-fix.js"></script>
</svelte:head>

<div class="content">
    <div class="banner">
        <span>{@html banner}</span>
    </div>
    <nav>
        <a href="/" class="home">{@html logo}</a>
        <a class:here={$page.url.hash === "#tutor:innen"} href="/#Tutor:innen">Tutor:innen</a>
        <a class:here={$page.url.hash === "#faq"} href="/#FAQ">Infos</a>
        <a class:here={$page.url.hash === "#wochenplan"} href="/#Wochenplan">Wochenplan</a>
    </nav>
    <main>
        <slot></slot>
    </main>
    <footer>
        <a href="/impressum">Impressum</a>
        <a href="mailto:tutoren@studierlangsam.de">tutoren@studierlangsam.de</a>
    </footer>
</div>

<style lang="scss">
@use 'sass:color';
@use "$style/sizes";
@import "$style/page";
@import '$style/base';

.banner {
	position: relative;

	margin-top: 2em;

	width: 100%;
	height: 30%;

	span {
		display: block;

		margin: 0 auto;
        width: clamp(200px,50%,1000px)
    }

	&::before {
		display: block;

		position: absolute;
		bottom: 0;

		z-index: -10;

		background: $dark;

		width: 100%;
		height: 39.87%;

		content: '';
	}
}

.here {
    background-color: $light;

    color: $dark;
}

nav {
    position: sticky;
    top: 0;
	background-color: $dark;

	width: 100%;
    z-index: 100;
    
    border-bottom: .4em solid $light;

    padding-top: $navigation-top-pad;
    padding-bottom: $navigation-bottom-pad;

    height: $navigation-height;

	text-align: center;

	a {
		display: inline-block;

		margin-bottom: .1em;
		margin-left: .4em;
		margin-right: .4em;

		padding-top: .2em;
		padding-bottom: 0;
		padding-left: .3em;
		padding-right: .3em;

		text-transform: uppercase;
		text-decoration: none;
		line-height: 1em;

		color: $light;

		@include impact;

		&:hover {
			color: $highlight;
		}
	}
}

.home {
    transform: none;
    transition: fill .3s;

    margin-top: 0;
    margin-bottom: -.5em;
    margin-left: -.7 * ($navigation-height - $navigation-top-pad - $navigation-bottom-pad) + .5rem;

    padding-top: .2em;
    padding-bottom: .5em;

    height: $navigation-height - $navigation-top-pad - $navigation-bottom-pad !important;
    width: calc(0.75 * ($navigation-height - $navigation-top-pad - $navigation-bottom-pad));

    fill: $light;

    stroke: $light;
    stroke-width: 10;

    &:hover {
        fill: $highlight;
        stroke: $highlight;
    }

    svg {
        height: 100%;
    }
}

footer {
	width: 100%;
	height: $footer-height;

	text-align: center;

	color: color.adjust($light, $lightness: -30%);
	font-size: .8rem;

	a {
		margin: 0 .5em;

		color: inherit;
	}
}
</style>