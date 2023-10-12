import { loadWochenplan } from "../lib/Wochenplan/Wochenplan";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {
        wochenplan: await loadWochenplan()
    }
}