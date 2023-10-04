<script lang="ts">
    export let address: string;
</script>
<h1 id={address}>
    <slot>{address}</slot>
</h1>

<style lang="scss">
    h1 {
        margin-top: 2em;
    }
</style>