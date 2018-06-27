/**
 * Created by stefania on 6/7/17.
 */

import {ModuleWithProviders} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DevelopersComponent} from "./developers/developers.component";
import {FAQsComponent} from "./faqs/faqs.component";
import {OpenAPIComponent} from "./openapi/openapi.component";

const supportRoutes: Routes = [
    {
        path: "support/faqs",
        component: FAQsComponent,
        data: {
            breadcrumb : "FAQs"
        }
    },
    {
        path: "developers",
        component: DevelopersComponent,
        data: {
            breadcrumb : "Developers"
        }
    },
    {
        path: "openapi",
        component: OpenAPIComponent,
        data: {
            breadcrumb : "Open API"
        }
    }
];
export const supportRouting: ModuleWithProviders = RouterModule.forChild(supportRoutes);