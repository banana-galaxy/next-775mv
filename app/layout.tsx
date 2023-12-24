'use client'
//import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState, CSSProperties, useEffect } from 'react'
import { Url } from 'next/dist/shared/lib/router/router'
import { transform } from 'typescript'
import { useAtom } from 'jotai'
import { cartAtom, sessionAtom } from './../utils/atoms'
import cartIcon from './../public/cart.png'
import pfpIcon from './../public/pfp.png'
import Image from 'next/image'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: '775mv',
//   description: 'Generated by create next app',
// }

function NavBar({ children, cartAmount }: { children: React.ReactNode, cartAmount: number }) {
  return (
    <nav className='sticky z-50 top-0 left-0 right-0 shadow border-b-2 bg-coolgraydark border-b-coolgraylight text-amber font-bold'>
      <div className='relative mx-auto w-[1280px] flex flex-row justify-center items-center'>
        {children}
        <Link href={'/account/cart'} className='interactable group absolute right-[31px]'>
          <div className='relative px-[8px] py-[11px]'>
            <Image src={cartIcon} width={20} height={10} alt={"cart icon"} />
            {cartAmount > 0 ? <span className='absolute bottom-1 right-0 px-1 rounded-xl bg-lightaccentbg text-sm text-coolgraydark'>{cartAmount}</span> : <span />}
            <span className='absolute h-0.5 w-0 -mb-0.5 group-hover:w-full transition-all duration-125 bottom-0 inset-x-1/2 group-hover:left-0 bg-black dark:bg-ochre' />
          </div>
        </Link>
        <Link href={'/account/data'} className='interactable group absolute right-0'>
          <div className='px-[8px] py-[10.5px]'>
            <Image src={pfpIcon} width={15} height={7} alt={"pfp icon"} />
            <span className='absolute h-0.5 w-0 -mb-0.5 group-hover:w-full transition-all duration-125 bottom-0 inset-x-1/2 group-hover:left-0 bg-black dark:bg-ochre' />
          </div>
        </Link>
      </div>
    </nav>
  );
}

function NavButton({ children, href, expanded, toggle }: { children: React.ReactNode, href: Url }) {

  function closeMenu() {
    if (expanded) {
      toggle()
    }
  }

  return (
    <Link onClick={closeMenu} href={href} className='interactable group relative px-2 py-2'>
      {children}
      <span className='absolute h-0.5 w-0 -mb-0.5 group-hover:w-full transition-all duration-125 bottom-0 inset-x-1/2 group-hover:left-0 bg-black dark:bg-ochre'></span>
    </Link>
  );
}

function NavMenu({ children, value, expanded, toggle }: { children: React.ReactNode, value: string }) {

  children = React.Children.map(children, el => {
    return React.cloneElement(el, { toggle: toggle, expanded: expanded })
  })

  return (
    <div>
      <button onClick={toggle} className='interactable group relative px-2 py-2'>
        {value}
        <span className='absolute h-0.5 w-0 -mb-0.5 group-hover:w-full transition-all duration-125 bottom-0 inset-x-1/2 group-hover:left-0 bg-black dark:bg-ochre'></span>
      </button>
      {
        expanded ?
          <div className='absolute transition-all duration-300 border-2 border-ochre rounded-b-lg w-[80.5px] max-h-[200px] bg-coolgraydark font-normal overflow-hidden'>
            {children}
          </div>
          :
          <div className='absolute transition-all duration-300 bg-coolgraydark w-[80.5px] max-h-[0px]'>
            {children}
          </div>
      }
    </div>
  )
}

function NavMenuButton({ children, href, toggle, expanded }: { children: React.ReactNode, href: Url, expanded: boolean }) {

  let linkClass = ""

  if (expanded) {
    linkClass = "group relative px-2 py-2 block w-full hover:bg-coolgraymid text-ochre hover:text-amber hover:font-bold"
  } else {
    linkClass = "group relative px-2 py-2 invisible"
  }

  return (
    <Link onClick={toggle} href={href} className={linkClass}>
      {/* <span className='absolute h-0 w-0.5 -ml-0.5 group-hover:h-full left-0 inset-y-1/2 group-hover:top-0 bg-amber'></span> */}
      {children}
      {/* <span className='absolute h-0 w-0.5 -mr-0.5 group-hover:h-full right-0 inset-y-1/2 group-hover:top-0 bg-amber'></span> */}
    </Link>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-[1000px] grid grid-cols-[auto_1280px_auto]'>
      <div className='col-start-2 col-end-3'>
        {children}
      </div>
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear()
  return (
    <div className='static bottom-0 left-0 right-0 text-amber border-t border-t-ochre'>
      <div className='flex flex-row justify-center p-3'>
        <p>Copyright © {year} 775mv All Rights Reserved.</p>
        <p className='px-2'>|</p>
        <Link href="/terms-and-conditions" className='pr-2 underline'>Term & Conditions</Link>
        <Link href="/privacy-policy" className='underline'>Privacy Policy</Link>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  const [cart, setCart] = useAtom(cartAtom)
  const [sessionState, setSessionState] = useAtom(sessionAtom)
  let sessionJSX = <></>

  const [expanded, setExpanded] = useState(false);

  function toggle() {
    setExpanded(!expanded)
  }

  useEffect(() => {
    fetch('/api/cart').then(e => e.json()).then(e => {
      let amount = 0
      for (let i = 0; i < e.length; i++) {
        amount = amount + Number(e[i]['amount'])
      }
      setCart(amount)
    })

    fetch('/api/check-loggedin').then(e => e.json()).then(e => {
      setSessionState(e['result'] ? "loggedin" : "unknown")
      if (e['result']) {
        fetch('/api/keep-alive')
        setInterval(() => {fetch('/api/keep-alive')}, 30000)
      }
    })
    // fetch('/api/check-loggedin').then(e => {console.log(e.json())})
  }, [])

  const mouseRef = useRef(null);
  const [mouseState, setMouseState] = useState('translate(0px, 0px)');
  const [mouseOpacity, setMouseOpacity] = useState(1)

  //const mouse = document.getElementById('mouse');
  //console.log(mouse)

  function handleMouseMove(e) {
    //console.log(e.target.closest(".interactable"))
    let scale = ""
    const interactable = e.target.closest(".interactable")
    const interacting = (interactable != null);
    if (interacting) {
      scale = "1.5"
      setMouseOpacity(0.6)
    } else {
      scale = "1"
      setMouseOpacity(1)
    }
    setMouseState('translate(' + (e.clientX - 10) + 'px' + ', ' + (e.clientY - 10) + 'px)' + ' scale(' + scale + ')')
  }

  function handleMouseLeave(e) {
    setMouseOpacity(0)
  }

  function handleMouseEnter(e) {
    setMouseOpacity(1)
  }

  const currentRoute = usePathname()
  return (
    <html lang="en" className='min-h-screen' onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      <body className='bg-lightbg dark:bg-coolgraymid font-hero'>
        {/* <div ref={mouseRef} className='mouse' id='mouse' style={{transform: mouseState, opacity: mouseOpacity}}/> */}
        <NavBar cartAmount={cart}>
          <NavButton href={'/products'} expanded={expanded} toggle={toggle}>Products</NavButton>
          <NavButton href={'/about'} expanded={expanded} toggle={toggle}>About</NavButton>
          <NavMenu value='Account' toggle={toggle} expanded={expanded}>
            <NavMenuButton href={'/account/cart'}>Cart</NavMenuButton>
            <NavMenuButton href={'/account/orders'}>Orders</NavMenuButton>
            <NavMenuButton href={'/account/settings'}>Settings</NavMenuButton>
            {
              sessionState == "loggedin"
              ?
                <NavMenuButton href={'/account/logout'}>Logout</NavMenuButton>
              :
                <NavMenuButton href={'/account/login'}>Login</NavMenuButton>
            }
            {
              sessionState != "loggedin"
              ?
              <NavMenuButton href={'/account/register'}>Sign up</NavMenuButton>
              :
              <></>
            }
            {/* {sessionJSX} */}
          </NavMenu>
        </NavBar>
        <Body>
          {children}
        </Body>
        <Footer />
      </body>
    </html>
  )
}
