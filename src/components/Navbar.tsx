
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.nav className={cn("fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 w-full bg-[hsl(var(--footer))] shadow-lg")} initial={{
      opacity: 1,
      y: 0
    }} animate={{
      opacity: 1,
      y: 0
    }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/eed53564-63d3-42ef-ba27-84f9b10a41b0.png" alt="Gen AI Global Logo" className="h-8 w-auto md:h-10" />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu className="text-[hsl(var(--primary-foreground))]">
              <NavigationMenuList>
                {[
                  { to: '/', label: 'Home' },
                  { to: '/about', label: 'About Us' },
                  { to: '/community', label: 'Community' },
                ].map((item) => (
                  <NavigationMenuItem key={item.to}>
                    <NavigationMenuLink
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-transparent",
                        isActive(item.to)
                          ? "text-[hsl(var(--accent))] underline underline-offset-4"
                          : "text-[hsl(var(--primary-foreground))]"
                      )}
                    >
                      <Link to={item.to} aria-current={isActive(item.to) ? 'page' : undefined}>
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="inline-flex items-center p-2 focus:outline-none text-[hsl(var(--footer-foreground))] focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(var(--primary))]">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn("md:hidden transition-all duration-300 overflow-hidden w-full", isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0")}> 
        <div className="px-3 pt-2 pb-3 space-y-1 shadow-sm overflow-y-auto max-h-screen bg-[hsl(var(--footer))]"> 
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About Us' },
            { to: '/community', label: 'Community' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-current={isActive(item.to) ? 'page' : undefined}
              className={cn(
                "block px-3 py-1.5 rounded-md text-sm",
                isActive(item.to) ? "text-[hsl(var(--accent))] underline underline-offset-4 font-semibold" : "text-[hsl(var(--footer-foreground))]"
              )}
              onClick={() => { setIsMenuOpen(false); window.scrollTo(0,0); }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
