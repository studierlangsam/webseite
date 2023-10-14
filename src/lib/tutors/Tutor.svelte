<script lang="ts">
    import type { Tutor } from "./tutors";
    export let tutor: Tutor;
    const src = `/images/tutoren/${tutor.Name}.jpg`;

	const SS_START = 3; // April, zero-based
	const WS_START = 9; // October, zero-based
	const NOW = new Date();
	// Common Era Semester™: WS that starts in year 0 is semester 0
	const nowSemester = NOW.getFullYear() * 2 - (NOW.getMonth() < WS_START ? 1 : 0) - (NOW.getMonth() < SS_START ? 1 : 0);

    const Semester = (Studium: Tutor['Karriere'][number]) => {
		const startSemester = Studium.Jahr * 2 - (Studium.Sommersemester ? 1 : 0);
        return nowSemester - startSemester + 1 - (Studium.Urlaubssemester ?? 0);
    }
</script>

<div class="tutor">
    <img {src} alt="" />
    <div>
        <h3>{tutor.Spitzname}</h3>
		{#if tutor.Spruch}
        	<p>{tutor.Spruch}</p>
		{/if}
        <br>
        {#each tutor.Karriere as Studium}
            <p>
                {Studium.Studiengang}
                <br>
                {Semester(Studium)}. Semester
            </p>
            <br>
        {/each}
    </div>
</div>

<style lang="scss">
@import '$style/responsive';

$layout-change: 36em;

.tutor {
	display: flex;
	align-items: flex-start;

	margin-top: -8%;
	min-height: 15em;

	@include from-width(40em) {
		margin-top: -3%;
	}

	@include from-width($layout-change) {
		margin-top: 2em;
	}


	&:first-of-type {
		margin-top: 3rem;
	}

	img {
		border-radius: .5em;
		box-shadow: 1px 1px 4px black;

		width: 30%;

		@include from-width($layout-change) {
			width: 40%;
		}
	}

	div {
		width: 30%;

		@include from-width($layout-change) {
			width: 55%;
		}
	}

	h3 {
		margin-top: .2em;
		margin-bottom: .5em;
	}

	p {
		margin: 0;
	}

	&:nth-child(odd) {
		flex-direction: row;

		img {
			margin-right: 3%;
		}
	}

	&:nth-child(even) {
		flex-direction: row-reverse;

		text-align: right;

		img {
			margin-left: 3%;
		}
	}
}
</style>