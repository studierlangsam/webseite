import { writable } from "svelte/store";

export let visibleSectionHash = writable("");
const isGerman =
    typeof navigator !== "undefined" &&
    (
        (navigator.languages && navigator.languages.some(l => l.startsWith("de"))) ||
        (navigator.language && navigator.language.startsWith("de"))
    );

export const language = writable({ german: !!isGerman });