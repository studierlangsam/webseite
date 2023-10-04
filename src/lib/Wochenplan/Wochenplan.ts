import { DateTime } from "luxon";

type Effekt = {
    Schildi: boolean;
    Fachschaft: boolean;
};

type Event = {
    Titel: string;
    Beschreibung: string;
    Start: DateTime;
    Ende: DateTime | undefined;
    Treffpunkt: string;
    Effekt: Partial<Effekt>;
};
type ReadEvent = {
    [Key in keyof Event]: Key extends "Start" | "Ende" ? string : Event[Key];
}

type ReadTermin = {
    Datum: Date;
    Termine: ReadEvent[];
}

type Termin = {
    Datum: DateTime;
    Termine: Event[];
};

type Orte = {
    [Name: string]: {
        Google: string;
        OSM: string;
    }
};

type ReadWochenplan = {
    Wochenplan: ReadTermin[];
    Orte: Orte;
}

type Wochenplan = {
    Wochenplan: Termin[];
    Orte: Orte;
};

export const loadWochenplan: () => Promise<Wochenplan> = async () => {

    const files = await import.meta.glob("./Wochenplan.yaml");
    const filePromises: Promise<{ default: ReadWochenplan}>[] = [];
    for (const path in files) {
        filePromises.push(files[path]() as Promise<{ default: ReadWochenplan}>)
    }
    const wochenplan = await filePromises[0]
        .then(t => t.default)
        .then(({Wochenplan, Orte}) => {
            return {
                Orte,
                Wochenplan: Wochenplan.map(({Datum, Termine: events}) => {
                    const Termine = events.map((event) => {
                        const Effekt: Partial<Effekt> = {
                            Schildi: false,
                            Fachschaft: false,
                            ...(event.Effekt ?? {})
                        };
                        return {
                            ...event,
                            Effekt,
                            Start: DateTime.fromISO(event.Start, {locale: "de-DE"}),
                            Ende: !!event.Ende ? DateTime.fromISO(event.Ende, {locale: "de-DE"}) : undefined,
                        }
                    });
                    return {
                        Datum: DateTime.fromJSDate(Datum).setLocale("de-DE"),
                        Termine
                    }
                })
            }
        });

    return wochenplan
}