import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/common/CommandPalette';
import { FlowAIAssistant } from './components/ai/FlowAIAssistant';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginPage } from './components/auth/LoginPage';
import { AddClientModal } from './components/modules/clients/AddClientModal';
import clsx from 'clsx';

// Modules
import { DashboardView } from './components/modules/dashboard/DashboardView';
import { ClientsView } from './components/modules/clients/ClientsView';
import { PipelineView } from './components/modules/leads/PipelineView';
import { ProjectsView } from './components/modules/projects/ProjectsView';
import { InvoicesView } from './components/modules/invoices/InvoicesView';
import { ContractsView } from './components/modules/contracts/ContractsView';
import { FilesView } from './components/modules/files/FilesView';
import { CalendarView } from './components/modules/calendar/CalendarView';
import { CommunicationView } from './components/modules/communication/CommunicationView';
import { AnalyticsView } from './components/modules/analytics/AnalyticsView';
import { SettingsView } from './components/modules/settings/SettingsView';
import { UserManagementView } from './components/modules/users/UserManagementView';

const MainLayout: React.FC = () => {
  const { activeModule, currentUser } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // If user is not authenticated, show Login Screen
  if (!currentUser) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'clients':
        return <ClientsView />;
      case 'leads':
        return <PipelineView />;
      case 'projects':
        return <ProjectsView />;
      case 'tasks':
        return <ProjectsView />;
      case 'invoices':
        return <InvoicesView />;
      case 'contracts':
        return <ContractsView />;
      case 'users':
        return <UserManagementView />;
      case 'files':
        return <FilesView />;
      case 'calendar':
        return <CalendarView />;
      case 'communication':
        return <CommunicationView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className={clsx(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
      )}>
        <Header 
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenAddClient={() => setIsAddClientModalOpen(true)}
        />

        <main className="flex-1 p-6 sm:p-8 md:p-10 max-w-[1650px] w-full mx-auto space-y-8">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Utilities */}
      <CommandPalette />
      <FlowAIAssistant />
      <ToastContainer />

      {/* Header Quick Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
