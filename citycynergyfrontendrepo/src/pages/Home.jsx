import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link as ScrollLink } from "react-scroll";
import axios from "axios";
import { useLoading } from "../context/LoadingContext";

import AsyncSelect from "react-select/async";
import "./home.css";

export const Home = () => {
  const [sticky, setSticky] = useState(false);
  const [pincode, setPincode] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedLocalArea, setSelectedLocalArea] = useState(null);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchAreas = async (inputValue) => {
    if (!pincode) return [];
    setError(null);
    try {
      setIsLoading(true);
      const response = await axios.post(`https://citysynergybackend-jw8z.onrender.com/tender/tenders/filter`, {
        search_by: "pincode",
        search_term: pincode,
        filter_columns: ["area_name"]
      });

      // Get unique areas
      const areas = [...new Set(response.data.map(item => item.area_name))];
      return areas
        .filter(area => area?.toLowerCase().includes(inputValue?.toLowerCase()))
        .map(area => ({
          value: area,
          label: area
        }));
    } catch (error) {
      console.error("Error fetching areas:", error);
      setError("Failed to fetch areas. Please try again.");
      return [];
    } finally{
      setIsLoading(false);
    }
  };

  const fetchLocalAreas = async (inputValue) => {
    if (!pincode || !selectedArea) return [];
    setError(null);
    try {
      setIsLoading(true);
      const response = await axios.post(`https://citysynergybackend-jw8z.onrender.com/tender/tenders/filter`, {
        search_by: "area_name",
        search_term: selectedArea.value,
        filter_columns: ["local_area_name"]
      });

      // Get unique local areas
      const localAreas = [...new Set(response.data.map(item => item.local_area_name))];
      return localAreas
        .filter(area => area?.toLowerCase().includes(inputValue?.toLowerCase()))
        .map(area => ({
          value: area,
          label: area
        }));
    } catch (error) {
      console.error("Error fetching local areas:", error);
      setError("Failed to fetch local areas. Please try again.");
      return [];
    }finally{
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pincode || !selectedArea || !selectedLocalArea) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setIsLoading(true);
      const response = await axios.post(`https://citysynergybackend-jw8z.onrender.com/tender/tenders/filter`, {
        search_by: "pincode",
        search_term: pincode,
        filter_columns: ["*"]
      });
      
      const filteredTenders = response.data.filter(tender => 
        tender.area_name === selectedArea.value &&
        tender.local_area_name === selectedLocalArea.value &&
        tender.Cancel_Accept_Tenders === "Accepted"
      );
      
      setTenders(filteredTenders);
    } catch (error) {
      console.error("Error fetching tenders:", error);
      setError("Failed to fetch tenders. Please try again.");
      setTenders([]);
    } finally {
      setIsLoading(false);
    }
  };
  
    
  

  return (
    <div>
      <Navbar sticky={sticky} />
      {/* Hero Section */}
      <section
        id="home"
        className="bgimg min-h-screen flex items-center justify-center relative"
      >
        <div className="overlay"></div>
        <div className="text-center z-10 px-4">
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[150px] font-semibold text-white transition-all">
            CITY SYNERGY
          </h1>
          <p className="text-base sm:text-lg text-white mt-2">
            The Inter Departmental Co-Operation Software.
          </p>
        </div>
        <ScrollLink
          to="knowtenders"
          smooth={true}
          duration={500}
          className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 bg-blue-500 z-10 text-white font-bold py-2 px-4 sm:py-3 sm:px-5 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 text-sm sm:text-base"
        >
          Know Tenders in Your Area
        </ScrollLink>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 md:py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8">
            <span className="text-blue-500 font-medium tracking-wide">
              About Us
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              What is CitySynergy?
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Every great city thrives on collaboration, and we&apos;re here to make
              it seamless. Our platform is the bridge between innovation and
              coordination, connecting departments to transform urban governance
              into a powerhouse of efficiency and progress.
            </p>

            <div className="text-gray-900">
              <span className="font-medium">
                Basically Inter-Departmental Co-operation software
              </span>
              <a href="" className="text-blue-500 hover:text-blue-200 transition-colors">.</a>
            </div>

            <button className="group relative px-6 sm:px-8 py-2 sm:py-3 border-2 border-blue-500 text-gray-900 font-medium hover:bg-blue-500 hover:text-white transition-all duration-300">
              Read More
              <span className="absolute -bottom-2 -right-2 w-full h-full border-2 border-gray-200 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300"></span>
            </button>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="relative">
              <img
                src="./banner.png"
                alt="Modern Interior"
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="knowtenders" className="bg-gray-100 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8">
            Know Tenders in Your Area
          </h2>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter Pincode"
              className="w-full sm:w-48 border border-gray-300 rounded-md p-2"
            />
            <div className="w-full sm:w-64">
              <AsyncSelect
                cacheOptions
                loadOptions={fetchAreas}
                onChange={setSelectedArea}
                placeholder="Select Area"
                isDisabled={!pincode}
                noOptionsMessage={() => "No areas found"}
              />
            </div>
            <div className="w-full sm:w-64">
              <AsyncSelect
                cacheOptions
                loadOptions={fetchLocalAreas}
                onChange={setSelectedLocalArea}
                placeholder="Select Local Area"
                isDisabled={!pincode || !selectedArea}
                noOptionsMessage={() => "No local areas found"}
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md disabled:bg-gray-400"
              disabled={loading || !pincode || !selectedArea || !selectedLocalArea}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          {tenders.length > 0 && (
            <div className="overflow-x-auto shadow-lg rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-[#495057] text-white">
                  <tr>
                    <th className="p-2 sm:p-3 text-left text-sm sm:text-base">Tender ID</th>
                    <th className="p-2 sm:p-3 text-left text-sm sm:text-base">Department</th>
                    <th className="hidden md:table-cell p-2 sm:p-3 text-left text-sm sm:text-base">Classification</th>
                    <th className="hidden sm:table-cell p-2 sm:p-3 text-left text-sm sm:text-base">Sanction Date</th>
                    <th className="hidden lg:table-cell p-2 sm:p-3 text-left text-sm sm:text-base">Completion Date</th>
                    <th className="p-2 sm:p-3 text-right text-sm sm:text-base">Amount</th>
                    <th className="hidden xl:table-cell p-2 sm:p-3 text-center text-sm sm:text-base">Duration</th>
                    <th className="hidden sm:table-cell p-2 sm:p-3 text-left text-sm sm:text-base">Status</th>
                    <th className="hidden md:table-cell p-2 sm:p-3 text-left text-sm sm:text-base">Agency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tenders.map((tender) => (
                    <tr key={tender.Tender_ID} className="hover:bg-gray-50">
                      <td className="p-2 sm:p-3 text-sm">{tender.Tender_ID}</td>
                      <td className="p-2 sm:p-3 text-sm">{tender.Tender_By_Department}</td>
                      <td className="hidden md:table-cell p-2 sm:p-3 text-sm">{tender.Tender_By_Classification}</td>
                      <td className="hidden sm:table-cell p-2 sm:p-3 text-sm">{new Date(tender.Sanction_Date).toLocaleDateString()}</td>
                      <td className="hidden lg:table-cell p-2 sm:p-3 text-sm">{new Date(tender.Completion_Date).toLocaleDateString()}</td>
                      <td className="p-2 sm:p-3 text-sm text-right">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR'
                        }).format(tender.Sanction_Amount)}
                      </td>
                      <td className="hidden xl:table-cell p-2 sm:p-3 text-sm text-center">{tender.Total_Duration_Days}</td>
                      <td className="hidden sm:table-cell p-2 sm:p-3 text-sm">{tender.Tender_Status}</td>
                      <td className="hidden md:table-cell p-2 sm:p-3 text-sm">{tender.Tender_Acquired_By_Agency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {tenders.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500 mt-4">
              No accepted tenders found for the selected criteria.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
