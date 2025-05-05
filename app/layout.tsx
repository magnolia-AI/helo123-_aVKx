import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import { Button } from '@/components/ui/button'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { MobileNav } from '@/components/mobile-nav'


export const metadata: Metadata = {
  title: 'Next.js Template',
  description: 'A customizable template built with Next.js and Tailwind CSS',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full flex flex-col antialiased">
        <ThemeProvider defaultTheme="light" attribute="class">
          {/* 
            TEMPLATE SECTION: Header
            This is a template header - replace with your own navigation
            Consider adding a logo, navigation links, theme toggle, etc.
          */}
          <header className="border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">

                {/* 
                  TEMPLATE SECTION: Mobile Navigation
                  This is a template mobile navigation, uncomment to use
                  Remember to update the mobile navigation in the mobile-nav.tsx file
                */}
                {/* <MobileNav /> */}
                <div className="font-semibold">Template Logo</div>
              </div>
              {/* <nav className="hidden md:flex gap-6">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Link 1</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Link 2</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Link 3</a>
              </nav> */}
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="outline" size="sm">Template Button</Button>
              </div>
            </div>
          </header>

          {/* 
            TEMPLATE NOTE:
            This is where your page content will be rendered.
            The layout wraps all pages with consistent header and footer.
          */}
          <main className="flex-1">
            {children}
          </main>

          {/* 
            TEMPLATE SECTION: Footer
            Basic footer - replace with your own design
            Consider adding navigation, social links, etc.
          */}

          <footer className="border-t">
            <div className="container mx-auto px-4 py-8">

              {/* 
                TEMPLATE SECTION: Footer Content
                This is a template footer content, uncomment to use
                If its not commented out, add a border-t to the copywrite section
              */}
              {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-semibold mb-3">Template Brand</h3>
                  <p className="text-sm text-muted-foreground">
                    A brief description of your company or project. Replace this with your own content.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Links</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Link 1</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Link 2</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Link 3</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Resources</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Resource 1</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Resource 2</a></li>
                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Resource 3</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Contact</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="text-muted-foreground">Email: example@template.com</li>
                    <li className="text-muted-foreground">Phone: (123) 456-7890</li>
                    <li className="text-muted-foreground">Address: Template Street</li>
                  </ul>
                </div>
              </div> */}

              <div className="mt-8 pt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  © 2024 Template Brand. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}