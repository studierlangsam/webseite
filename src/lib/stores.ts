import { writable } from "svelte/store";

export let visibleSectionHash = writable("");
export const language = writable({ german: false });