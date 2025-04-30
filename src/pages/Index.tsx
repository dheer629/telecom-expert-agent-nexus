
import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import LoginForm from '@/components/LoginForm';
import DocumentUploader from '@/components/DocumentUploader';
import ModeSelector from '@/components/ModeSelector';
import DeepResearchMode from '@/components/DeepResearchMode';
import ModelSelector from '@/components/ModelSelector';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { authenticated, user, operationMode, setAuthenticated, setUser } = useApp();
  const { toast } = useToast();

  const handleLogout = () => {
    setAuthenticated(false);
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  if (!authenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f8ff]">
      <Header />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.email || 'User'}
            </h2>
            <p className="text-gray-600">
              Telecom Expert Agent Portal
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ModeSelector />
            <ModelSelector />
          </div>
          
          <div className="lg:col-span-3">
            {operationMode === 'Telecom Expert Chat' && (
              <div className="grid grid-cols-1 gap-6">
                <DocumentUploader />
                <ChatInterface />
              </div>
            )}
            
            {operationMode === 'Deep Research' && (
              <DeepResearchMode />
            )}
            
            {operationMode === 'DB Stats & Optimize' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Database Statistics & Optimization</h2>
                <p className="text-muted-foreground mb-4">
                  This is a placeholder for the DB Stats & Optimize mode functionality.
                </p>
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium">DB Stats:</h3>
                    <p>Total Chunks: 247</p>
                    <p>Total Text Size: 3.75 MB</p>
                  </div>
                  <Button>Optimize Database</Button>
                </div>
              </div>
            )}
            
            {operationMode === 'DB Summary & Suggested Qs' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">DB Summary & Suggested Questions</h2>
                <p className="text-muted-foreground mb-4">
                  This is a placeholder for the DB Summary & Suggested Qs mode functionality.
                </p>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="text-sm font-medium mb-2">DB Summary (Page 1):</h3>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Discussions focused on 5G network architecture and deployment strategies</li>
                    <li>Several queries about network slicing implementation</li>
                    <li>Technical discussions on telecom protocols and standards</li>
                  </ul>
                  
                  <h3 className="text-sm font-medium mb-2">Suggested Follow-up Questions:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>What are the key differences between NSA and SA 5G deployments?</li>
                    <li>How does network slicing benefit IoT applications?</li>
                    <li>What security considerations are unique to 5G networks?</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
