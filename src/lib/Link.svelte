<script lang="ts">
    import SvgIcon from "@jamescoyle/svelte-icon";
    import {mdiOpenInNew} from "@mdi/js";

    export let href: string;
    export let type: "mail"|"a"|"map" = "a";
    const isExtern = href.trim().match(/https:\/\//);
</script>
{#if type === "map"}
<a href="{href}" target="_blank" class="map">
    <slot />
    <div class="icon">
        <SvgIcon type="mdi" path={mdiOpenInNew}/>
    </div>
</a>
{:else if type === "mail"}
<a href="mailto:{href}">
    <slot />
</a>
{:else}
<a href="{href}" target={isExtern ? "_blank" : "_self"} class:here={isExtern}>
    <slot />
</a>
{/if}

<style lang="scss">
@use "$style/colors";
@use "sass:color";

.map {
    display: inline-flex;
}

a {
    text-decoration: none;
	transition: text-shadow .3s;
    color: color.adjust(colors.$lowlight, $lightness: -40%);

	&:hover {
        text-shadow: 0em 0em 3px var(--color-high);
	}

	// disable outline on click
	&:active,
	&:focus {
		outline: 0;

		border: none;
	}
}

</style>