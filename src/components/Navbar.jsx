"use client"

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {
  FiBriefcase,
  FiMenu,
  FiPackage,
  FiSettings,
  FiUser,
  FiUsers
} from 'react-icons/fi';
import { IoMdArrowDropleft } from 'react-icons/io';
import { RiArrowDropDownFill, RiLogoutCircleLine } from 'react-icons/ri';

const defaultState = {};

const Navbar = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const profileRef = useRef(null);
  const router = useRouter();
  const location = usePathname();
  const { data: session, status } = useSession();

  const isUserLoggedIn = status === 'authenticated';
  const currentUser = session?.user;

  const currentPath = location;
  const isActive = (path) => currentPath === path || currentPath.startsWith(path);

  const getUserRole = () => {
    if (!currentUser) return 'user';
    if ([currentUser.role, currentUser.userType, currentUser.type].includes('admin')) return 'admin';
    if ([currentUser.role, currentUser.userType, currentUser.type].includes('vendor')) return 'vendor';
    return 'user';
  };

  const getDisplayName = () => {
    const role = getUserRole();
    if (!currentUser) return 'User';
    if (role === 'admin') return (currentUser.name || currentUser.username || currentUser.firstName || currentUser.email?.split('@')[0] || 'Admin').substring(0, 10);
    if (role === 'vendor') return (currentUser.businessName || currentUser.name || currentUser.username || 'Vendor').substring(0, 10);
    return (currentUser.name || currentUser.firstName || currentUser.username || 'User').substring(0, 10);
  };

  const handleLogout = async () => {
    setProfileDropdown(false);
    setShowOffcanvas(false);
    await signOut({ callbackUrl: '/' });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setShowOffcanvas(false);
    setProfileDropdown(false);
  };

  const renderLink = (to, icon, label) => (
    <Link
      href={to}
      onClick={handleLinkClick}
      className={`d-block py-1 mb-2 text-decoration-none d-flex align-items-center gap-2 rounded px-2 ${isActive(to) ? 'text-dark fw-semibold' : 'text-black'
        } hover-bg-light`}
      style={{ transition: 'background-color 0.2s ease-in-out' }}
    >
      {icon} {label}
    </Link>
  );

  const renderProfileLinks = () => {
    const role = getUserRole();

    return (
      <div className="py-2">
        {renderLink(`/${role}/dashboard`, <FiUser size={16} />, 'Dashboard')}


        {role === 'user' && (
          <>
            {renderLink(`/${role}/profile`, <FiSettings size={16} />, 'Profile')}
            {renderLink('booking', <FiPackage size={16} />, 'Bookings')}
          </>
        )}
        {role === 'vendor' && (
          <>
            {renderLink(`/${role}/edit_profile`, <FiSettings size={16} />, 'Profile')}
            {renderLink('bookings', <FiPackage size={16} />, 'Bookings')}
          </>
        )}
        {role === 'admin' && (
          <>
            {renderLink('user_management', <FiUsers size={16} />, 'Users')}
            {renderLink('vendor_management', <FiBriefcase size={16} />, 'Vendors')}
          </>
        )}

        <hr className="my-2" />

        <button
          onClick={handleLogout}
          className="w-100 text-start text-danger border-0 bg-transparent d-flex align-items-center gap-2 px-2 py-1"
        >
          <RiLogoutCircleLine /> Logout
        </button>
      </div>
    );
  };

  const renderMobileLinks = () => {
    const role = getUserRole();

    return (
      <div className="space-y-3">
        {renderLink('/vendors', <FiBriefcase size={16} />, 'Vendors')}
        {renderLink('/venue', <FiUser size={16} />, 'Venues')}
        {renderLink('/blog', <FiPackage size={16} />, 'Blogs')}
        {renderLink('/corporate', <FiPackage size={16} />, 'Corporate')}
        {renderLink('/about', <FiPackage size={16} />, 'About')}
        <hr />

        {!isUserLoggedIn ? (
          <>
            <Link href="/login" onClick={handleLinkClick} className="btn border w-100 mb-2">
              Login
            </Link>
            <Link
              href="/signup"
              className="btn text-white w-100"
              style={{ backgroundColor: '#0F4C81' }}
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <button
              onClick={() => setMobileDropdown(!mobileDropdown)}
              className="btn btn-secondary w-100 d-flex justify-content-between align-items-center d-lg-none mb-2"
            >
              {getDisplayName()}
              <span>{mobileDropdown ? <RiArrowDropDownFill /> : <IoMdArrowDropleft />}</span>
            </button>

            {mobileDropdown && (
              <ul className="mt-2 ps-0">
                {renderLink(`/${role}/dashboard`, <FiUser size={16} />, 'Dashboard')}
                {renderLink(`/${role}/profile`, <FiSettings size={16} />, 'Profile')}

                {role === 'user' && (
                  <>

                    {renderLink('booking', <FiPackage size={16} />, 'Bookings')}
                  </>
                )}
                {role === 'vendor' && (
                  <>
                    {renderLink('/vendor/bookings', <FiPackage size={16} />, 'Bookings')}
                  </>
                )}
                {role === 'admin' && (
                  <>
                    {renderLink('user_management', <FiUsers size={16} />, 'Users')}
                    {renderLink('vendor_management', <FiBriefcase size={16} />, 'Vendors')}
                    {renderLink('/admin/bookings', <FiPackage size={16} />, 'All Bookings')}
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-100 text-start text-danger mt-2 border-0 bg-transparent d-flex align-items-center gap-1"
                >
                  <RiLogoutCircleLine className='mx-2' /> Logout
                </button>
              </ul>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white px-2 py-2 shadow-sm w-100">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link href="/" className="d-flex align-items-center">
          <img src={"/Images/My BestVenues.png"} alt="logo" className="h-14" loading="lazy" />
        </Link>

        <div className="d-flex d-lg-none">
          <Button
            variant="outline-secondary"
            className="me-2 mb-2 border-0"
            onClick={() => setShowOffcanvas(true)}
            aria-label="Open menu"
          >
            <FiMenu className="" size={25} />
          </Button>
        </div>
        <nav className="d-none d-lg-flex align-items-center gap-4">
          {renderLink('/vendors', 'Vendors')}
          {renderLink('/venue', 'Venues')}
          {renderLink('/blog', 'Blogs')}
          {renderLink('/corporate', 'Corporate')}
          {renderLink('/about', 'About')}

          {!isUserLoggedIn ? (
            <div style={{ marginTop: '-2px' }}>
              <Link href="/login" className="text-black text-decoration-none">Login</Link>
              <Link href="/signup" className="btn text-white mx-3" style={{ backgroundColor: '#0F4C81' }}>Sign Up</Link>
            </div>
          ) : (
            <div className="position-relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="btn d-flex align-items-center gap-2"
                style={{ backgroundColor: '#09365d', color: 'white' }}
              >
                <FiUser size={16} />
                {getDisplayName()}
                <RiArrowDropDownFill size={20} />
              </button>

              {profileDropdown && (
                <div
                  className="position-absolute end-0 mt-2 bg-white rounded shadow border"
                  style={{
                    zIndex: 1000,
                    minWidth: '220px',
                  }}
                >
                  {renderProfileLinks()}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      <Offcanvas
        show={showOffcanvas}
        onHide={() => setShowOffcanvas(false)}
        placement="start"
        style={{ width: '60vw' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src={"/Images/My BestVenues.png"} alt="logo" className="h-10" loading="lazy" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{renderMobileLinks()}</Offcanvas.Body>
      </Offcanvas>
    </header>
  );
};

export default Navbar;
