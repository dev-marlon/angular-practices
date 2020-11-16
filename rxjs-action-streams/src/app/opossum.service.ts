import {Injectable} from "@angular/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BehaviorSubject, combineLatest} from "rxjs";
import {map, shareReplay} from "rxjs/operators";

export type Opossum = {
    name: string,
    type: OpussumType,
    perfectionPoints: number,
    age: number,
}

enum OpussumType {
    DidelphisVirginiana,
    didelphisMarsupialis,
    DidelphisImperfecta,
    DidelphisAlbiventris,
    DidelphisAurita,
    DidelphisPernigra,

}

const opossums: Opossum[] = [
    {
        name: 'Günther',
        type: OpussumType.DidelphisAlbiventris,
        perfectionPoints: 100,
        age: 32,
    },
    {
        name: 'Stefan',
        type: OpussumType.DidelphisAlbiventris,
        perfectionPoints: 75,
        age: 24,
    },
    {
        name: 'Ulf',
        type: OpussumType.DidelphisAlbiventris,
        perfectionPoints: 100,
        age: 24,
    },
    {
        name: 'Sturmfried',
        type: OpussumType.DidelphisAlbiventris,
        perfectionPoints: 80,
        age: 29,
    },
    {
        name: 'Frank',
        type: OpussumType.DidelphisAlbiventris,
        perfectionPoints: 90,
        age: 46,
    },
    {
        name: 'Heinz',
        type: OpussumType.DidelphisAlbiventris,
        perfectionPoints: 50,
        age: 21,
    },
];

export interface Filter {
    maxAge: number,
    perfectionPoints: number
}

@Injectable()
export class OpossumService {
    public allOpossums$ = this.httpClient.get<Opossum[]>('assets/opossums.json').pipe(shareReplay(1));

    public filterSubject$ = new BehaviorSubject(null);
    private filterAction$ = this.filterSubject$.asObservable();

    public opossums$ = combineLatest([
        this.allOpossums$,
        this.filterAction$,
    ]).pipe(
        map(([opossums, filter]) => {
            return this.performFilter(opossums, filter);
        }));

    constructor(private httpClient: HttpClient) {}

    public applyFilter(filter: any): void {
        this.filterSubject$.next(filter);
    }

    private performFilter(opossums: Opossum[], filter: Filter): Opossum[] {
        return opossums.filter((opossum: Opossum) => {
           return opossum.age <= filter.maxAge && opossum.perfectionPoints >= filter.perfectionPoints
        });
    }
}
