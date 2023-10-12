<script lang="ts">
    import { DateTime } from "luxon";
    import type { Wochenplan } from "./Wochenplan";
	import Link from "../Link.svelte";
	import Section from "../Section.svelte";
    import schildi from "$root/src/svg/schildi.svg";

    import { SlideToggle } from '@skeletonlabs/skeleton';
    
    export let wochenplan: Wochenplan;
    let gmaps = false;

    const {Wochenplan, Orte, Config} = wochenplan;
    const hours = {start: Config.Start, end: Config.Ende, morning: Config.Start, noon: 12, evening: 18};
    const timeToSlot = (hour: number, minute: number) => (hour - hours.start) * Config.SPH + Math.round((minute * Config.SPH) / 60) + 1;
    const startSlot = {morning: timeToSlot(hours.morning, 0), noon: timeToSlot(hours.noon, 0), evening: timeToSlot(hours.evening, 0)};
    const endSlot = {morning: startSlot.noon, noon: startSlot.evening, evening: timeToSlot(hours.evening, 0)};
    const slots = (hours.end - hours.start) * Config.SPH;
    const getStartSlot = (time: DateTime) => {
        if (time.hour < hours.start) {
            return hours.start * Config.SPH;
        }
        return timeToSlot(time.hour, time.minute)
    }
    const getEndSlot = (time?: DateTime) => {
        if (!time || time.hour >= hours.end) {
            return (hours.end - hours.start) * Config.SPH + 1;
        }
        return timeToSlot(time.hour, time.minute);
    }
</script>

<Section address="Wochenplan">
    <SlideToggle slot="append" name="slider-label" bind:checked={gmaps}>
        <img class="gmaps" src="https://upload.wikimedia.org/wikipedia/commons/d/dc/Google_Maps_Logo.svg" alt="Google Maps">
    </SlideToggle>
</Section>
<div class="wochenplan-window" style="
    --cols: {Wochenplan.length};
    --slots: {slots};
    --wp-height: 90rem;
">
    <div class="wochenplan">
        <div class="daytime">
            <div class="heading" />
            <div class="time">
                <div style="
                    grid-row: {startSlot.morning} / {endSlot.morning};
                ">
                    <h4>Morgens</h4>
                    <p>{hours.morning} - {hours.noon} Uhr</p>
                </div>
                <div style="
                    grid-row: {startSlot.noon} / {endSlot.noon};
                ">
                    <h4>Mittags</h4>
                    <p>{hours.noon} - {hours.evening} Uhr</p>
                </div>
                <div style="
                    grid-row: {startSlot.evening} / {endSlot.evening};
                ">
                    <h4>Abends</h4>
                    <p>Ab {hours.evening} Uhr</p>
                </div>
            </div>
        </div>
        {#each Wochenplan as Termin}
        <div class="day">
            <div class="heading">
                <h3>{DateTime.fromObject(Termin.Datum).weekdayLong}</h3>
            </div>
            <div class="events">
                {#each Termin.Termine as event}
                {@const startDT = DateTime.fromObject(event.Start, { locale: "de-DE" })}
                {@const endDT = !!event.Ende ? DateTime.fromObject(event.Ende, { locale: "de-DE" }) : undefined}
                {@const start = getStartSlot(startDT)}
                {@const end = getEndSlot(endDT)}
                <div class="event"
                    class:fachschaft="{event.Effekt?.Fachschaft ?? false}"
                    class:highlight="{event.Effekt?.Highlight ?? false}"
                    class:open-end={!event.Ende}
                    style="
                        grid-row: {start} / {end};
                    "
                    >
                    {#if event.Effekt.Schildi}
                        <img class="schildi" src="{schildi}" alt="Schildi" />
                    {/if}
                    <h4>{@html event.Titel}</h4>
                    <div class="timings">
                        <span class="begin">{startDT.toLocaleString(DateTime.TIME_SIMPLE)}</span>
                        -
                        {#if !!endDT}
                            <span class="end">{endDT.toLocaleString(DateTime.TIME_SIMPLE)}</span>
                        {:else}
                            <span class="end">Offendes Ende</span>
                        {/if}
                    </div>
                    {#if !!event.Treffpunkt} 
                    <span class="location">
                        <ul>
                            {#each event.Treffpunkt as {Pre, Post, Ort, Link: Text}}
                            {@const google = Orte[Ort]?.Google}
                            {@const osm = Orte[Ort]?.OSM}
                            <li>
                            {#if !!osm || !!google}
                                {#if !gmaps}
                                    {Pre}<Link href={osm ?? google} type="map" --color-high="var(--event-color-high)">{Text}</Link>{Post}
                                {:else}
                                    {Pre}<Link href={google ?? google} type="map" --color-high="var(--event-color-high)">{Text}</Link>{Post}
                                {/if}
                            {:else}
                                {event.Treffpunkt}
                            {/if}
                            </li>
                            {/each}
                        </ul>
                    </span>
                    {/if}
                    {#if !!event.Beschreibung}
                        <p>{event.Beschreibung}</p>
                    {/if}
                </div>
                {/each}
                {#each [...Array(slots + 1).keys()] as time}
                <div class="wp-{time}-{time} empty"></div>
                {/each}
            </div>
        </div>
        {/each}
    </div>
</div>

<style lang="scss">
@use "$style/sizes";
@use "$style/responsive";
@use "sass:color";
$slots: var(--slots);
$col-width: clamp(200px, 20em, calc(sizes.$content-width / (var(--cols) + 1)));
$outline-width: 1px;
$height: var(--wp-height);
$slot-height: min(calc($height / ($slots + 1)), calc($height / $slots));
$header-height: max(4em, $slot-height);
$col-pad: 0.5em;

@mixin round {
    border-radius: 0.5em;
}
@mixin border {
    outline: $outline-width solid black;
}

.gmaps {
    width: 10em;
}

.fachschaft {
    --event-color: #99b8e6 !important;
    --event-color-high: #1e447b !important;
}

.highlight {
    --event-color: #f5b53d !important;
    --event-color-high: #af7509 !important;
}

.open-end::after {
    display: block;
    height: 4 * $col-pad;
    width: 100%;
    margin: -$col-pad;
    background: linear-gradient(var(--event-color), rgba(var(--color-surface-50) / 1));
    content: "";
    position: absolute;
    bottom: - 2 * $col-pad;
    z-index: 1;
}

.wochenplan-window {
    $width: calc(clamp(sizes.$content-width, 80vw, calc((var(--cols) + 1) * $col-width + 2 * $outline-width))); 
    margin-left: calc(-1/2 * ($width - sizes.$content-width));
    width: $width;
    overflow-x: scroll;
    height: calc($height + $col-pad + $header-height);
    @include round;
}

.wochenplan {
    display: flex;
    width: fit-content !important;
    border: 1px solid black;
    @include round;

    h3, h4 {
        font-size: larger;
        font-weight: 800;
        margin: 0;
        padding: 0.25em 0.5em 0em;
    }

    .heading {
        text-align: center;
        display: flex;
        align-items: center;
        height: $header-height;
        @include border;
    }

    .day, .daytime {
        display: flex;
        flex-direction: column;
        width: $col-width;
    }

    .time, .events {
        height: 100%;
        display: grid;
        grid-template-rows: repeat($slots,$slot-height);
        @include border;
    }

    .events {
        padding: $col-pad;
        padding-bottom: 0;
        width: $col-width;

        .event:not(.empty) {
            --event-color: #a7d65c;
            --event-color-high: #689325;
            position: relative;
            border-radius: 0.5em;
            background-color: var(--event-color);
            padding: $col-pad;
            margin-bottom: $col-pad;
            width: calc($col-width - 2 * $col-pad);
            z-index: 2;
            box-shadow: 1px 1px 4px black;

            *:not(h4) {
                line-height: normal;
            }

            h4 {
                line-break: normal;
                word-wrap: break-word;
                padding: 0;
            }

            p {
                margin: $col-pad 0 0;
                font-style: italic;
                position: relative;
            }
        }
    }
}

.schildi {
    $pad: 1em;
    position: absolute;
    width: calc(100% - 2 * $pad);
    padding: 0 $pad 0;
    translate: 0 -100%;
}

.empty {
    margin: 0 !important;
    padding: 0 !important;
    width: 0 !important;
    z-index: -1;
}
</style>