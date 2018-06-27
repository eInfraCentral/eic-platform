/**
 * Created by stefania on 8/29/16.
 */

import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrowseCategoriesComponent } from "./pages/browsecategories/browse-categories.component";
import { CompareServicesComponent } from "./pages/compare/compare-services.component";
import { ServiceEditComponent } from "./pages/eInfraServices/service-edit.component";
import { ServiceUploadComponent } from "./pages/eInfraServices/service-upload.component";
import { HomeComponent } from "./pages/home/home.component";
import { SearchComponent } from "./pages/search/search.component";
import { CanActivateViaAuthGuard } from "./services/can-activate-auth-guard.service";
import { ServiceLandingPageComponent } from "./pages/landingpages/service/service-landing-page.component";

const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },
    {
        path: "home",
        component: HomeComponent,
        data: {
            breadcrumb : "Home"
        }
    },
    {
        path: "search",
        component: SearchComponent,
        data: {
            breadcrumb : "Search"
        }
    },
    {
        path: "compare",
        component: CompareServicesComponent,
        data: {
            breadcrumb : "Compare"
        }
    },
    {
        path: "browseCategories",
        component: BrowseCategoriesComponent,
        data: {
            breadcrumb : "Browse"
        }
    },
    {
        path: "service/:id",
        component: ServiceLandingPageComponent,
        data: {
            breadcrumb : "Service"
        }
    },
    {
        path: "upload",
        component: ServiceUploadComponent,
        canActivate: [CanActivateViaAuthGuard],
        data: {
            breadcrumb : "Upload"
        }
    },
    {
        path: "edit/:id",
        component: ServiceEditComponent,
        canActivate: [CanActivateViaAuthGuard],
        data: {
            breadcrumb : "Edit"
        }
    }
];
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
