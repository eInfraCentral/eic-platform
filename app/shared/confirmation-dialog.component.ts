/**
 * Created by stefania on 5/2/17.
 */
import { Component, ViewChild, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html'
})
export class ConfirmationDialogComponent implements OnInit {

    @ViewChild('autoShownModal')
    public autoShownModal:ModalDirective;

    @Input()
    public isModalShown:boolean = false;

    @Output() emmitObject: EventEmitter<any> = new EventEmitter();

    private _ids: string[] = [];

    public set ids(ids: string[]) {
        this._ids = ids;
    }

    public showModal():void {
        console.log("SHOWN");
        this.isModalShown = true;
    }

    public hideModal():void {
        console.log("HIDDEN");
        this.autoShownModal.hide();
    }

    public onHidden():void {
        this.isModalShown = false;
    }

    public confirmedAction() {
        this.emmitObject.emit(this._ids);
        this.hideModal();
    }

    ngOnInit() {
        console.log("I WAS CREATED AND IM ALIVE")
    }

    // public saveCustom(obj : any) {
    //     if (this.type == 'topic') {
    //         this._faqService.saveTopic(<Topic> obj).subscribe(
    //             data => this.emmitObject.emit(data),
    //             error => this.emmitError.emit(error)
    //         );
    //     } else if (this.type == 'question') {
    //         return;
    //     }
    //     this.hideModal();
    // }
}