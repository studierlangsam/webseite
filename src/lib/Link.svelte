<script lang="ts">
    import {mdiOpenInNew} from "@mdi/js";

    export let href: string;
    export let type: "mail"|"a"|"map" = "a";
    const isExtern = href.trim().match(/https:\/\//);
</script>
{#if type === "map"}
<a href="{href}" target="_blank" class="map" {...$$props}>
    <slot />
    <div class="icon">
        <svg height="24" width="24" viewBox="0 0 24 24" style="--sx: 1; --sy: 1; --r: 0deg">
            <path d={mdiOpenInNew}></path>
        </svg>
    </div>
</a>
{:else if type === "mail"}
<a href="mailto:{href}" {...$$props}>
    <slot />
</a>
{:else}
<a href="{href}" target={isExtern ? "_blank" : "_self"} class:here={isExtern} {...$$props}>
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
	transition: fill .3s;
    // color: color.adjust(colors.$lowlight, $lightness: -40%);
    // fill: color.adjust(colors.$lowlight, $lightness: -40%);

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