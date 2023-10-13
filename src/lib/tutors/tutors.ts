export type Tutor = {
    Name: string,
    Spruch: string,
    Karriere: {
        Studiengang: string,
        Jahr: number,
        Urlaubssemester: number,
        Sommersemester: boolean
    }[]
}

export const loadTutors: () => Promise<Tutor[]> = async () => {
    const files = await import.meta.glob(["./tutors/*.yaml", "!**/_*.yaml"]);
    console.log(files);
    const tutorPromises: Promise<{ default: Tutor}>[] = [];
    for (const path in files) {
        tutorPromises.push(files[path]() as Promise<{ default: Tutor}>)
    }
    Promise.all<Promise<{ default: Tutor}>>(tutorPromises).then(v => {
        console.log(v[0].default)
    })

    return await Promise.all<Promise<{ default: Tutor}>>(tutorPromises)
        .then(tutors => tutors.map(t => t.default));
}