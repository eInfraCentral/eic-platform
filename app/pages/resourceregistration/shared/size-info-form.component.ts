/**
 * Created by stefania on 1/19/17.
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { EnumValues, sizeUnitEnum } from "./omtd.enum";

@Component({
    selector: 'size-info',
    template : `
    <div [formGroup]="parentForm" [ngClass]="{'has-error':!parentForm.valid}">
        <label *ngIf="index == -1 || index==0" class="col-sm-2 col-md-2 control-label">Size Info</label>
        <div *ngIf="index != -1 && index!=0" class="col-sm-2 col-md-2 control-label"></div> 
        <div class="col-sm-6 col-md-6">
            <input type="text" class="form-control" formControlName="size" placeholder="Size">
        </div>
        <div class="col-sm-4 col-md-4">
            <select name="role" class="form-control" formControlName="sizeUnit">
                <option *ngFor="let value of sizeUnits" [value]="value.key" [selected]="value.key == ''">
                    {{value.value}}
                </option>
            </select>
        </div>
    </div>
    `,
    styleUrls : ['app/pages/resourceregistration/shared/templates/common.css']
})

export class SizeInfoFormControl implements OnInit {

    @Input('group')
    public parentForm: FormGroup;

    @Input('index')
    index: number = -1;

    public myForm : FormGroup;

    private sizeUnits: EnumValues[];

    validate(c : AbstractControl) {
        //null otan einai swsto
        // {my_error : "vale kati"} : otan einai lathos
    }

    constructor(private _fb: FormBuilder) {
        this.sizeUnits = sizeUnitEnum;
    }

    public static generate(_fb: FormBuilder) {
        return _fb.group({
            size : ['', Validators.required],
            sizeUnit: ''
        });
    }

    ngOnInit() {
        this.myForm = this._fb.group(SizeInfoFormControl.generate(this._fb));
        if(this.index == -1) {
            this.parentForm.addControl("sizeInfo", this.myForm);
        } else {
            this.myForm = this.parentForm;
        }
    }
}