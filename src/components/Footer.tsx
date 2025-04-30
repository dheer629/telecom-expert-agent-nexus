
import { Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <div className="custom-footer">
      <div className="container mx-auto flex items-center justify-center space-x-2">
        <span>Developed by <strong>Dheeraj Vishwakarma</strong></span>
        <span>|</span>
        <a 
          href="https://www.linkedin.com/in/dheeraj-vishwakarma-61350918/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center hover:text-blue-300 transition-colors"
        >
          <Linkedin className="w-4 h-4 mr-1" />
          LinkedIn Profile
        </a>
      </div>
    </div>
  );
};

export default Footer;
