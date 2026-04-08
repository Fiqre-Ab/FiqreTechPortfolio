import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';

/* ---------- animations ---------- */

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-100%); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ---------- styled components ---------- */

const Section = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  animation: ${slideDown} 0.5s ease-out;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 70px;
  background: rgba(8, 8, 25, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(52, 152, 219, 0.15);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 0 1.2rem;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const Logo = styled.img`
  width: 160px;
  height: 60px;
  object-fit: contain;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
`;

const NavList = styled.ul`
  display: flex;
  gap: 6px;
  padding: 0;
  margin: 0;
  list-style: none;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)`
  display: block;
  padding: 8px 16px;
  border-radius: 8px;
  color: ${p => p.$active ? 'white' : '#b0bec5'};
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: ${p => p.$active ? '600' : '400'};
  letter-spacing: 0.3px;
  transition: color 0.2s, background 0.2s;
  position: relative;

  background: ${p => p.$active ? 'rgba(52, 152, 219, 0.15)' : 'transparent'};

  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: ${p => p.$active ? '20px' : '0'};
    height: 2px;
    background: linear-gradient(90deg, #3498db, #da4ea2);
    border-radius: 1px;
    transition: width 0.25s ease;
  }

  &:hover {
    color: white;
    background: rgba(52, 152, 219, 0.1);
    &::after { width: 20px; }
  }
`;

const GamesLink = styled(NavLink)`
  color: ${p => p.$active ? '#61dafb' : '#7ec8f4'};
  background: ${p => p.$active ? 'rgba(97, 218, 251, 0.12)' : 'transparent'};
  border: 1px solid ${p => p.$active ? 'rgba(97, 218, 251, 0.4)' : 'transparent'};

  &:hover {
    background: rgba(97, 218, 251, 0.12);
    border-color: rgba(97, 218, 251, 0.3);
    color: #61dafb;
  }
`;

const HireBtn = styled(Link)`
  padding: 8px 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, #da4ea2, #c23d87);
  color: white;
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 12px rgba(218, 78, 162, 0.3);
  letter-spacing: 0.3px;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(218, 78, 162, 0.5);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HamburgerBtn = styled.button`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 26px;
  height: 18px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    display: block;
    height: 2px;
    width: 100%;
    background: white;
    border-radius: 2px;
    transition: transform 0.3s, opacity 0.3s;

    &:nth-child(1) { transform: ${p => p.$open ? 'translateY(8px) rotate(45deg)' : 'none'}; }
    &:nth-child(2) { opacity: ${p => p.$open ? 0 : 1}; }
    &:nth-child(3) { transform: ${p => p.$open ? 'translateY(-8px) rotate(-45deg)' : 'none'}; }
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  background: rgba(8, 8, 25, 0.97);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(52, 152, 219, 0.15);
  padding: 16px;
  flex-direction: column;
  gap: 4px;
  z-index: 999;

  @media (max-width: 768px) {
    display: ${p => p.$open ? 'flex' : 'none'};
  }
`;

const MobileLink = styled(Link)`
  padding: 12px 16px;
  border-radius: 10px;
  color: ${p => p.$active ? 'white' : '#b0bec5'};
  background: ${p => p.$active ? 'rgba(52, 152, 219, 0.15)' : 'transparent'};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: ${p => p.$active ? '600' : '400'};
  transition: all 0.2s;
  border-left: 3px solid ${p => p.$active ? '#3498db' : 'transparent'};

  &:hover {
    background: rgba(52, 152, 219, 0.1);
    color: white;
  }
`;

const MobileGamesLink = styled(MobileLink)`
  color: ${p => p.$active ? '#61dafb' : '#7ec8f4'};
  background: ${p => p.$active ? 'rgba(97, 218, 251, 0.1)' : 'transparent'};
  border-left-color: ${p => p.$active ? '#61dafb' : 'transparent'};
`;

const MobileDivider = styled.div`
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 8px 0;
`;

const MobileHireBtn = styled(Link)`
  margin-top: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(218,78,162,0.2), rgba(218,78,162,0.1));
  border: 1px solid rgba(218, 78, 162, 0.4);
  color: #f48fb1;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
`;

/* ---------- nav items ---------- */

const NAV_ITEMS = [
  { label: 'Home',      to: '/'          },
  { label: 'About',     to: '/about'     },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Resume',    to: '/resume'    },
  { label: 'Contact',   to: '/contact'   },
];

/* ---------- component ---------- */

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <Section>
      <Container>
        <LogoLink to="/">
          <Logo src="../img/logo.png" alt="Fiqre Logo" />
        </LogoLink>

        <NavList>
          {NAV_ITEMS.map(item => (
            <NavItem key={item.to}>
              <NavLink to={item.to} $active={isActive(item.to)}>
                {item.label}
              </NavLink>
            </NavItem>
          ))}
          <NavItem>
            <GamesLink to="/games" $active={isActive('/games')}>
              🎮 Games
            </GamesLink>
          </NavItem>
        </NavList>

        <RightGroup>
          <HireBtn to="/contact">Hire Me</HireBtn>
          <HamburgerBtn $open={open} onClick={() => setOpen(p => !p)} aria-label="Menu">
            <span /><span /><span />
          </HamburgerBtn>
        </RightGroup>
      </Container>

      <MobileMenu $open={open}>
        {NAV_ITEMS.map(item => (
          <MobileLink key={item.to} to={item.to} $active={isActive(item.to)}>
            {item.label}
          </MobileLink>
        ))}
        <MobileGamesLink to="/games" $active={isActive('/games')}>
          🎮 Games
        </MobileGamesLink>
        <MobileDivider />
        <MobileHireBtn to="/contact">✉ Hire Me</MobileHireBtn>
      </MobileMenu>
    </Section>
  );
}
