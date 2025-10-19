import { DateTime } from "luxon";
import { gcd } from "@algorithm.ts/gcd";

type Effekt = {
    Schildi: boolean;
    Boulderschildi: boolean;
    Fachschaft: boolean;
    Highlight: boolean;
    Icon: string;
};

type ReadTreffpunkt = {
    Text: string;
    Ort: string;
}

type Treffpunkt = {
    Pre: string;
    Link: string;
    Post: string;
    Ort: string;
}

type DT = Required<ReturnType<DateTime['toObject']>>;

type Event = {
    Titel: string;
    TitelEnglisch?: string;
    Beschreibung: string;
    BeschreibungEnglisch?: string;
    Start: DT;
    Ende: DT | undefined;
    Treffpunkt: Treffpunkt[];
    Effekt: Partial<Effekt>;
};
type ReadEvent = {
    Titel: Event['Titel'];
    Beschreibung: Event['Beschreibung'];
    TitelEnglisch?: Event['TitelEnglisch'];
    BeschreibungEnglisch?: Event['BeschreibungEnglisch'];
    Start: string;
    Ende?: string;
    Treffpunkt: ReadTreffpunkt[];
    Effekt: Partial<Effekt>;
}

type ReadTermin = {
    Datum: Date;
    Termine: ReadEvent[];
}

type Termin = {
    Datum: DT;
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

export type Wochenplan = {
    Config: {
        Start: number;
        Ende: number;
        SPH: number;
    }
    Wochenplan: Termin[];
    Orte: Orte;
};

export const loadWochenplan: () => Promise<Wochenplan> = async () => {

    const files = await import.meta.glob("./Wochenplan.yaml");
    const filePromises: Promise<{ default: ReadWochenplan}>[] = [];
    for (const path in files) {
        filePromises.push(files[path]() as Promise<{ default: ReadWochenplan}>)
    }

    const getLink = (s: string) => {
        let start = s.indexOf("[");
        let end = s.indexOf("]");
        if (start >= 0 && end >= 0) {
            return {
                Pre: s.substring(0, start),
                Link: s.substring(start + 1, end),
                Post: s.substring(end + 1),
            }
        } else {
            return {
                Pre: "",
                Link: s,
                Post: "",
            }
        }
    }
    const strToTreffpunkt = (s: string) => {
        let link = getLink(s);
        if (link.Link !== s) {
            return {
                ...link,
                Ort: link.Link
            }
        }
        return {
            ...getLink(s),
            Ort: s
        }
    };
    type TreffToTreffpunkt = Pick<Treffpunkt, "Ort"> & {Text: string};
    const treffToTreffpunkt = (t: TreffToTreffpunkt) => {
        return {
            ...getLink(t.Text),
            Ort: t.Ort
        }
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
                        const Treffpunkt = [];
                        if (typeof event.Treffpunkt === "string") {
                            Treffpunkt.push(strToTreffpunkt(event.Treffpunkt));
                        } else if (Array.isArray(event.Treffpunkt)) {
                            event.Treffpunkt.forEach(treffpunkt => {
                                if (typeof treffpunkt === "string") {
                                    Treffpunkt.push(strToTreffpunkt(treffpunkt));
                                } else {
                                    Treffpunkt.push(treffToTreffpunkt(treffpunkt as TreffToTreffpunkt))
                                }
                            })
                        } else {
                            Treffpunkt.push(event.Treffpunkt)
                        }
                        
                        return {
                            ...event,
                            Effekt,
                            Start: DateTime.fromISO(event.Start, {locale: "de-DE"}).toObject() as DT,
                            Ende: !!event.Ende ? DateTime.fromISO(event.Ende, {locale: "de-DE"}).toObject() as DT : undefined,
                            Treffpunkt
                        }
                    });
                    return {
                        Datum: DateTime.fromJSDate(Datum).setLocale("de-DE").toObject() as DT,
                        Termine
                    }
                })
            }
        });
    const Config = wochenplan.Wochenplan.map(({Termine}) => {
        return {
            Start: Termine[0].Start.hour,
            Ende: Termine.at(-1)!.Ende?.hour ?? Math.min(Termine.at(-1)!.Start.hour + 2, 23),
            SPH: Math.max(...Termine.map(({Start, Ende}) => Math.max((Start.minute > 0 ? 60/gcd(60,Start.minute) : 1), (Ende?.minute ?? 0 > 0 ? 60/gcd(60, Ende?.minute!) : 1))))
        }
    }).reduce((acc, val) => {
        return {
            Start: Math.min(acc.Start, val.Start),
            Ende: Math.max(acc.Ende, val.Ende),
            SPH: Math.max(acc.SPH, val.SPH)
        }
    });

    return {
        Config,
        ...wochenplan
    }
}