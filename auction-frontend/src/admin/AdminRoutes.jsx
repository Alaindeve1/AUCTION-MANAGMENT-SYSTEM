 import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminUsersPage from "./AdminUsersPage";
import AdminItemsPage from "./AdminItemsPage";
import AdminCategoriesPage from "./AdminCategoriesPage";
import AdminBidsPage from "./AdminBidsPage";
import AdminResultsPage from "./AdminResultsPage";
import AdminNotificationsPage from "./AdminNotificationsPage";

const AdminRoutes = () => (
  <Routes>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsersPage />} />
    <Route path="items" element={<AdminItemsPage />} />
    <Route path="categories" element={<AdminCategoriesPage />} />
    <Route path="bids" element={<AdminBidsPage />} />
    <Route path="results" element={<AdminResultsPage />} />
    <Route path="notifications" element={<AdminNotificationsPage />} />
  </Routes>
);

export default AdminRoutes;