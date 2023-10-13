import { loadWochenplan } from "../lib/Wochenplan/Wochenplan";
import { loadFAQ } from "../lib/faq/faq";
import { loadTutors } from "../lib/tutors/tutors";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {
        wochenplan: await loadWochenplan(),
        tutors: await loadTutors(),
        faq: await loadFAQ()
    }
}