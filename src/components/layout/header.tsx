"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Phone, Smartphone, Wrench } from "lucide-react"

const PHONE_BRANDS = [
  { name: "iPhone", href: "/book?category=phone&brand=apple-phone", image: "/images/iphone.png" },
  { name: "Samsung", href: "/book?category=phone&brand=samsung-phone", image: "/images/samsung-phone.png" },
  { name: "Google", href: "/book?category=phone&brand=google-phone", image: "/images/google-pixel.png" },
  { name: "Motorola", href: "/book?category=phone&brand=motorola-phone", image: "/images/motorola.png" },
] as const

const TECH_DEVICES = [
  { name: "iPad", href: "/book?category=tablet&brand=apple-tablet", image: "/images/ipad.png" },
  { name: "Tablet", href: "/book?category=tablet", image: "/images/samsung-tablet.png" },
  { name: "Computer", href: "/book?category=computer", image: "/images/computer.png" },
] as const

type DropdownId = "phone" | "tech" | null

export function Header() {
  const [open, setOpen] = useState<DropdownId>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function toggle(id: DropdownId) {
    setOpen((prev) => (prev === id ? null : id))
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-light bg-surface/80 backdrop-blur-md">
      <nav ref={navRef} className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center" onClick={() => setOpen(null)}>
          <Image src="/images/logo.png" alt="GothTech" width={40} height={40} className="size-10 -mr-2" />
          <span className="text-xl font-semibold tracking-tight mt-1.5">othTech</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-6">
          <div className="hidden sm:flex sm:items-center sm:gap-1">
            <NavDropdown
              label="Phone Repairs"
              isOpen={open === "phone"}
              onToggle={() => toggle("phone")}
            >
              <DropdownPanel
                icon={<Smartphone className="size-6" />}
                title="Your phone is in good hands"
                subtitle="Free diagnostics, quality repairs, and low prices."
                items={PHONE_BRANDS}
                allHref="/book?category=phone"
                allLabel="All repair options"
                onNavigate={() => setOpen(null)}
              />
            </NavDropdown>

            <NavDropdown
              label="Tech Repairs"
              isOpen={open === "tech"}
              onToggle={() => toggle("tech")}
            >
              <DropdownPanel
                icon={<Wrench className="size-6" />}
                title="Expert fixes for your favorite tech"
                subtitle="We fix anything with a power button."
                items={TECH_DEVICES}
                allHref="/book"
                allLabel="All repair options"
                onNavigate={() => setOpen(null)}
              />
            </NavDropdown>
          </div>

          <a
            href="tel:+16129878107"
            className="hidden items-center gap-1.5 text-sm font-bold text-accent hover:text-accent-hover whitespace-nowrap sm:flex"
          >
            <Phone className="size-4" />
            (612)-987-8107
          </a>
          <div className="flex items-center gap-2">
            <a
              href="tel:+16129878107"
              aria-label="Call GothTech"
              className="flex items-center justify-center rounded-lg border border-border-light p-2.5 text-accent hover:bg-surface-secondary sm:hidden"
            >
              <Phone className="size-5" />
            </a>
            <Link
              href="/#location"
              className="hidden rounded-lg border border-border-light px-5 py-2.5 text-sm font-medium hover:bg-surface-secondary whitespace-nowrap sm:block"
              onClick={() => setOpen(null)}
            >
              Find the Store
            </Link>
            <Link
              href="/book"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-hover whitespace-nowrap"
              onClick={() => setOpen(null)}
            >
              Start a Repair
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

function NavDropdown({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-text-primary"
      >
        {label}
        <ChevronDown className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute left-1/2 top-full mt-2 w-[680px] -translate-x-1/2 rounded-2xl border border-border-light bg-surface p-8 shadow-lg">
          {children}
        </div>
      )}
    </div>
  )
}

function DropdownPanel({
  icon,
  title,
  subtitle,
  items,
  allHref,
  allLabel,
  onNavigate,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  items: ReadonlyArray<{ name: string; href: string; image: string }>
  allHref: string
  allLabel: string
  onNavigate: () => void
}) {
  return (
    <div className="flex gap-8">
      <div className="w-[180px] shrink-0">
        <div className="text-text-tertiary">{icon}</div>
        <p className="mt-3 font-semibold">{title}</p>
        <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-4">
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className="flex flex-col items-center gap-3 rounded-xl border border-border-light p-4 hover:border-accent hover:bg-surface-secondary"
          >
            <Image src={item.image} alt="" width={56} height={56} className="size-14 object-contain" />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
        <Link
          href={allHref}
          onClick={onNavigate}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border-light p-4 hover:border-accent hover:bg-surface-secondary"
        >
          <span className="flex size-10 items-center justify-center rounded-full border border-border-light text-text-tertiary">
            &rarr;
          </span>
          <span className="text-sm font-medium">{allLabel}</span>
        </Link>
      </div>
    </div>
  )
}
