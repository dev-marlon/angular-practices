import {Component, OnInit} from '@angular/core';
import {combineLatest, Observable} from "rxjs";
import {Filter, Opossum, OpossumService} from "./opossum.service";
import {map, startWith} from "rxjs/operators";
import {FormControl} from "@angular/forms";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    constructor(private opossumService: OpossumService) {}

    public maxAgeFormControl: FormControl = new FormControl(50);
    public perfectionPointsFormControl: FormControl = new FormControl(10);

    private opossums$ = this.opossumService.opossums$;
    private filterChanges$: Observable<any> = combineLatest([
        this.maxAgeFormControl.valueChanges.pipe(startWith(this.maxAgeFormControl.value)),
        this.perfectionPointsFormControl.valueChanges.pipe(startWith(this.perfectionPointsFormControl.value))
    ]).pipe(
        map(([maxAge, perfectionPoints]: [number, number]) => ({ maxAge, perfectionPoints } as Filter)));

    // Combine all streams for the view
    public viewModel$ = combineLatest(
        [this.opossums$],
    ).pipe(map(
        ([opossums]: [Opossum[]]) => (
            {opossums}
        )
    ));

    public ngOnInit(): void {
        this.filterChanges$.subscribe((filter: Filter) => {
            this.opossumService.applyFilter(filter);
        })
    }
}
