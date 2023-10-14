<script lang="ts">
    import { inview } from 'svelte-inview';
	import { visibleSectionHash } from './stores';
    export let address: string;
</script>
    <div class="section"
    use:inview
    on:inview_enter={() => {
        visibleSectionHash.set(address)
    }}>
        <h1 id={address}>
            <slot name="title">{address}</slot>
        </h1>
    </div>
    <slot />

<style lang="scss">
.section {
    display: flex;
    align-items: center;
    margin-top: 2em;
}
</style>