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

export const router = createBrowserRouter([
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
            }
        ]
    }
]);