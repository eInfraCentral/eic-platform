import {FormGroup, FormBuilder, FormArray, AbstractControl} from "@angular/forms";
import {Component, Input, OnInit, Injector, OnChanges, SimpleChanges} from "@angular/core";
import {Description} from "../../../domain/omtd.description";
/**
 * Created by stefanos on 15/5/2017.
 */

@Component({
})
export class MyGroup implements OnInit {



    @Input() public parentGroup: FormGroup | FormArray;

    @Input() public name : string | number;

    @Input() public data : any = null;

    @Input() public required : boolean = false;

    @Input() public description : Description = null;

    @Input() public index : number = -1;

    protected _fb : FormBuilder;

    protected groupDefinition : { [key:string]:any };

    protected group : FormGroup | FormArray;

    constructor(injector : Injector) {
        this._fb = injector.get(FormBuilder);
    }

    protected get isArray() {
        return this.index != -1;
    }

    public generate() : FormGroup {
        let ret = this._fb.group(this.groupDefinition);
        if (!this.required)
            Object.keys(ret.controls).forEach(item => ret.controls[item].clearValidators());
        return ret;
    }

    public getMyControl(name : string) : AbstractControl {
        if (this.isArray) {
            return this.group.get(<string>name);
        }
        else {
            // return this.group.get([this.name, name].join('.'));
            return this.group.get(name as string);
        }
    }

    ngOnInit(): void {
        if(this.index == -1) {
            if(<string>this.name == '' || (<FormGroup>this.parentGroup).contains(<string>this.name)) {
                let obj = this.generate();
                Object.keys(obj.controls).forEach(c => (<FormGroup>this.parentGroup.get(<string>this.name)).addControl(c,obj.controls[c]));
                this.group = this.parentGroup.get(this.name as string) as FormGroup;
            } else {
                (<FormGroup>this.parentGroup).addControl(<string>this.name, this.generate());
                this.group = this.parentGroup.get(this.name as string) as FormGroup;
            }
        } else {
            this.name = this.index;
            this.group = this.parentGroup as FormGroup;
        }
    }

    public get valid() {
        return this.group.valid;
    }

}

@Component({
    selector : 'form-inline',
    template : `
<template #descTemplate>{{description.desc}}</template>

<div class="form-group">
    <label class="col-sm-2 col-md-2 control-label">
        <span *ngIf="description.mandatory==true"><i class="fa fa-star" style="color : red"></i></span>
        <!--<span *ngIf="description.recommended==true"><i class="fa fa-star" style="color : green"></i></span>-->
        {{description.label}}
        <span *ngIf="params==='tooltip'"><i class="fa fa-info-circle" [tooltip]="descTemplate" container="body"></i></span>
    </label>
    <div class="form-group">
        <div class="col-md-{{width}} col-sm-{{width}}" [ngClass]="{'has-error': !valid}">
            <ng-content></ng-content>
        </div>
    </div>
</div>
<div *ngIf="params==='inline'" class="form-group">
    <div class="col-sm-offset-2 col-md-offset-2 col-sm-{{width}} col-md-{{width}}">
        <small>{{description.desc}}</small>
    </div>
</div>

`,
    styleUrls : ['../shared/templates/common.css']

})
export class InlineFormWrapper implements OnChanges {

    @Input() public description : Description = null;

    @Input() public params : string = 'inline';

    @Input() public width : number = 9;

    @Input() public valid : boolean = true;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.valid)
            this.valid = <boolean>changes.valid.currentValue;
    }

}