<script lang="ts">
    import { DateTime } from "luxon";
    import type { Wochenplan } from "./Wochenplan";
	import Link from "../Link.svelte";
	import Section from "../Section.svelte";
    import schildi from "$root/src/svg/schildi.svg";
	import { language } from '../stores';

    import { RadioGroup, RadioItem, SlideToggle } from '@skeletonlabs/skeleton';
    
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
    let selectedDay: number = 0;
</script>

<Section address={$language.german ? "Wochenplan" : "Schedule"}>
<div class="day-selector">
    <RadioGroup rounded="rounded-container-token" display="flex-col">
    {#each Wochenplan as Termin, index}
            <RadioItem bind:group={selectedDay} value={index} name="jusitfy">{DateTime.fromObject(Termin.Datum, {locale: "de-DE"}).weekdayLong}</RadioItem>
    {/each}
    </RadioGroup>
</div>

<div class="wochenplan-window" style="
    --cols: {Wochenplan.length};
    --slots: {slots};
    --wp-height: 75em;
">
    <div class="wochenplan">
        <div class="daytime">
            <div class="heading maps-toggle">
                <img class="maps" src="https://wiki.openstreetmap.org/w/images/7/79/Public-images-osm_logo.svg" alt="OpenStreetMap" />
                <SlideToggle slot="append" name="slider-label" bind:checked={gmaps} aria-description="Toggle links between OpenStreetMap or Google Maps"/>
                <img class="maps" src="https://lh3.googleusercontent.com/V0Lu6YzAVaCVcjSJ_4Qb0mR_idw-GApETGbkodvDKTH-rpDvHuD6J84jshR_FvXdl5mJxqbIHVdebYCCbQMJNxIxRaIHYFSq6z7laA" alt="Google Maps">
            </div>
            <div class="time">
                <div style="
                    grid-row: {startSlot.morning} / {endSlot.morning};
                ">
                    <p class="time-title">{$language.german ? 'Morgens' : 'Morning'}</p>
                    {#if $language.german}
                        <p>{hours.morning} &ndash; {hours.noon} Uhr</p>
                    {:else}
                        <p>9 am to 12 pm</p>
                    {/if}
                </div>
                <div style="
                    grid-row: {startSlot.noon} / {endSlot.noon};
                ">
                    <p class="time-title">{$language.german ? 'Mittags' : 'Afternoon'}</p>
                    {#if $language.german}
                        <p>{hours.noon} &ndash; {hours.evening} Uhr</p>
                    {:else}
                        <p>12 pm to 6 pm</p>
                    {/if}
                </div>
                <div style="
                    grid-row: {startSlot.evening} / {endSlot.evening};
                ">
                    <p class="time-title">{$language.german ? 'Abends' : 'Evening'}</p>
                    {#if $language.german}
                        <p>Ab {hours.evening} Uhr</p>
                    {:else}
                        <p>From 6 pm</p>
                    {/if}
                </div>
            </div>
        </div>
        {#each Wochenplan as Termin, index}
        <div class="day" class:activeDay={selectedDay === null || selectedDay === index}>
            <div class="heading">
                {#if $language.german}
                <h3>{DateTime.fromObject(Termin.Datum, {locale: "de-DE"}).weekdayLong}</h3>
                {:else}
                <h3>{DateTime.fromObject(Termin.Datum, {locale: "en-US"}).weekdayLong}</h3>
                {/if}
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
                    {#if event.Effekt.Boulderschildi}
                        <img class="boulder-schildi" src="{schildi}" alt="Schildi" />
                    {/if}
                    {#if !!event.Effekt.Icon}
                        <i class="fa-solid fa-{event.Effekt.Icon}" class:shifted={!!event.Beschreibung}></i>
                    {/if}
                    <h4>{@html $language.german || !event.TitelEnglisch ? event.Titel:event.TitelEnglisch}</h4>
                    <div class="timings">
                        <span class="begin">{startDT.toLocaleString(DateTime.TIME_SIMPLE)}</span>
                        &ndash;
                        {#if !!endDT}
                            <span class="end">{endDT.toLocaleString(DateTime.TIME_SIMPLE)}</span>
                        {:else}
                            <span class="end">{$language.german ? "Offenes Ende" : "open end"}</span>
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
                                    {Pre}<Link href={google ?? osm} type="map" --color-high="var(--event-color-high)">{Text}</Link>{Post}
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
                        <p>{@html $language.german || !event.BeschreibungEnglisch ? event.Beschreibung:event.BeschreibungEnglisch}</p>
                    {/if}
                </div>
                {/each}
            </div>
        </div>
        {/each}
    </div>
</div>
</Section>

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

.day-selector {
    display: none;
    @include responsive.from-width(responsive.$mobile) {
        display: block;
    }
    margin-bottom: 1em;
}

.activeDay {
    display: flex !important;
}

.maps {
    max-width: calc(0.5 * $col-width);
    margin: auto;
}

.maps-toggle {
    justify-content: center;
    display: flex;

    .maps {
        max-width: 4em;
        max-height: 2em;
    }
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
    width: $width;
    @include responsive.from-width(responsive.$mobile) {
        width: 100%;
        margin-left: 0
    }
    margin-left: calc(-1/2 * ($width - sizes.$content-width));
    overflow-x: scroll;
    height: calc($height + $col-pad + $header-height);
    @include round;
}

.wochenplan {
    display: flex;
    width: fit-content !important;
    @include responsive.from-width(responsive.$mobile) {
        width: 100% !important;
    }
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

        h3 {
            padding-top: 0.5rem !important;
        }
    }

    .daytime {
        @include responsive.from-width(responsive.$mobile) {
            width: 10em;
        }
    }

    .day, .daytime {
        display: flex;
        flex-direction: column;
        width: $col-width;
    }

    .day {
        @include responsive.from-width(responsive.$mobile) {
            display: none;
            width: inherit;
        }
    }

    .time .time-title {
        font-weight: 800;
        font-size: large;
        margin-left: 0.5em;
    }

    .time, .events {
        height: 100%;
        display: grid;
        grid-template-rows: repeat($slots,$slot-height);
        color: black !important;
        @include border;
    }

    .events {
        padding: $col-pad;
        padding-bottom: 0;
        width: $col-width;
        @include responsive.from-width(responsive.$mobile) {
            width: 100%;
        }

        .event:not(.empty) {
            --event-color: #a7d65c;
            --event-color-high: #689325;
            position: relative;
            border-radius: 0.5em;
            background-color: var(--event-color);
            padding: $col-pad;
            margin-bottom: $col-pad;
            width: calc($col-width - 2 * $col-pad);
            @include responsive.from-width(responsive.$mobile) {
                width: 100%;
            }
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
            
            .location li {
                white-space: normal;
            }

            i {
                position: absolute;
                font-size: 3rem;
                top: 5rem;
                right: 1rem;
                color: hsla(83, 90%, 28%);

                &.shifted {
                    translate: 0 2rem;
                }
            }
        }
    }
}

.schildi {
    $pad: 1em;
    position: absolute;
    width: min(calc(100% - 2 * $pad), 10rem);
    padding: 0 $pad 0;
    translate: 0 -100%;
}
.boulder-schildi {
    position: absolute;
    width: 35%;
    right: $col-pad;
    bottom: 1rem;
    transform: rotate(-90deg);
}

.empty {
    margin: 0 !important;
    padding: 0 !important;
    width: 0 !important;
    z-index: -1;
}
</style>