'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Building2,
  CheckCircle,
  Database,
  Globe,
  Grid3X3,
  Home,
  Hospital,
  Layout,
  Lock,
  Plug,
  School,
  ShoppingBag,
  Utensils,
  Users,
} from "lucide-react"
import HomeNav from "@/components/common/home-nav"
import HomeFooter from "@/components/common/home-footer"

export default function LandingPage() {

  return (
    <div className="flex min-h-screen flex-col">
      <HomeNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Build Your Business CMS in Minutes
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Choose from industry-specific modules, select your template, and launch your custom CMS on your own
                    subdomain.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline">
                    View Demo
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[600px] aspect-video overflow-hidden rounded-xl border shadow-xl">
                  <Image
                    src="/placeholder.svg?height=600&width=1200"
                    alt="FlexiCMS Dashboard"
                    width={600}
                    height={300}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose FlexiCMS?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to build and manage your business content management system.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Database className="h-6 w-6 text-primary" />
                  <CardTitle>Multi-Tenant Architecture</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Each business gets an isolated database for maximum security and performance.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Layout className="h-6 w-6 text-primary" />
                  <CardTitle>Industry-Specific Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Healthcare, Education, Real Estate & more - tailored to your industry needs.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  <CardTitle>Custom Subdomains</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get your own branded subdomain (yourname.flexicms.com) with just a few clicks.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Grid3X3 className="h-6 w-6 text-primary" />
                  <CardTitle>Template Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Choose from dozens of professional, customizable templates for any industry.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Lock className="h-6 w-6 text-primary" />
                  <CardTitle>Secure & Scalable</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Enterprise-grade security with automatic scaling to handle your growth.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Plug className="h-6 w-6 text-primary" />
                  <CardTitle>Easy Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Seamlessly connect with WhatsApp, SMS, Email automation and more.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get Started in 3 Simple Steps</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our streamlined process gets you up and running quickly.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              <div className="relative flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  1
                </div>
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Sign Up & Choose</h3>
                <p className="text-center text-muted-foreground">
                  Register and select your industry modules to get started.
                </p>
              </div>
              <div className="relative flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  2
                </div>
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Layout className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Customize</h3>
                <p className="text-center text-muted-foreground">Pick your template and configure your settings.</p>
              </div>
              <div className="relative flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
                <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  3
                </div>
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Launch</h3>
                <p className="text-center text-muted-foreground">Your CMS is ready on your custom subdomain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Modules Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Industries
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Built for Every Industry</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Specialized modules designed for your specific industry needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Hospital className="h-6 w-6 text-primary" />
                  <CardTitle>Healthcare</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Patient management, appointments, medical records, and billing.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <School className="h-6 w-6 text-primary" />
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Student portal, grade tracking, course management, and scheduling.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Home className="h-6 w-6 text-primary" />
                  <CardTitle>Real Estate</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Property listings, client management, document handling, and lead tracking.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <CardTitle>Professional Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Case management, client portals, time tracking, and billing.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  <CardTitle>Retail</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Inventory management, e-commerce integration, and customer profiles.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Utensils className="h-6 w-6 text-primary" />
                  <CardTitle>Restaurant</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Menu management, online ordering, reservations, and kitchen display.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't just take our word for it. See what our customers have to say.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Testimonial Avatar"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-muted-foreground">
                        "FlexiCMS transformed our healthcare practice. The patient management module saved us countless
                        hours of administrative work."
                      </p>
                      <div>
                        <h4 className="font-semibold">Dr. Sarah Johnson</h4>
                        <p className="text-sm text-muted-foreground">MediCare Clinic</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Testimonial Avatar"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-muted-foreground">
                        "Setting up our real estate portal took just days instead of months. The custom subdomain
                        feature gives us a professional online presence."
                      </p>
                      <div>
                        <h4 className="font-semibold">Michael Rodriguez</h4>
                        <p className="text-sm text-muted-foreground">Prime Properties</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Testimonial Avatar"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-2 text-center">
                      <p className="text-muted-foreground">
                        "The education modules helped us create a complete student portal. Parents love the transparency
                        and our staff saved hours on administration."
                      </p>
                      <div>
                        <h4 className="font-semibold">Jennifer Lee</h4>
                        <p className="text-sm text-muted-foreground">Bright Future Academy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-32 bg-muted rounded flex items-center justify-center">
                  <span className="text-muted-foreground font-medium">Company {i}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that's right for your business.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Starter</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                    $29<span className="ml-1 text-xl font-medium text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {["1 Industry Module", "5 Users", "10GB Storage", "Custom Subdomain", "Email Support"].map(
                      (feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full">Start Free Trial</Button>
                </div>
              </Card>
              <Card className="flex flex-col border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Professional</CardTitle>
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-primary text-primary-foreground">
                      Popular
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                    $79<span className="ml-1 text-xl font-medium text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {[
                      "3 Industry Modules",
                      "20 Users",
                      "50GB Storage",
                      "Custom Subdomain",
                      "Priority Support",
                      "WhatsApp Integration",
                      "Advanced Analytics",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Start Free Trial
                  </Button>
                </div>
              </Card>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold">
                    Custom<span className="ml-1 text-xl font-medium text-muted-foreground"></span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {[
                      "Unlimited Modules",
                      "Unlimited Users",
                      "500GB Storage",
                      "Custom Domain",
                      "24/7 Support",
                      "All Integrations",
                      "Advanced Security",
                      "Dedicated Account Manager",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Build Your Custom CMS?
                </h2>
                <p className="mx-auto max-w-[700px] md:text-xl/relaxed">
                  Start your free 14-day trial today. No credit card required.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className=" border-white hover:bg-white/10 hover:text-white text-blue-600 ">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </div>
  )
}
