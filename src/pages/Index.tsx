import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Brain, Heart, ChevronRight, Users, FileText, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-transparency.jpg";
import categoriesImage from "@/assets/product-categories.jpg";

const productCategories = [
  { id: "food", name: "Food & Beverages", icon: "🍎", count: "500+ products" },
  { id: "personal-care", name: "Personal Care", icon: "🧴", count: "300+ products" },
  { id: "electronics", name: "Electronics", icon: "📱", count: "200+ products" },
  { id: "clothing", name: "Clothing & Textiles", icon: "👕", count: "400+ products" },
  { id: "household", name: "Household Items", icon: "🏠", count: "250+ products" },
  { id: "automotive", name: "Automotive", icon: "🚗", count: "150+ products" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">TransparencyHub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Button asChild variant="professional">
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-accent/20 text-accent-foreground border-accent/30">
                  AI-Powered Transparency
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Build Trust Through
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> Product Transparency</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Empower consumers and businesses with intelligent, adaptive transparency reporting 
                  that builds trust through ethical product information.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="hero" asChild>
                  <Link to="/submit" className="group">
                    Submit Product Info
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/auth">View Reports</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>500+ Companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>10k+ Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>99% Accurate</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-3xl opacity-20"></div>
              <img 
                src={heroImage} 
                alt="Product transparency dashboard" 
                className="relative rounded-2xl shadow-glow w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Intelligent Transparency Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform adapts to your product category, generating relevant questions 
              and creating comprehensive transparency reports.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Dynamic question generation based on product type and previous responses, 
                  ensuring comprehensive data collection.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Health-First Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Promoting informed choices for consumer wellbeing through transparent, 
                  ethical product reporting and data presentation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure & Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Enterprise-grade security with GDPR compliance, role-based access control, 
                  and encrypted data storage for peace of mind.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Comprehensive Product Coverage
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our platform supports all major product categories with specialized 
                  question sets tailored to industry requirements and regulations.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {productCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-medium transition-all cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{category.count}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="relative">
              <img 
                src={categoriesImage} 
                alt="Product categories overview" 
                className="rounded-2xl shadow-soft w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Ready to Build Trust?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of companies using our platform to create transparent, 
              trustworthy product information that empowers consumer decisions.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="hero" asChild>
              <Link to="/submit">Start Transparency Report</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">Access Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-semibold text-foreground">TransparencyHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 TransparencyHub. Building trust through transparency.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;