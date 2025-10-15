<script lang="ts">
	import '../app.postcss';
	import { page } from '$app/stores';
	const tags = $page.data.tags ? ',' + $page.data.tags : '';
	import logo from '$root/src/svg/logo.svg?raw';
	import banner from '$root/src/svg/banner.svg?raw';
	import { visibleSectionHash, language } from '../lib/stores';

	import {SlideToggle} from '@skeletonlabs/skeleton';
</script>

<svelte:head>
    <title>{$page.data.title ? `${$page.data.title} - `: ""}Studier Langsam</title>
    <meta name="keywords" content="Studier Langsam,KIT,O-Phase,Studenten,Ersti{tags},Semesterbeginn,Karlsruhe,Karlsruher Institut für Technologie">
    <link rel="preload" href="https://fonts.gstatic.com/s/coda/v11/HfZzsBW2eqpsWXkIkeLL_Q.woff2" as="font" crossorigin="anonymous">
</svelte:head>

<div class="content">
	<div class="banner">
		<span>{@html banner}</span>
	</div>
	<nav>
		<!-- <a class:here={$visibleSectionHash === ""} href="/" class="home">{@html logo}</a> -->
        {#if $language.german}
		<a  class:here={$visibleSectionHash === 'Wochenplan'} href="/#Wochenplan">Wochenplan</a>
		<a class:here={$visibleSectionHash === 'Tutor:innen'} href="/#Tutor:innen">Tutor:innen</a>
		<a class:here={$visibleSectionHash === 'FAQ'} href="/#FAQ">FAQ</a>
		<a style="position:absolute;right:0pt" on:click={() => $language.german = false}>English</a>
        {:else}
		<a class:here={$visibleSectionHash === 'Wochenplan'} href="/#Wochenplan">Schedule</a>
		<a class:here={$visibleSectionHash === 'Tutor:innen'} href="/#Tutor:innen">Tutors</a>
		<a class:here={$visibleSectionHash === 'FAQ'} href="/#FAQ">FAQ</a>
		<a style="position:absolute;right:0pt" on:click={()=> $language.german = true}>Deutsch</a>
        {/if}
	</nav>
	<main>
		<slot />
	</main>
	<footer>
		<a href="/impressum">Impressum</a>
		<a href="mailto:tutoren@studierlangsam.de">tutoren@studierlangsam.de</a>
	</footer>
</div>

<style lang="scss">
	@use 'sass:color';
	@use '$style/sizes';
	@use '$style/responsive';
	@import '$style/base';

	.banner {
		position: relative;

		padding-top: 16px;
		background-color: rgb(var(--color-surface-400));
		z-index: -1;

		width: 100%;
		height: 30%;

		span {
			display: block;

			margin: 0 auto;
			width: 500px;

			@include responsive.from-width(responsive.$mobile) {
				width: min(100vw, 360px);
			}
		}

		&::before {
			display: block;

			position: absolute;
			bottom: 0;

			z-index: -10;

			background: rgb(var(--color-primary-900));

			width: 100%;
			height: calc(32.87% - 16px);

			content: '';
		}
	}

	.here {
		background-color: rgb(var(--color-surface-50)) !important;

		color: rgb(var(--color-primary-900)) !important;

		:global(svg) {
			fill: rgb(var(--color-primary-900)) !important;
			stroke: rgb(var(--color-primary-900)) !important;
		}
	}

	nav {
		display: flex;
		align-items: flex-end;
		justify-content: center;

		position: sticky;
		top: 0;
		background-color: rgb(var(--color-primary-900));

		width: 100%;
		z-index: 100;

		padding-top: sizes.$navigation-top-pad;
		padding-bottom: sizes.$navigation-bottom-pad;

		height: calc(sizes.$navigation-height - 0.4em);
		// border-bottom: .4em solid rgb(var(--color-surface-50));

		text-align: center;

		a {
			display: inline-block;

			margin-bottom: 0.25em;
			margin-left: 0.4em;
			margin-right: 0.4em;

			padding-top: 0.2em;
			padding-bottom: 0;
			padding-left: 0.3em;
			padding-right: 0.3em;

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
		transition: fill 0.3s;

		margin-top: 0;
		margin-bottom: -0.25em;
		margin-left: -0.7 *
			(sizes.$navigation-height - sizes.$navigation-top-pad - sizes.$navigation-bottom-pad) + 0.5rem;

		// padding-top: .2em;
		// padding-bottom: .5em;

		height: sizes.$navigation-height - sizes.$navigation-top-pad - sizes.$navigation-bottom-pad !important;
		width: calc(
			0.75 * (sizes.$navigation-height - sizes.$navigation-top-pad - sizes.$navigation-bottom-pad)
		);

		fill: rgb(var(--color-surface-50));
		stroke: rgb(var(--color-surface-50));
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
		height: sizes.$footer-height;

		text-align: center;

		color: black;
		font-size: 0.8rem;

		a {
			margin: 0 0.5em;

			color: inherit;
		}
	}

	main {
		padding-top: 1em;
	}
</style>
