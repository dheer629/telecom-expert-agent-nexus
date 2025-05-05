
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
    <div className="min-h-screen flex flex-col bg-[#f8fbff]">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-telecom-secondary">
              Welcome, {user?.email || 'User'}
            </h2>
            <p className="text-gray-600">
              Telecom Expert Agent Portal
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center border-telecom-primary/20 hover:bg-telecom-light/50 text-telecom-secondary"
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
              <div className="bg-white p-6 rounded-lg shadow-lg border border-telecom-primary/10">
                <h2 className="text-xl font-bold mb-4 text-telecom-secondary">Database Statistics & Optimization</h2>
                <p className="text-muted-foreground mb-6">
                  Review and optimize your knowledge database for better performance and search results.
                </p>
                <div className="p-6 bg-telecom-light/20 rounded-md border border-telecom-primary/10">
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-telecom-secondary mb-3">Database Statistics:</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-md shadow-sm border border-telecom-primary/10">
                        <span className="block text-xs text-gray-500">Total Chunks</span>
                        <span className="text-2xl font-bold text-telecom-primary">247</span>
                      </div>
                      <div className="bg-white p-4 rounded-md shadow-sm border border-telecom-primary/10">
                        <span className="block text-xs text-gray-500">Text Size</span>
                        <span className="text-2xl font-bold text-telecom-primary">3.75 MB</span>
                      </div>
                      <div className="bg-white p-4 rounded-md shadow-sm border border-telecom-primary/10">
                        <span className="block text-xs text-gray-500">Last Update</span>
                        <span className="text-lg font-bold text-telecom-secondary">Today</span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-telecom-primary hover:bg-telecom-secondary">Optimize Database</Button>
                </div>
              </div>
            )}
            
            {operationMode === 'DB Summary & Suggested Qs' && (
              <div className="bg-white p-6 rounded-lg shadow-lg border border-telecom-primary/10">
                <h2 className="text-xl font-bold mb-4 text-telecom-secondary">DB Summary & Suggested Questions</h2>
                <p className="text-muted-foreground mb-6">
                  Get a summary of your knowledge database content and discover suggested questions for research.
                </p>
                <div className="p-6 bg-telecom-light/20 rounded-md border border-telecom-primary/10">
                  <h3 className="text-sm font-medium text-telecom-secondary mb-3">Database Summary:</h3>
                  <ul className="list-disc pl-5 space-y-2 mb-6 bg-white p-4 rounded-md border border-telecom-primary/10">
                    <li className="text-gray-600">Discussions focused on 5G network architecture and deployment strategies</li>
                    <li className="text-gray-600">Several queries about network slicing implementation</li>
                    <li className="text-gray-600">Technical discussions on telecom protocols and standards</li>
                  </ul>
                  
                  <h3 className="text-sm font-medium text-telecom-secondary mb-3">Suggested Research Questions:</h3>
                  <ul className="space-y-2">
                    {['What are the key differences between NSA and SA 5G deployments?',
                      'How does network slicing benefit IoT applications?',
                      'What security considerations are unique to 5G networks?'].map((question, i) => (
                      <li key={i} className="bg-white p-3 rounded-md border border-telecom-primary/10 flex items-center">
                        <span className="text-gray-700">{question}</span>
                        <Button variant="ghost" className="ml-auto text-xs text-telecom-primary hover:bg-telecom-light/50">
                          Use
                        </Button>
                      </li>
                    ))}
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
