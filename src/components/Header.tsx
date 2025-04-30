
import { Satellite } from 'lucide-react';

const Header = () => {
  return (
    <div className="header-banner">
      <div className="container mx-auto">
        <div className="flex items-center justify-center mb-2">
          <Satellite className="w-10 h-10 mr-3" />
          <h1 className="text-4xl font-bold">Telecom Architect Expert Agent</h1>
        </div>
        <p className="text-xl">Empowering Deep Telecom Research and Advanced Reasoning</p>
      </div>
    </div>
  );
};

export default Header;
