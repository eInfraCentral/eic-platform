/**
 * Created by stefanos on 21/11/2016.
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Description, revisionDesc} from "./omtd.description";
import {metadataIdentifierSchemeNameEnum, EnumValues} from "./omtd.enum";

@Component({
    selector: 'metadata-header-info-form',
    templateUrl : 'app/pages/resourceregistration/shared/templates/metadata-header-info-form.component.html',
    styleUrls : ['app/pages/resourceregistration/shared/templates/common.css']
})


export class MetadataHeaderInfoFormControl implements OnInit{

    revisionDesc : Description;

    @Input('group')
    public parentForm: FormGroup;

    public myForm : FormGroup;

    private personEnum : EnumValues[];

    public get formGroup() {
        return this.myForm;
    }

    constructor(private _fb: FormBuilder) {
        this.revisionDesc =  revisionDesc;
        this.personEnum = metadataIdentifierSchemeNameEnum;
    }

    ngOnInit() {
        this.myForm = this._fb.group({
            revision : ['', [Validators.required]]
        });
        this.parentForm.addControl("metadataHeaderInfo", this.myForm);
    }
}