import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import api from "../../../services/api";
import { 
  FiUserCheck, 
  FiMapPin, 
  FiTruck, 
  FiHash, 
  FiCheckCircle 
} from "react-icons/fi";
import { Button } from "../../../components/ui/button";

const Onboarding: React.FC = () => {
  const { user, login } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already verified
  React.useEffect(() => {
    if (user && user.kycStatus === "verified") {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    nin: "",
    vehicleType: "",
    vehiclePlate: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const isHauler = user.role === "hauler";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const submitData = isHauler 
        ? formData 
        : { nin: formData.nin };

      const endpoint = isHauler ? "/users/onboard/hauler" : "/users/onboard/vendor";

      await api.post(endpoint, submitData);

      // Refresh user data
      const userRes = await api.get("/users/me");
      const token = localStorage.getItem("haulr_token");
      
      if (token) {
        login(token, userRes.data);
      }

      navigate(`/${user.role}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Onboarding failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-6">
            <FiUserCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Complete Your Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-sm mx-auto">
            {isHauler 
              ? "Tell us about your vehicle to start accepting deliveries" 
              : "Verify your identity to start creating deliveries"}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* NIN */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <FiHash className="w-4 h-4" />
                National Identification Number (NIN)
              </label>
              <input
                type="text"
                name="nin"
                placeholder="12345678901"
                value={formData.nin}
                onChange={handleChange}
                maxLength={11}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 transition-all"
                required
              />
              <p className="text-xs text-slate-500">11-digit NIN number</p>
            </div>

            {/* Hauler-only fields */}
            {isHauler && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <FiTruck className="w-4 h-4" />
                    Vehicle Type
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">Select vehicle type</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                    <option value="Tricycle">Tricycle (Keke)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    Vehicle Plate Number
                  </label>
                  <input
                    type="text"
                    name="vehiclePlate"
                    placeholder="ABC-1234-XY"
                    value={formData.vehiclePlate}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-blue-500 transition-all uppercase"
                    required
                  />
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 px-5 py-4 rounded-2xl text-sm border border-red-200 dark:border-red-900">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading || !formData.nin || (isHauler && (!formData.vehicleType || !formData.vehiclePlate))}
              className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-base"
            >
              {loading ? "Submitting..." : "Complete Onboarding"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          This information helps us verify your identity and ensure safe deliveries.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;