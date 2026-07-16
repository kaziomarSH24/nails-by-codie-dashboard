"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var MainLayout_1 = require("./../layout/MainLayout");
var Home_1 = require("../pages/home/Home");
var ProductsManagement_1 = require("./../pages/products_management/ProductsManagement");
var CoursesManagement_1 = require("../pages/courses_management/CoursesManagement");
var UsersManagement_1 = require("../pages/users_management/UsersManagement");
var StockManagement_1 = require("../pages/stock_management/StockManagement");
var IncomeTracker_1 = require("../pages/income_tracker/IncomeTracker");
var Notification_1 = require("../pages/notification/Notification");
var AddCourse_1 = require("../pages/courses_management/AddCourse");
var AddLeason_1 = require("../pages/courses_management/AddLeason");
var RewardsSystem_1 = require("../pages/rewards_system/RewardsSystem");
var LoginFrom_1 = require("../authentication/LoginFrom");
var EmailVerifyFrom_1 = require("../authentication/EmailVerifyFrom");
var OtpVerify_1 = require("./../authentication/OtpVerify");
var NewPasswordSet_1 = require("../authentication/NewPasswordSet");
var Profile_1 = require("../pages/setting/Profile");
var TermCondiction_1 = require("../pages/setting/TermCondiction");
var Faq_1 = require("../pages/setting/Faq");
var ContactInfo_1 = require("../pages/setting/ContactInfo");
exports.router = (0, react_router_dom_1.createBrowserRouter)([
    {
        path: "/",
        element: react_1.default.createElement(LoginFrom_1.default)
    },
    {
        path: "/email-verify",
        element: react_1.default.createElement(EmailVerifyFrom_1.default)
    },
    {
        path: "/otp-verify",
        element: react_1.default.createElement(OtpVerify_1.default)
    },
    {
        path: "/new-password-set",
        element: react_1.default.createElement(NewPasswordSet_1.default)
    },
    {
        path: "/dashboard",
        element: react_1.default.createElement(MainLayout_1.default),
        children: [
            {
                path: "",
                element: react_1.default.createElement(Home_1.default)
            },
            {
                path: "product-management",
                element: react_1.default.createElement(ProductsManagement_1.default)
            },
            {
                path: "courses-management",
                element: react_1.default.createElement(CoursesManagement_1.default)
            },
            {
                path: "user-management",
                element: react_1.default.createElement(UsersManagement_1.default)
            },
            {
                path: "stock-management",
                element: react_1.default.createElement(StockManagement_1.default)
            },
            {
                path: "income-tracker",
                element: react_1.default.createElement(IncomeTracker_1.default)
            },
            {
                path: "notification",
                element: react_1.default.createElement(Notification_1.default)
            },
            {
                path: "course-create",
                element: react_1.default.createElement(AddCourse_1.default)
            },
            {
                path: "add-leason/:id",
                element: react_1.default.createElement(AddLeason_1.default)
            },
            {
                path: "rewards-system",
                element: react_1.default.createElement(RewardsSystem_1.default)
            },
            {
                path: "settings/profile",
                element: react_1.default.createElement(Profile_1.default)
            },
            {
                path: "settings/term-condiction",
                element: react_1.default.createElement(TermCondiction_1.default)
            },
            {
                path: "settings/faq",
                element: react_1.default.createElement(Faq_1.default)
            },
            {
                path: "settings/contact-info",
                element: react_1.default.createElement(ContactInfo_1.default)
            }
        ]
    }
]);
