<script lang="ts">
    export let address: string;
</script>
<div>
    <h1 id={address}>
        <slot>{address}</slot>
    </h1>
    <span>
        <slot name="append" />
    </span>
</div>

<style lang="scss">
div {
    display: flex;
    align-items: center;
    margin-top: 2em;
}
</style>