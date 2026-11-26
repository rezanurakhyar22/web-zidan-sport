export interface IPLocation {
    country: string;
    region: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    isp: string;
    query: string;
}
export declare function getLocationFromIP(ip: string): Promise<IPLocation | null>;
