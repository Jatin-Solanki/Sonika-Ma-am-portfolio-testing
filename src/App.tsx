
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Lab from "@/pages/Lab";
import Publications from "@/pages/Publications";
import Talks from "@/pages/Talks";
import Activities from "@/pages/Activities";

// Admin Pages
import Login from "@/pages/Login";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import ProfileEditor from "@/pages/admin/ProfileEditor";
import ResearchEditor from "@/pages/admin/ResearchEditor";
import TeachingEditor from "@/pages/admin/TeachingEditor";
import PublicationsEditor from "@/pages/admin/PublicationsEditor";
import TalksEditor from "@/pages/admin/TalksEditor";
import ActivitiesEditor from "@/pages/admin/ActivitiesEditor";
import LabEditor from "@/pages/admin/LabEditor";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="lab" element={<Lab />} />
            <Route path="publications" element={<Publications />} />
            <Route path="talks" element={<Talks />} />
            <Route path="activities" element={<Activities />} />
          </Route>
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfileEditor />} />
            <Route path="research" element={<ResearchEditor />} />
            <Route path="teaching" element={<TeachingEditor />} />
            <Route path="publications" element={<PublicationsEditor />} />
            <Route path="talks" element={<TalksEditor />} />
            <Route path="activities" element={<ActivitiesEditor />} />
            <Route path="lab" element={<LabEditor />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
