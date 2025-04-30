import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import MobileMenu from '../components/layout/MobileMenu'

function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Handle scroll for header appearance change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isScrolled={isScrolled} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        setIsOpen={setIsMobileMenuOpen} 
      />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}

export default MainLayout