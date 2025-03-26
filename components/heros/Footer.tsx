import Link from 'next/link'
import { Eyebase } from '../global/Logo'

const FOOTER_LINKS = {
  product: [
    { title: 'Features', href: 'features' },
    { title: 'Pricing', href: 'pricing' },
    { title: 'Integrations', href: 'integrations' },
    { title: 'Marketplace', href: 'marketplace' },
    { title: 'Changelog', href: 'changelog' }
  ],
  company: [
    { title: 'About Us', href: 'about' },
    { title: 'Careers', href: 'careers' },
    { title: 'Press', href: 'press' },
    { title: 'Leadership', href: 'leadership' },
    { title: 'Investors', href: 'investors' }
  ],
  resources: [
    { title: 'Documentation', href: 'docs' },
    { title: 'Blog', href: 'blog' },
    { title: 'Guides', href: 'guides' },
    { title: 'Community', href: 'community' }
  ],
  legal: [
    { title: 'Privacy Policy', href: 'privacy' },
    { title: 'Terms of Service', href: 'terms' },
    { title: 'Cookie Policy', href: 'cookies' },
  ],
  contact: [
    { title: 'Contact Us', href: 'contact' },
    { title: 'Support', href: 'support' },
    { title: 'Help Center', href: 'help' }
  ]
}

const FooterLinkSection = ({ title, links }: { title: string, links: { title: string, href: string }[] }) => (
  <div>
    <h4 className="font-semibold mb-3 text-foreground">{title}</h4>
    <div className="space-y-1 flex flex-col">
      {links.map(({ title, href }) => (
        <Link
          key={href}
          href={`${process.env.NEXT_PUBLIC_DOCS_URL}/${href}`}
          className="text-sm text-foreground/60 hover:text-foreground"
        >
          {title}
        </Link>
      ))}
    </div>
  </div>
)

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className='flex justify-between flex-col lg:flex-row'>
          <div className="col-span-1">
            <Eyebase size="sm" haveText={true} isMove={true} isBlur={false} />
            <p className="text-sm text-foreground/70 max-w-md">
              Eyebase is your all-in-one Backend-as-a-Service solution.
            </p>
          </div>
          <div className="flex flex-wrap justify-between flex-1 max-w-2xl">
            <FooterLinkSection title="Product" links={FOOTER_LINKS.product} />
            <FooterLinkSection title="Company" links={FOOTER_LINKS.company} />
            <FooterLinkSection title="Resources" links={FOOTER_LINKS.resources} />
            <FooterLinkSection title="Legal" links={FOOTER_LINKS.legal} />
            <FooterLinkSection title="Contact" links={FOOTER_LINKS.contact} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-end items-center mt-10 gap-10">
          <p className="text-sm text-foreground/60">
            © {currentYear} Eyebase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer