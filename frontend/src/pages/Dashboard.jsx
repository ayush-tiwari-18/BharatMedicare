import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Activity, Clock, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const API_ENDPOINTS = {
  getReports: baseURL + "/report/getreport",
  submitReport: baseURL + "/report/send"
};

const areaLabels = {
  anterior_torso: "Front of torso",
  head_neck: "Head / Neck",
  lower_extremity: "Legs / Feet",
  posterior_torso: "Back of torso",
  upper_extremity: "Arms / Hands",
};

const now = new Date();
const hours = now.getHours();

function DashboardNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between relative"> {/* Added relative here */}
        <div className="text-white font-bold text-lg sm:text-xl">BharatMedicare</div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:block">
          {/* ... desktop nav items ... */}
        </NavigationMenu>

        {/* Mobile Navigation - Fixed to full width below navbar */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-black/95 backdrop-blur-sm z-40 border-t border-gray-800 text-center">
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col px-6 py-4 space-y-4">
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/dashboard"
                    className="text-white hover:text-green-400 py-2 block w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/upload"
                    className="text-white hover:text-green-400 py-2 block w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Upload
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/reports"
                    className="text-white hover:text-green-400 py-2 block w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Reports
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <div className="pt-4 border-t border-gray-800 flex justify-between items-center w-full">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}
      </div>
    </header>
  );
}

const Dashboard = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [skinDialogOpen, setSkinDialogOpen] = useState(false);
  const [longestDiameter, setLongestDiameter] = useState("");
  const [smallestDiameter, setSmallestDiameter] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [affectedArea, setAffectedArea] = useState("");
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchReports();
    }
  }, [isLoaded, isSignedIn]);

  const fetchReports = async () => {
    setLoadingReports(true);
    setApiError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch(API_ENDPOINTS.getReports, {
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 404) {
        throw new Error("API endpoint not found (404)");
      }

      if (res.status === 401) {
        throw new Error("Session expired. Please sign in again.");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }

      setReports([...data].reverse());
    } catch (error) {
      console.error("Fetch reports error:", error);
      setApiError(error.message);
      toast.error(error.message);
      
      if (error.message.includes("401") || error.message.includes("authentic")) {
        setTimeout(() => window.location.href = "/sign-in", 2000);
      }
    } finally {
      setLoadingReports(false);
    }
  };

  const handleUpload = (type) => {
    toast.success(`${type} upload feature coming soon!`);
  };

  const handleImageChange = (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed (JPEG, PNG, etc.)");
      }

      if (file.size > 50 * 1024 * 1024) {
        throw new Error("Image size exceeds 50MB limit");
      }

      setImageFile(file);
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        toast.loading("Reading image file...");
      };
      
      reader.onloadend = () => {
        toast.dismiss();
        setPreview(reader.result);
        toast.success(`Image loaded: ${file.name}`);
      };
      
      reader.onerror = () => {
        throw new Error("Failed to read image file");
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Image handling error:", error);
      toast.error(error.message);
      setPreview(null);
      setImageFile(null);
      const input = document.getElementById("image-upload");
      if (input) input.value = "";
    }
  };

  const handleRemoveImage = () => {
    try {
      setImageFile(null);
      setPreview(null);
      const input = document.getElementById("image-upload");
      if (input) input.value = "";
      toast.success("Image removed");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  };

  const handleSkinDialogOpenChange = (open) => {
    try {
      setSkinDialogOpen(open);
      if (!open) {
        setPreview(null);
        setImageFile(null);
        setLongestDiameter("");
        setSmallestDiameter("");
        setAge("");
        setGender("");
        setAffectedArea("");
        const input = document.getElementById("image-upload");
        if (input) input.value = "";
      }
    } catch (error) {
      console.error("Dialog state error:", error);
    }
  };

  const handleSkinFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!imageFile) throw new Error("Please upload a skin image");
      if (!longestDiameter || isNaN(longestDiameter)) throw new Error("Invalid longest diameter");
      if (!smallestDiameter || isNaN(smallestDiameter)) throw new Error("Invalid smallest diameter");
      if (!age || isNaN(age) || age < 0 || age > 120) throw new Error("Age must be between 0-120");
      if (!gender) throw new Error("Please select gender");
      if (!affectedArea) throw new Error("Please select affected area");

      const token = await getToken();
      if (!token) throw new Error("Authentication failed");

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("maximum", longestDiameter);
      formData.append("minimum", smallestDiameter);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("area", affectedArea);

      toast.loading("Analyzing skin lesion...", { id: "skin-submit" });

      const res = await fetch(API_ENDPOINTS.submitReport, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: "include"
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Analysis failed");
      }

      const newReport = await res.json();
      toast.success("Analysis completed!", { id: "skin-submit" });
      
      setSkinDialogOpen(false);
      await fetchReports();
      setSelectedReport(newReport);
      setReportDialogOpen(true);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Analysis failed", { id: "skin-submit" });
    }
  };

  const affectedAreaOptions = [
    { value: "anterior_torso", label: "Front of torso" },
    { value: "head_neck", label: "Head / Neck" },
    { value: "lower_extremity", label: "Legs / Feet" },
    { value: "posterior_torso", label: "Back of torso" },
    { value: "upper_extremity", label: "Arms / Hands" },
  ];

  function getReportType(report) {
    return report?.type || "Skin Lesion";
  }

  function prettyDate(d) {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return "Invalid date";
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-green-500"></span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Please sign in to access the dashboard</h1>
          <a href="/sign-in" className="btn btn-primary">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
          error: {
            duration: 5000,
          },
        }}
      />

      <DashboardNavbar />

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {apiError && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <div className="flex items-center gap-2 text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Error: {apiError}</span>
            </div>
            <button
              onClick={fetchReports}
              className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium"
            >
              Retry Loading Reports
            </button>
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {hours < 12
              ? "Good Morning"
              : hours > 16
              ? "Good Evening"
              : "Good Afternoon"
            }
          </h1>
          <p className="text-gray-400 text-base sm:text-lg">
            Ready to analyze your medical documents?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card
            className="bg-gradient-to-br from-green-600 to-green-500 border-0 hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => handleUpload("X-Ray")}
          >
            <CardContent className="p-4 sm:p-6 text-center">
              <Upload className="h-10 w-10 sm:h-12 sm:w-12 text-black mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-black mb-1 sm:mb-2">
                Upload X-Ray
              </h3>
              <p className="text-green-900 text-sm sm:text-base">Analyze radiological images</p>
            </CardContent>
          </Card>

          <Dialog
            open={skinDialogOpen}
            onOpenChange={handleSkinDialogOpenChange}
          >
            <DialogTrigger asChild>
              <Card className="bg-gradient-to-br from-blue-600 to-blue-500 border-0 hover:scale-[1.02] transition-transform cursor-pointer">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-white mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                    Skin Analysis
                  </h3>
                  <p className="text-blue-100 text-sm sm:text-base">Check skin lesions & moles</p>
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Skin Image</DialogTitle>
                <DialogDescription>
                  Upload a photo of the skin area and enter details for analysis.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSkinFormSubmit}>
                <div className="grid gap-4">
                  <Label htmlFor="image-upload">Upload Image *</Label>
                  <div
                    className="relative border-2 border-dashed border-gray-500 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-white transition flex flex-col items-center justify-center"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                  >
                    {preview ? (
                      <div className="relative inline-block">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-40 h-40 sm:w-48 sm:h-48 object-contain mb-2 rounded-md mx-auto"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                          }}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-black rounded-full p-1 text-white"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">
                          Choose an image or drag & drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Images only (JPEG, PNG), max 50MB
                        </p>
                      </>
                    )}
                  </div>
                  <Input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <div>
                    <Label htmlFor="longest-diameter">
                      Longest diameter (in mm) *
                    </Label>
                    <Input
                      id="longest-diameter"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="e.g., 12.5"
                      value={longestDiameter}
                      onChange={(e) => setLongestDiameter(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="smallest-diameter">
                      Smallest diameter (in mm) *
                    </Label>
                    <Input
                      id="smallest-diameter"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="e.g., 7.3"
                      value={smallestDiameter}
                      onChange={(e) => setSmallestDiameter(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Age of patient (in years) *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="0"
                      max="120"
                      placeholder="e.g., 45"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender of patient *</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="border border-gray-700 rounded px-3 py-2 w-full text-white focus:outline-none focus:ring focus:border-green-500 bg-gray-900 text-sm sm:text-base"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="affectedArea">Affected area *</Label>
                    <select
                      id="affectedArea"
                      name="affectedArea"
                      value={affectedArea}
                      onChange={(e) => setAffectedArea(e.target.value)}
                      className="border border-gray-700 rounded px-3 py-2 w-full text-white focus:outline-none focus:ring focus:border-green-500 bg-gray-900 text-sm sm:text-base"
                      required
                    >
                      <option value="">Select affected area</option>
                      {affectedAreaOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <DialogFooter className="mt-4 sm:mt-6">
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Analyze</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Card
            className="bg-gradient-to-br from-purple-600 to-purple-500 border-0 hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => handleUpload("Medical Report")}
          >
            <CardContent className="p-4 sm:p-6 text-center">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-white mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                Lab Reports
              </h3>
              <p className="text-purple-100 text-sm sm:text-base">Analyze medical documents</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
            Recently analyzed
          </h2>
          {loadingReports ? (
            <div className="flex justify-center items-center h-40">
              <span className="loading loading-spinner loading-lg text-green-500"></span>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 sm:py-10 text-gray-400">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-600" />
              <p>No reports to show yet</p>
              <p className="text-xs sm:text-sm mt-1 sm:mt-2">Upload your first analysis to get started</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {reports.map((analysis) => (
                <Card
                  key={analysis._id}
                  className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedReport(analysis);
                    setReportDialogOpen(true);
                  }}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="bg-gray-700 p-2 sm:p-3 rounded-md">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-white font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-[180px] md:max-w-[220px]">
                            {analysis.image
                              ? analysis.image.split("/").pop().split("?")[0]
                              : "Skin Image"}
                          </h3>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {getReportType(analysis)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 sm:space-x-2 justify-end">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          <span className="text-gray-400 text-xs sm:text-sm">
                            {prettyDate(analysis.createdAt)}
                          </span>
                        </div>
                        <span
                          className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                            "Completed" === "Completed"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          Completed
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {selectedReport && (
          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Analysis Report</DialogTitle>
                <DialogDescription>
                  {selectedReport.analysis
                    ? "Detailed patient-friendly analysis"
                    : "Analysis details"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedReport.image && (
                  <div className="flex justify-center">
                    <img
                      src={selectedReport.image}
                      alt="Report"
                      className="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded-lg border border-gray-700"
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <div className="font-bold text-gray-400 text-xs sm:text-sm">Age/Gender</div>
                    <div className="text-black text-sm sm:text-base">
                      {selectedReport.age} / {selectedReport.gender === "1" ? "male" : "female"}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-400 text-xs sm:text-sm">Spot Size</div>
                    <div className="text-black text-sm sm:text-base">
                      {selectedReport.maximum}mm × {selectedReport.minimum}mm
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-400 text-xs sm:text-sm">Area</div>
                    <div className="text-black text-sm sm:text-base">
                      {areaLabels[selectedReport.area] || selectedReport.area}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-400 text-xs sm:text-sm">Risk Estimate</div>
                    <div className="text-green-400 font-mono text-sm sm:text-base">
                      {selectedReport.probability.substring(0, 4)}%
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Summary</div>
                  <div className="bg-gray-200 rounded-lg p-3 sm:p-4 whitespace-pre-line text-xs sm:text-sm">
                    {selectedReport.analysis || "No analysis summary available"}
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4 sm:mt-6">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1 sm:mb-2">
                {reports.length}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Total Analyses</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1 sm:mb-2">0</div>
              <div className="text-gray-400 text-xs sm:text-sm">X-Ray Scans</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-500 mb-1 sm:mb-2">
                {reports.length}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">Skin Analyses</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-1 sm:mb-2">0</div>
              <div className="text-gray-400 text-xs sm:text-sm">Lab Reports</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;