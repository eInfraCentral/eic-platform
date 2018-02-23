/**
 * Created by stefania on 6/7/17.
 */

import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveTopicQuestions} from "../../../domain/faq-active-topic-questions";
import {FAQService} from "../../../services/faq.service";

@Component({
    selector: "faqs",
    templateUrl: "./faqs.component.html",
    styles: ["h3.uk-accordion-title { text-transform: none; } .uk-tab > * > a, .nav-tabs > li > a { font-size: 14px;}"]
})
export class FAQsComponent implements OnInit {
    private activeTopicQuestions: ActiveTopicQuestions[] = [];
    private errorMessage: string;

    constructor(public route: ActivatedRoute,
                public router: Router,
                public faqService: FAQService) {
    }

    ngOnInit() {
        this.faqService.getActiveTopicQuestions().subscribe(
            activeTopicQuestions => this.shiftThroughTopics(activeTopicQuestions));
    }

    shiftThroughTopics(activeTopicQuestions: ActiveTopicQuestions[]) {
        this.activeTopicQuestions = activeTopicQuestions.filter(_ => _.name === "Legal");
    }

    // handleError(error) {
    //     this.errorMessage = 'System error retrieving FAQs (Server responded: ' + error + ')';
    // }
}