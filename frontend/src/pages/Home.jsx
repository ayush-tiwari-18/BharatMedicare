import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Zap, FileText, Image, Brain, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { SignInButton } from "@clerk/clerk-react"

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-full">
                <Heart className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">BharatMedicare</span>
            </div>
            
            <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
              <Button className="bg-green-500 hover:bg-green-400 text-black font-semibold">
                Get Started
              </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              AI-Powered Medical 
              <span className="text-green-500 block">Document Analysis</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload your X-rays, skin lesion images, and other medical documents to get instant AI-powered analysis and insights from BharatMedicare's advanced diagnostic platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <SignInButton mode="modal">
              <Button size="lg" className="bg-green-500 hover:bg-green-400 text-black font-semibold text-lg px-8 py-6 rounded-full">
                <Play className="mr-2 h-5 w-5" fill="currentColor" />
                Start Analysis Now
              </Button>
              </SignInButton>
              
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-gray-600 text-black hover:bg-gray-300">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Advanced Medical AI Analysis
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our cutting-edge AI technology provides accurate, fast, and reliable analysis of your medical documents.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Image className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">X-Ray Analysis</h3>
                <p className="text-gray-300 leading-relaxed">
                  Upload chest X-rays, bone X-rays, and other radiological images for instant AI-powered diagnostic insights and anomaly detection.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Skin Lesion Detection</h3>
                <p className="text-gray-300 leading-relaxed">
                  Advanced dermatological AI analysis to identify potential skin conditions, moles, and lesions with high accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Medical Reports</h3>
                <p className="text-gray-300 leading-relaxed">
                  Comprehensive analysis of lab reports, medical documents, and clinical data with detailed explanations and recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-black">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              BharatMedicare uses state-of-the-art AI models trained on millions of medical images and documents. Our platform maintains the highest standards of privacy and security for your sensitive medical data.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">96%</div>
                <div className="text-gray-400">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">10+</div>
                <div className="text-gray-400">Analyses Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">24/7</div>
                <div className="text-gray-400">Available Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-green-500">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-6">
            Ready to Transform Your Medical Analysis?
          </h2>
          <p className="text-xl text-green-900 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals and patients who trust BharatMedicare for accurate medical document analysis.
          </p>
          <SignInButton mode="modal">
          <Button size="lg" className="bg-black hover:bg-gray-900 text-white text-lg px-8 py-6 rounded-full">
            <Play className="mr-2 h-5 w-5" fill="currentColor" />
            Get Started Today
          </Button>
          </SignInButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-green-500 p-2 rounded-full">
                <Heart className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-bold">BharatMedicare</span>
            </div>
            
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 BharatMedicare. All rights reserved.</p>
              <p className="mt-2">Advancing healthcare through AI innovation.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;