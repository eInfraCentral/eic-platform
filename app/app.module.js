"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by stefania on 10/3/16.
 */
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var forms_2 = require("@angular/forms");
var http_1 = require('@angular/http');
var app_routing_1 = require("./app.routing");
var user_service_1 = require("./services/user.service");
var authentication_service_1 = require("./services/authentication.service");
var can_activate_auth_guard_service_1 = require("./services/can-activate-auth-guard.service");
var resource_service_1 = require("./services/resource.service");
var app_component_1 = require("./app.component");
var topmenu_component_1 = require("./shared/topmenu/topmenu.component");
var home_component_1 = require("./pages/home/home.component");
var search_component_1 = require("./pages/search/search.component");
var support_component_1 = require("./pages/support/support.component");
var corpus_landing_page_component_1 = require("./pages/landingpages/corpus/corpus-landing-page.component");
var component_landing_page_component_1 = require("./pages/landingpages/component/component-landing-page.component");
var login_component_1 = require("./pages/user/signin/login.component");
var register_component_1 = require("./pages/user/register/register.component");
var edit_profile_component_1 = require("./pages/user/editprofile/edit-profile.component");
var component_registration_module_1 = require("./pages/resourceregistration/component/component-registration.module");
var common_1 = require('@angular/common');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                forms_2.ReactiveFormsModule,
                http_1.HttpModule,
                http_1.JsonpModule,
                // ResourceRegistrationModule,
                app_routing_1.routing,
                component_registration_module_1.ComponentRegistrationModule
            ],
            declarations: [
                app_component_1.AppComponent,
                home_component_1.HomeComponent,
                support_component_1.SupportComponent,
                login_component_1.LoginComponent,
                register_component_1.RegisterComponent,
                edit_profile_component_1.EditProfileComponent,
                search_component_1.SearchComponent,
                topmenu_component_1.TopMenuComponent,
                component_landing_page_component_1.ComponentLandingPageComponent,
                corpus_landing_page_component_1.CorpusLandingPageComponent
            ],
            providers: [
                { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy },
                user_service_1.UserService,
                authentication_service_1.AuthenticationService,
                can_activate_auth_guard_service_1.CanActivateViaAuthGuard,
                resource_service_1.ResourceService,
                app_routing_1.appRoutingProviders
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map