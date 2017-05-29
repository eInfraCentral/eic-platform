/**
 * Created by stefanos on 16/1/2017.
 */

import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import {AccordionModule, TypeaheadModule, TooltipModule} from "ngx-bootstrap";
import { MetadataIdentifierFormControl } from "./shared/metadata-identifier-form.component";
import { MetadataHeaderInfoFormControl } from "./shared/metadata-header-info-form.component";
import { ValuesPipe } from "./shared/values-pipe";
import { RelatedCommonsForm, RelatedCommonForm } from "./shared/related-common-form.component";
import { LanguageTypeForm, LanguagesTypeForm } from "./shared/language-type-form.component";
import { IdentifierFormControl } from "./shared/identifier-common-form.component";
import { ResourceService } from "../../services/resource.service";
import { DatasetDistributionInfoFormControl } from "./shared/dataset-distribution-info-form.component";
import {MyStringFormControl, MyStringFormGroup} from "./shared/my-string-form.component";
import { IdentificationInfoFormControl } from "./shared/identification-info-form.component";
import { EnumCommonForm } from "./shared/enum-common-form";
import { ContactInfoFormControl } from "./shared/contact-info-form.component";
import { SizeInfoFormControl } from "./shared/size-info-form.component";
import { LingualityInfoFormControl } from "./shared/linguality-info-form.component";
import { RightsInfoForm, LicenseInfosForm } from "./shared/rights-info-form.component";
import { LanguageVarietyInfoFormControl } from "./shared/language-variety-info-form.component";
import { LanguageInfoFormControl } from "./shared/language-info-form.component";
import { DatasetDistributionsInfoFormControl } from "./shared/dataset-distribution-info-form.component";
import { ZipUploadComponent } from "./shared/zip-upload-form.component";
import { ComponentDistributionInfoFormControl, ComponentDistributionsInfoFormControl } from "./shared/component-distribution-info-form.component";
import {ExampleFormControl} from "./shared/example.component";
import {MyArray, MyArrayInline, MyArrayWrapper, MyInlineArrayWrapper} from "./myform/my-array.interface";
import {MyFormDirective} from "./myform/my-form.directive";
import {VersionFormControl} from "./shared/versionInfo.component";
import {ComponentGenericFormControl} from "./shared/componentGeneric.component";
import {InlineFormWrapper} from "./myform/my-group.interface";
import {ContactPersonFormControl} from "./shared/contactPerson.component";
import {IdentifierCommonFormControl} from "./shared/identifierCommon.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        TypeaheadModule.forRoot()
    ],
    entryComponents: [
        ExampleFormControl,
        MyArrayWrapper,
        ContactPersonFormControl,
        MyInlineArrayWrapper,
        MyStringFormGroup
    ],
    declarations: [
        MyArrayWrapper,
        MyStringFormGroup,
        InlineFormWrapper,
        MyInlineArrayWrapper,
        ContactPersonFormControl,
        MyArray,
        MyArrayInline,
        MyFormDirective,
        ExampleFormControl,
        MetadataIdentifierFormControl,
        MetadataHeaderInfoFormControl,
        VersionFormControl,
        ValuesPipe,
        IdentifierCommonFormControl,
        ComponentGenericFormControl,
        RelatedCommonsForm,
        RelatedCommonForm,
        LanguageTypeForm,
        LanguagesTypeForm,
        IdentifierFormControl,
        DatasetDistributionInfoFormControl,
        DatasetDistributionsInfoFormControl,
        MyStringFormControl,
        IdentificationInfoFormControl,
        EnumCommonForm,
        ContactInfoFormControl,
        SizeInfoFormControl,
        LingualityInfoFormControl,
        ContactInfoFormControl,
        RightsInfoForm,
        LicenseInfosForm,
        LanguageVarietyInfoFormControl,
        LanguageInfoFormControl, 
        ZipUploadComponent,
        ComponentDistributionInfoFormControl,
        ComponentDistributionsInfoFormControl
    ],
    providers: [
        ResourceService
    ],
    exports: [
        MyArrayWrapper,
        InlineFormWrapper,
        MyArray,
        MyArrayInline,
        MyStringFormGroup,
        MyInlineArrayWrapper,
        VersionFormControl,
        ContactPersonFormControl,
        ComponentGenericFormControl,
        IdentifierCommonFormControl,
        MyFormDirective,
        ExampleFormControl,
        MetadataIdentifierFormControl,
        MetadataHeaderInfoFormControl,
        ValuesPipe,
        RelatedCommonsForm,
        RelatedCommonForm,
        LanguageTypeForm,
        LanguagesTypeForm,
        IdentifierFormControl,
        DatasetDistributionInfoFormControl,
        DatasetDistributionsInfoFormControl,
        MyStringFormControl,
        IdentificationInfoFormControl,
        EnumCommonForm,
        ContactInfoFormControl,
        SizeInfoFormControl,
        LingualityInfoFormControl,
        ContactInfoFormControl,
        RightsInfoForm,
        LicenseInfosForm,
        LanguageVarietyInfoFormControl,
        LanguageInfoFormControl, 
        ZipUploadComponent,
        ComponentDistributionInfoFormControl,
        ComponentDistributionsInfoFormControl
    ]
})

export class ResourceRegistrationModule {}
