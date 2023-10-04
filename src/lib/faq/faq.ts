export type FAQ = {
    Allgemein: {
        Frage: string,
        Antwort: string
    }[],
    Wichtig: {
        Frage: string,
        Antwort: string
    }[]
}
export const loadFAQ: () => Promise<FAQ> = async () => {
    const files = await import.meta.glob("./faq.yaml");
    const filePromises: Promise<{ default: FAQ}>[] = [];
    for (const path in files) {
        filePromises.push(files[path]() as Promise<{ default: FAQ}>)
    }
    return await filePromises[0].then(t => t.default);
}