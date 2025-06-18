import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Twitter, Facebook, Instagram } from 'lucide-react'; // Example icons

const Footer: React.FC = () => {
  console.log("Rendering Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground border-t mt-12">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link to="/" className="text-xl font-semibold text-primary flex items-center mb-2">
              <Plane className="h-6 w-6 mr-2 text-blue-600" />
              FlightBooker
            </Link>
            <p className="text-sm">Your journey starts here. Find the best flights seamlessly.</p>
          </div>
          <div>
            <h3 className="text-md font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold text-foreground mb-3">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t pt-6 text-center text-sm">
          <p>&copy; {currentYear} FlightBooker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;