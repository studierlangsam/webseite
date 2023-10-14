<script lang="ts">
    import { inview } from 'svelte-inview';
	import { visibleSectionHash } from './stores';
    export let address: string;
</script>
<div
    use:inview
    on:inview_enter={() => {
        visibleSectionHash.set(address)
    }}
>
    <div class="section">
        <h1 id={address}>
            <slot name="title">{address}</slot>
        </h1>
    </div>
    <slot />
</div>

<style lang="scss">
@use "$style/sizes";
.section {
    display: flex;
    align-items: center;
    margin-top: 2em;

    h1 {
        padding-top: calc(sizes.$navigation-total-height - sizes.$navigation-top-pad);
        margin-top: calc(sizes.$navigation-top-pad - sizes.$navigation-total-height);
    }
}
</style>