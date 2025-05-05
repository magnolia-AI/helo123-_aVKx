'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { toast } = useToast()

  const showToast = () => {
    toast({
      title: "Template Toast",
      description: "This is a sample toast notification - customize it!",
    })
  }

  return (
    <div className="min-h-full">
      {/* 
        TEMPLATE SECTION: Hero
        This is a template hero section - replace with your own content
        Feel free to change layout, styling, and content completely
      */}
      <section className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">
            Template Starter
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-[600px] mx-auto">
            This is a customizable template. Replace all content with your own using the chat interface.
          </p>
          <div className="mt-12 flex gap-4 justify-center">
            <Button size="lg" className="px-8">Sample Button</Button>
            <Button size="lg" variant="outline" className="px-8" onClick={showToast}>
              Show Toast
            </Button>
          </div>
        </div>
      </section>

      {/* 
        TEMPLATE SECTION: Features
        This demonstrates a card layout - replace with your own content
        Consider different layouts like grids, lists, or custom components
      */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Sample Card 1</h3>
              <p className="text-muted-foreground leading-relaxed">
                This is placeholder content. Replace with your own text, images, or components.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Sample Card 2</h3>
              <p className="text-muted-foreground leading-relaxed">
                This template is fully customizable. Feel free to add, remove, or modify any elements.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3">Sample Card 3</h3>
              <p className="text-muted-foreground leading-relaxed">
                Use the chat interface to transform this template into your unique design.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 
        TEMPLATE SECTION: Call to Action
        This is a simple CTA section - customize or replace as needed
      */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-6">
            Template CTA Section
          </h2>
          <p className="text-muted-foreground mb-8">
            This is a template call-to-action section. Replace with your own content and styling.
          </p>
          <Button variant="outline" className="px-8">
            Sample CTA
          </Button>
        </div>
      </section>
    </div>
  )
}