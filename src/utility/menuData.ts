import {
    Home,
    Box,
    BookOpen,
    Users,
    DollarSign,
    Bell,
    Gift,
    CheckSquare,
    Settings,
} from "lucide-react";

export const menuItems = [
    { title: "Dashboard", path: "/", icon: Home   },
    { title: "Products Management", path: "/products", icon: Box },
    { title: "Courses Management", path: "/courses", icon: BookOpen },
    { title: "Users Management", path: "/users", icon: Users },
    { title: "Stock Management", path: "/stock", icon: Box },
    { title: "Income Tracker", path: "/income", icon: DollarSign },
    { title: "Notification", path: "/notification", icon: Bell },
    { title: "Rewards System", path: "/rewards", icon: Gift },
    { title: "Weekly To-Do", path: "/weekly-todo", icon: CheckSquare },
    {
        title: "Settings",
        icon: Settings,
        children: [
            { title: "Profile Settings", path: "/settings/profile" },
            { title: "Security Settings", path: "/settings/security" },
            { title: "Notification Settings", path: "/settings/notifications" },
        ],
    },
];