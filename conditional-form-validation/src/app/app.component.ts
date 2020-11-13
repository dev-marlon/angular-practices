import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from '@angular/forms';

export type BooleanFn = () => Boolean;

export function conditionalValidator(
    condition: BooleanFn,
    validators: ValidatorFn[]
): ValidatorFn {
    return (formControl: FormControl): ValidationErrors | null => {
        if (formControl.parent === undefined) {
            return null;
        }

        if (condition() === false) {
            return null;
        }

        // Iterate through validators and return first error
        for (const validator of validators) {
            const error = validator(formControl);

            if (error !== null) {
                return error;
            }
        }

        return null;
    };
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
    constructor(private formBuilder: FormBuilder) {}

    public form: FormGroup;

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            email: this.formBuilder.group({
                isActive: [false],
                recipient: [
                    '',
                    conditionalValidator(
                        () => this.form.get('email.isActive').value,
                        [Validators.required]
                    ),
                ],
                subject: [
                    '',
                    conditionalValidator(
                        () => this.form.get('email.isActive').value,
                        [Validators.required]
                    ),
                ],
                message: [
                    '',
                    conditionalValidator(
                        () => this.form.get('email.isActive').value,
                        [Validators.required]
                    ),
                ],
            }),
        });
    }

    public onSubmit(): void {
        this.updateValueAndValidityOfAllControls(this.form);

        console.log(this.form.get('email').valid, this.form.status);
    }

    private updateValueAndValidityOfAllControls(formGroup: FormGroup): void {
        const keys = Object.keys(formGroup.controls);
        for (const key of keys) {
            const control = formGroup.get(key);

            if (control instanceof FormGroup) {
                control.updateValueAndValidity({
                    onlySelf: true,
                    emitEvent: false,
                });
                this.updateValueAndValidityOfAllControls(control);
            }

            control.updateValueAndValidity({
                emitEvent: false,
            });
        }
    }
}
