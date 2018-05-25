// Generated using typescript-generator version 1.27.339 on 2018-05-25 11:47:46.

export class Addenda implements Identifiable {
    featured: boolean;
    id: string;
    modifiedAt: number;
    modifiedBy: string;
    performanceData: Measurement<any>[];
    published: boolean;
    registeredAt: number;
    registeredBy: string;
    service: string;
}

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
    contactInformation: string;
    id: string;
    name: string;
    service: Service[];
    user: User[];
}

export class Service implements Identifiable {
    availability: string;
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
    providerName: string;
    relatedServices: string[];
    reliability: string;
    request: URL;
    requiredServices: string[];
    serviceLevelAgreement: URL;
    serviceability: string;
    subcategory: string;
    symbol: URL;
    tags: string[];
    tagline: string;
    targetUsers: string;
    termsOfUse: URL[];
    trainingInformation: URL;
    trl: string;
    url: URL;
    userBase: string;
    userManual: URL;
    userValue: string;
    validFor: XMLGregorianCalendar;
    version: string;
}

export class Unit {
}

export class User implements Identifiable {
    email: string;
    id: string;
    iterationCount: number;
    joinDate: string;
    name: string;
    password: string;
    resetToken: string;
    salt: any;
    surname: string;
}

export class Vocabulary implements Identifiable {
    extras: string[];
    id: string;
    name: string;
    parent: string;
    type: string;
}

export class XMLGregorianCalendar implements Cloneable {
}

export class URL implements Serializable {
}

export interface Cloneable {
}

export interface Serializable {
}
