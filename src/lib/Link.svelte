<script lang="ts">
    import SvgIcon from "@jamescoyle/svelte-icon";   
    import {mdiMap} from "@mdi/js" 

    export let href: string;
    export let type: "mail"|"a"|"map" = "a";
    const isExtern = href.trim().match(/https:\/\//);
</script>
{#if type === "map"}
<span class="map">
    <slot/>
    <a {href} target="_blank">
        <SvgIcon type="mdi" path={mdiMap}/>
    </a>
</span>
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

.map {
    display: inline-flex;
    gap: 0.5rem;
    a {
        display: inline-flex;
        align-items: center;
        width: fit-content;
    }
}

a {
    text-decoration: none;
	transition: color .3s;

	&:hover {
		color: colors.$highlight;
	}

	// disable outline on click
	&:active,
	&:focus {
		outline: 0;

		border: none;
	}
}

</style>