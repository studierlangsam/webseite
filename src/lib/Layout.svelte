<script lang="ts">
    export let full = false;
</script>

<div class:full>
    <slot />
</div>

<style lang="scss">
    @use "$style/sizes";
    
    div {
        width: sizes.$max-content-width;
        margin: auto;
    }

    .full {
        width: 100vw;
    }
</style>