<script lang="ts">
    import type { Tutor } from "./tutors";
    export let tutor: Tutor;

    const src = `/images/tutoren/${tutor.Name}.jpg`;
    const Semester = (Studium: Tutor['Karriere'][number]) => {
        const years = new Date().getFullYear() - Studium.Jahr;
        const realSemesters = 2 * years - (new Date().getMonth() < 10 ? 1 : 0);
        return realSemesters - (Studium.Sommersemester ? 1 : 0) - (Studium.Urlaubssemester ?? 0) + 1;
    }
</script>

<div class="tutor">
    <img {src} alt="" />
    <div>
        <h3>{tutor.Name}</h3>
        <p>{tutor.Spruch}</p>
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