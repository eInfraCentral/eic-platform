// Generated using typescript-generator version 1.27.339 on 2018-09-24 17:11:32.

export class Dimension {
}

export class Event implements Identifiable {
    id: string;
    instant: number;
    service: string;
    type: string;
    user: string;
    value: string;
}

export interface Identifiable {
}

export class Indicator implements Identifiable {
    description: string;
    dimensions: Dimension[];
    id: string;
    unit: Unit;
}

export class Service implements Identifiable {
    category: string;
    changeLog: string;
    description: string;
    feedback: URL;
    funding: string;
    helpdesk: URL;
    id: string;
    languages: string[];
    lastUpdate: XMLGregorianCalendar;
    lifeCycleStatus: string;
    multimediaURL: URL;
    name: string;
    options: string;
    order: URL;
    places: string[];
    price: URL;
    providers: string[];
    relatedServices: string[];
    requiredServices: string[];
    serviceLevelAgreement: URL;
    subcategory: string;
    symbol: URL;
    tag: string[];
    tagline: string;
    targetUsers: string;
    termOfUse: URL[];
    trainingInformation: URL;
    trl: string;
    url: URL;
    userBase: string;
    userManual: URL;
    userValue: string;
    validFor: XMLGregorianCalendar;
    version: string;
}

export class InfraService extends Service {
    active: boolean;
    serviceMetadata: ServiceMetadata;
    status: string;
}

export class Manager implements Identifiable {
    contactInformation: string;
    id: string;
    name: string;
    service: User[];
    user: User[];
}

export class Measurement<T> implements Identifiable {
    id: string;
    indicator: Indicator;
    location: string[];
    time: XMLGregorianCalendar;
    value: any;
}

export class Membership implements Identifiable {
    grant: string;
    id: string;
    provider: string;
    user: string;
}

export class Provider implements Identifiable {
    active: boolean;
    additionalInfo: string;
    catalogueOfResources: URL;
    contactInformation: string;
    id: string;
    name: string;
    logo: string;
    publicDescOfResources: URL;
    status: string;
    users: User[];
    website: URL;
}

export class RichService extends Service {
    categoryName: string;
    favourites: number;
    hasRate: number;
    isFavourite: boolean;
    languageNames: string[];
    placeNames: string[];
    lifeCycleStatusName: string;
    ratings: number;
    serviceMetadata: ServiceMetadata;
    subCategoryName: string;
    trlName: string;
    userRate: number;
    views: number;
}

export class ServiceMetadata {
    featured: boolean;
    modifiedAt: string;
    modifiedBy: string;
    performanceData: Measurement<any>[];
    published: boolean;
    registeredAt: string;
    registeredBy: string;
}

export class ServiceHistory extends ServiceMetadata {
    version: string;
    versionChange: boolean;
}

export class Unit {
}

export class User implements Identifiable {
    email: string;
    id: string;
    name: string;
    surname: string;
}

// export class Vocabulary implements Identifiable {
//     extras: string[];
//     id: string;
//     name: string;
//     parent: string;
//     type: string;
// }

// For the new Vocabularies
export class Vocabulary implements Identifiable {
    entries: { [index: string]: VocabularyEntry };
    id: string;
    name: string;
}

export class VocabularyEntry {
    children: VocabularyEntry[];
    id: string;
    name: string;
    extras: { [index: string]: string };
}


export class URL implements Serializable {
}

export class XMLGregorianCalendar implements Cloneable {
}

export interface Serializable {
}

export interface Cloneable {
}