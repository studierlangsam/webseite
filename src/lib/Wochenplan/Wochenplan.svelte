<script lang="ts">
    import { DateTime } from "luxon";
    import { loadWochenplan } from "./Wochenplan";
	import Link from "../Link.svelte";
	import Section from "../Section.svelte";

    type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
        ? Acc[number]
        : Enumerate<N, [...Acc, Acc['length']]>

    type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

    type Hour = IntRange<0,25>;
    const startHour: Hour = 8;
    const endHour: Hour = 24;

    const morningHour: Hour = startHour;
    const noonHour: Hour = 12;
    const eveningHour: Hour = 18;

    const slotsPerHour = 2;
    const slots = (endHour - startHour) * slotsPerHour;
    const timeToSlot = (hour: number, minute: number) => (hour - startHour) * slotsPerHour + Math.round((minute * slotsPerHour) / 60) + 1
    const startSlot = (time: DateTime) => {
        if (time.hour < startHour) {
            return startHour * slotsPerHour;
        }
        return timeToSlot(time.hour, time.minute)
    }
    const endSlot = (time?: DateTime) => {
        if (!time || time.hour >= endHour) {
            return (endHour - startHour) * slotsPerHour + 1;
        }
        return timeToSlot(time.hour, time.minute) + 1;
    }

    const startMorningSlot = timeToSlot(morningHour, 0);
    const startNoonSlot = timeToSlot(noonHour, 0);
    const startEveneningSlot = timeToSlot(eveningHour, 0);
    
    const endMorningSlot = startNoonSlot;
    const endNoonSlot = startEveneningSlot;
    const endEveningSlot = timeToSlot(endHour, 0);
</script>

<Section address="Wochenplan" />
{#await loadWochenplan() then {Wochenplan, Orte}}
<div class="wochenplan" style="--cols: {Wochenplan.length}">
    <div class="time">
        <div class="wp-1-1 heading" />
        <div class="wp-{startMorningSlot + 1}-{endMorningSlot + 1}">
            <h4>Morgens</h4>
            <p>{morningHour} - {noonHour} Uhr</p>
        </div>
        <div class="wp-{startNoonSlot + 1}-{endNoonSlot + 1}">
            <h4>Mittags</h4>
            <p>{noonHour} - {eveningHour} Uhr</p>
        </div>
        <div class="wp-{startEveneningSlot + 1}-{endEveningSlot}">
            <h4>Abends</h4>
            <p>Ab {eveningHour} Uhr</p>
        </div>
    </div>
    {#each Wochenplan as Termin}
        <div class="day">
            <div class="wp-1-1 heading">
                <h3>{Termin.Datum.weekdayLong}</h3>
            </div>
            {#each Termin.Termine as event}
            {@const start = startSlot(event.Start) + 1}
            {@const end = endSlot(event.Ende)}
            <div class="event wp-{start}-{end}"
                class:fachschaft="{event.Effekt?.Fachschaft ?? false}"
                >
                {#if event.Effekt.Schildi}
                    <img class="schildi" src="/images/schildi.svg" alt="Schildi" />
                {/if}
                <h4>{@html event.Titel}</h4>
                <div class="timings">
                    <span class="begin">{event.Start.toLocaleString(DateTime.TIME_SIMPLE)}</span>
                    -
                    {#if !!event.Ende}
                        <span class="end">{event.Ende.toLocaleString(DateTime.TIME_SIMPLE)}</span>
                    {:else}
                        <span class="end">Offendes Ende</span>
                    {/if}
                </div>
                {#if !!event.Treffpunkt} 
                {@const google = Orte[event.Treffpunkt]?.Google}
                {@const osm = Orte[event.Treffpunkt]?.OSM}
                <span class="location">
                    Ort:
                    {#if !!osm}
                        <Link href={osm} type="map">{event.Treffpunkt}</Link>
                    {:else if !!google}
                        <Link href={google} type="map">{event.Treffpunkt}</Link>
                    {:else}
                        {event.Treffpunkt}
                    {/if}
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
    {/each}
</div>
{/await}

<style lang="scss">
@use "$style/sizes";
$start-hour: 8;
$end-hour: 24;
$slots-per-hour: 2; 
$slots: ($end-hour - $start-hour) * $slots-per-hour;
$col-width-min: 200px;
$slot-height: calc(90rem / $slots);
$col-pad: 0.5em;

@mixin border {
    border-color: black;
    border-style: solid;
    border-width: 1px;
}

.slot {
	z-index: -1;
}

@for $s from 0 to $slots + 1 {
    @for $e from $s through $slots + 1 {
        .wp-#{$s}-#{$e} {
            grid-row-start: $s;
            grid-row-end: $e;
        }
    }
}

.fachschaft {
	background-color: #99b8e6 !important;
}

.wochenplan {
    display: grid;
    grid-auto-flow: column;
    overflow-x: scroll;
    width: 100%;
    $col-width: calc(sizes.$max-content-width / (var(--cols) + 1));
    border-radius: 0.5em;

    .heading {
        text-align: center;
        display: flex;
        align-items: center;
        z-index: 100;
        height: $slot-height;
        @include border;
    }

    h3, h4 {
        font-size: larger;
        font-weight: 800;
        margin: 0;
        padding: 0.25em 0.5em 0em;
    }

	.time, .day {
		width: $col-width;
		max-width: $col-width;
		display: grid;
		grid-template-rows: repeat($slots,$slot-height);
        @include border;
	}

    .time {
        div:not(:last-child) {
            @include border;
        }
        .heading {
            border-top-left-radius: 0.5em;
        }
        :last-child {
            border-bottom-left-radius: 0.5em;
        }
    }

    .day {
        margin: 0;
        padding: 0.5em;

        &:last-child {
            .heading {
                border-top-right-radius: 0.5em;
            }
            :last-child {
                border-bottom-right-radius: 0.5em;
            }
        }

        .heading {
            margin-top: -$col-pad;
            margin-left: -$col-pad;
            margin-right: -$col-pad;
            width: calc(100% + 2 * $col-pad);
        }

        .event:not(.empty) {
            position: relative;
            border-radius: 0.5em;
            background-color: #a7d65c;
            margin-bottom: $col-pad;
            width: calc(100% - 2 * $col-pad);
            padding: $col-pad;

            h4 {
                line-break: normal;
                word-wrap: break-word;
                padding: 0;
            }

            p {
                margin: $col-pad 0 0;
                font-style: italic;
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