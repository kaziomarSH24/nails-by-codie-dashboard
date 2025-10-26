import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import MainLayout from './../layout/MainLayout';
import Home from '../pages/home/Home';
import ProductsManagement from './../pages/products_management/ProductsManagement';
import CoursesManagement from '../pages/courses_management/CoursesManagement';
import UsersManagement from '../pages/users_management/UsersManagement';
import StockManagement from '../pages/stock_management/StockManagement';
import IncomeTracker from '../pages/income_tracker/IncomeTracker';
import Notification from '../pages/notification/Notification';
import AddNewCourse from '../pages/courses_management/AddCourse';
import AddLessonForm from '../pages/courses_management/AddLeason';
import RewardsSystem from '../pages/rewards_system/RewardsSystem';
import LoginFrom from '../authentication/LoginFrom';
import EmailVerifyFrom from '../authentication/EmailVerifyFrom';
import OtpVerify from './../authentication/OtpVerify';
import NewPasswordSet from '../authentication/NewPasswordSet';
import Profile from '../pages/setting/Profile';
import TermCondiction from '../pages/setting/TermCondiction';
import Faq from '../pages/setting/Faq';
import ContactInfo from '../pages/setting/ContactInfo';

export const router = createBrowserRouter([
    {
        path: "/",
        element: React.createElement(LoginFrom)
    },
    {
        path: "/email-verify",
        element: React.createElement(EmailVerifyFrom)
    },
    {
        path: "/otp-verify",
        element: React.createElement(OtpVerify)
    },
    {
        path: "/new-password-set",
        element: React.createElement(NewPasswordSet)
    },
    {
        path: "/dashboard",
        element: React.createElement(MainLayout),
        children: [
            {
                path: "",
                element: React.createElement(Home)
            },
            {
                path: "product-management",
                element: React.createElement(ProductsManagement)
            },
            {
                path: "courses-management",
                element: React.createElement(CoursesManagement)
            },
            {
                path: "user-management",
                element: React.createElement(UsersManagement)
            },
            {
                path: "stock-management",
                element: React.createElement(StockManagement)
            },
            {
                path: "income-tracker",
                element: React.createElement(IncomeTracker)
            },
            {
                path: "notification",
                element: React.createElement(Notification)
            },
            {
                path: "course-create",
                element: React.createElement(AddNewCourse)
            },
            {
                path: "add-leason",
                element: React.createElement(AddLessonForm)
            },
            {
                path: "rewards-system",
                element: React.createElement(RewardsSystem)
            },
            {
                path: "settings/profile",
                element: React.createElement(Profile)
            },
            {
                path: "settings/term-condiction",
                element: React.createElement(TermCondiction)
            },
            {
                path: "settings/faq",
                element: React.createElement(Faq)
            },
            {
                path: "settings/contact-info",
                element: React.createElement(ContactInfo)
            }

        ]
    }
]);