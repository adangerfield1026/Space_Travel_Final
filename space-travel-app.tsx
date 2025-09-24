import React, { useState, useEffect, createContext, useContext } from 'react';
import { Rocket, Globe, Home, Plus, Trash2, ArrowLeft, Send, Users, MapPin, Loader } from 'lucide-react';

// Mock API Service
class SpaceTravelMockApi {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem('planets')) {
      const planets = [
        { id: 1, name: 'Earth', currentPopulation: 7800000000, pictureUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400' },
        { id: 2, name: 'Mars', currentPopulation: 0, pictureUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400' },
        { id: 3, name: 'Jupiter', currentPopulation: 0, pictureUrl: 'https://images.unsplash.com/photo-1614732484003-ef9881555dc3?w=400' },
        { id: 4, name: 'Saturn', currentPopulation: 0, pictureUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400' }
      ];
      localStorage.setItem('planets', JSON.stringify(planets));
    }

    if (!localStorage.getItem('spacecrafts')) {
      const spacecrafts = [
        { id: 'sc-1', name: 'Odyssey', capacity: 1000000, description: 'A massive colony ship designed for long-distance travel', pictureUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400', currentLocation: 1 },
        { id: 'sc-2', name: 'Pioneer', capacity: 500000, description: 'Fast and efficient transport vessel', pictureUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', currentLocation: 1 }
      ];
      localStorage.setItem('spacecrafts', JSON.stringify(spacecrafts));
    }
  }

  async getPlanets() {
    await this.delay();
    return { isError: false, data: JSON.parse(localStorage.getItem('planets')) };
  }

  async getSpacecrafts() {
    await this.delay();
    return { isError: false, data: JSON.parse(localStorage.getItem('spacecrafts')) };
  }

  async getSpacecraftById({ id }) {
    await this.delay();
    const spacecrafts = JSON.parse(localStorage.getItem('spacecrafts'));
    const spacecraft = spacecrafts.find(s => s.id === id);
    return spacecraft ? { isError: false, data: spacecraft } : { isError: true, data: null };
  }

  async buildSpacecraft({ name, capacity, description, pictureUrl }) {
    await this.delay();
    const spacecrafts = JSON.parse(localStorage.getItem('spacecrafts'));
    const newSpacecraft = {
      id: 'sc-' + Date.now(),
      name,
      capacity: parseInt(capacity),
      description,
      pictureUrl: pictureUrl || 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
      currentLocation: 1
    };
    spacecrafts.push(newSpacecraft);
    localStorage.setItem('spacecrafts', JSON.stringify(spacecrafts));
    return { isError: false, data: newSpacecraft };
  }

  async destroySpacecraftById({ id }) {
    await this.delay();
    const spacecrafts = JSON.parse(localStorage.getItem('spacecrafts'));
    const filteredSpacecrafts = spacecrafts.filter(s => s.id !== id);
    localStorage.setItem('spacecrafts', JSON.stringify(filteredSpacecrafts));
    return { isError: false, data: null };
  }

  async sendSpacecraftToPlanet({ spacecraftId, targetPlanetId }) {
    await this.delay();
    const spacecrafts = JSON.parse(localStorage.getItem('spacecrafts'));
    const planets = JSON.parse(localStorage.getItem('planets'));
    
    const spacecraft = spacecrafts.find(s => s.id === spacecraftId);
    if (!spacecraft) return { isError: true, data: 'Spacecraft not found' };
    
    if (spacecraft.currentLocation === targetPlanetId) {
      return { isError: true, data: 'Target planet is the same as current location' };
    }

    const currentPlanet = planets.find(p => p.id === spacecraft.currentLocation);
    const targetPlanet = planets.find(p => p.id === targetPlanetId);
    
    const transferAmount = Math.min(spacecraft.capacity, currentPlanet.currentPopulation);
    
    currentPlanet.currentPopulation -= transferAmount;
    targetPlanet.currentPopulation += transferAmount;
    spacecraft.currentLocation = targetPlanetId;
    
    localStorage.setItem('spacecrafts', JSON.stringify(spacecrafts));
    localStorage.setItem('planets', JSON.stringify(planets));
    
    return { isError: false, data: null };
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}

// API Service
class SpaceTravelApi {
  constructor() {
    this.mockApi = new SpaceTravelMockApi();
  }

  async getPlanets() {
    return await this.mockApi.getPlanets();
  }

  async getSpacecrafts() {
    return await this.mockApi.getSpacecrafts();
  }

  async getSpacecraftById(id) {
    return await this.mockApi.getSpacecraftById({ id });
  }

  async buildSpacecraft(data) {
    return await this.mockApi.buildSpacecraft(data);
  }

  async destroySpacecraftById(id) {
    return await this.mockApi.destroySpacecraftById({ id });
  }

  async sendSpacecraftToPlanet(spacecraftId, targetPlanetId) {
    return await this.mockApi.sendSpacecraftToPlanet({ spacecraftId, targetPlanetId });
  }
}

// Context
const SpaceTravelContext = createContext();

const SpaceTravelProvider = ({ children }) => {
  const [api] = useState(new SpaceTravelApi());
  const [planets, setPlanets] = useState([]);
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPlanets = async () => {
    setLoading(true);
    const response = await api.getPlanets();
    if (!response.isError) {
      setPlanets(response.data);
    }
    setLoading(false);
  };

  const fetchSpacecrafts = async () => {
    setLoading(true);
    const response = await api.getSpacecrafts();
    if (!response.isError) {
      setSpacecrafts(response.data);
    }
    setLoading(false);
  };

  const refreshData = async () => {
    await Promise.all([fetchPlanets(), fetchSpacecrafts()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <SpaceTravelContext.Provider value={{
      api,
      planets,
      spacecrafts,
      loading,
      refreshData,
      fetchPlanets,
      fetchSpacecrafts
    }}>
      {children}
    </SpaceTravelContext.Provider>
  );
};

const useSpaceTravel = () => {
  const context = useContext(SpaceTravelContext);
  if (!context) {
    throw new Error('useSpaceTravel must be used within SpaceTravelProvider');
  }
  return context;
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <Loader className="animate-spin h-8 w-8 text-blue-500" />
    <span className="ml-2 text-lg">Loading...</span>
  </div>
);

// Navigation Component
const Navigation = ({ currentPage, onNavigate }) => (
  <nav className="bg-gray-900 text-white p-4 shadow-lg">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Rocket className="h-8 w-8 text-blue-400" />
        <h1 className="text-2xl font-bold">Space Travel</h1>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
            currentPage === 'home' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => onNavigate('spacecrafts')}
          className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
            currentPage === 'spacecrafts' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          <Rocket className="h-4 w-4" />
          <span>Spacecrafts</span>
        </button>
        <button
          onClick={() => onNavigate('planets')}
          className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
            currentPage === 'planets' ? 'bg-blue-600' : 'hover:bg-gray-700'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Planets</span>
        </button>
      </div>
    </div>
  </nav>
);

// Home Page
const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center text-white mb-16">
        <h1 className="text-6xl font-bold mb-6">Welcome to Space Travel</h1>
        <p className="text-2xl mb-8 opacity-90">
          Humanity's Last Hope for Interplanetary Evacuation
        </p>
        <div className="max-w-4xl mx-auto text-lg leading-relaxed opacity-80">
          <p className="mb-6">
            In the not-so-distant future, Earth has become uninhabitable due to centuries of 
            environmental degradation. As a commander, you hold the key to humanity's survival 
            through our cutting-edge Space Travel application.
          </p>
          <p>
            Transform other planets into habitable environments and orchestrate the greatest 
            migration in human history. The fate of billions rests in your hands.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white text-center">
          <Rocket className="h-16 w-16 mx-auto mb-4 text-blue-400" />
          <h3 className="text-2xl font-bold mb-4">Manage Spacecrafts</h3>
          <p className="opacity-80">
            View, build, and destroy spacecraft. Each vessel is crucial for the evacuation mission.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white text-center">
          <Globe className="h-16 w-16 mx-auto mb-4 text-green-400" />
          <h3 className="text-2xl font-bold mb-4">Explore Planets</h3>
          <p className="opacity-80">
            Monitor planetary populations and coordinate spacecraft movements across the solar system.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white text-center">
          <Send className="h-16 w-16 mx-auto mb-4 text-purple-400" />
          <h3 className="text-2xl font-bold mb-4">Execute Missions</h3>
          <p className="opacity-80">
            Send spacecraft between planets to transfer populations and establish new colonies.
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-white text-xl mb-8">
          The future of humanity depends on your strategic decisions. 
          Every spacecraft built and every mission executed brings us closer to survival.
        </p>
        <div className="text-white/60">
          <p className="text-lg font-semibold mb-2">Ready to begin the evacuation?</p>
          <p>Use the navigation above to access spacecraft management and planetary coordination.</p>
        </div>
      </div>
    </div>
  </div>
);

// Spacecrafts Page
const SpacecraftsPage = ({ onNavigate }) => {
  const { spacecrafts, planets, loading, api, refreshData } = useSpaceTravel();

  const handleDestroy = async (id) => {
    if (window.confirm('Are you sure you want to destroy this spacecraft?')) {
      await api.destroySpacecraftById(id);
      refreshData();
    }
  };

  const getPlanetName = (planetId) => {
    const planet = planets.find(p => p.id === planetId);
    return planet ? planet.name : 'Unknown';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Planetary Command Center</h1>
      
      {/* Mission Control Panel */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Mission Control</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Spacecraft
            </label>
            <select
              value={selectedSpacecraft}
              onChange={(e) => {
                setSelectedSpacecraft(e.target.value);
                setTargetPlanet('');
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose spacecraft...</option>
              {spacecrafts.map(spacecraft => (
                <option key={spacecraft.id} value={spacecraft.id}>
                  {spacecraft.name} (Currently on {planets.find(p => p.id === spacecraft.currentLocation)?.name})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Planet
            </label>
            <select
              value={targetPlanet}
              onChange={(e) => {
                setTargetPlanet(e.target.value);
                setError('');
              }}
              disabled={!selectedSpacecraft}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Choose destination...</option>
              {availableTargets.map(planet => (
                <option key={planet.id} value={planet.id}>
                  {planet.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={handleSendSpacecraft}
            disabled={!selectedSpacecraft || !targetPlanet || sending}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            {sending ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span>{sending ? 'Sending...' : 'Send Spacecraft'}</span>
          </button>
        </div>
      </div>

      {/* Planets Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
        {planets.map(planet => {
          const planetSpacecrafts = getSpacecraftsOnPlanet(planet.id);
          return (
            <div key={planet.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={planet.pictureUrl}
                alt={planet.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{planet.name}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-lg">
                      Population: {planet.currentPopulation.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Rocket className="h-5 w-5 text-purple-500" />
                    <span className="text-lg">
                      Spacecraft: {planetSpacecrafts.length}
                    </span>
                  </div>
                </div>
                
                {planetSpacecrafts.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Stationed Spacecraft:</h4>
                    <div className="space-y-2">
                      {planetSpacecrafts.map(spacecraft => (
                        <div
                          key={spacecraft.id}
                          className="bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                          onClick={() => onNavigate('spacecraft', spacecraft.id)}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{spacecraft.name}</span>
                            <span className="text-sm text-gray-600">
                              {spacecraft.capacity.toLocaleString()} capacity
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {planetSpacecrafts.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No spacecraft stationed here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main App Component
const SpaceTravelApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState(null);

  const navigate = (page, params = null) => {
    setCurrentPage(page);
    setPageParams(params);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'spacecrafts':
        return <SpacecraftsPage onNavigate={navigate} />;
      case 'spacecraft':
        return <SpacecraftPage spacecraftId={pageParams} onNavigate={navigate} />;
      case 'construction':
        return <ConstructionPage onNavigate={navigate} />;
      case 'planets':
        return <PlanetsPage onNavigate={navigate} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <SpaceTravelProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentPage={currentPage} onNavigate={navigate} />
        {renderPage()}
      </div>
    </SpaceTravelProvider>
  );
};

export default SpaceTravelApp py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Spacecraft Fleet</h1>
        <button
          onClick={() => onNavigate('construction')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Build New Spacecraft</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spacecrafts.map(spacecraft => (
          <div key={spacecraft.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <img
              src={spacecraft.pictureUrl}
              alt={spacecraft.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{spacecraft.name}</h3>
              <p className="text-gray-600 mb-4">{spacecraft.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Capacity: {spacecraft.capacity.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Location: {getPlanetName(spacecraft.currentLocation)}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onNavigate('spacecraft', spacecraft.id)}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleDestroy(spacecraft.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {spacecrafts.length === 0 && (
        <div className="text-center py-16">
          <Rocket className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">No Spacecraft Available</h2>
          <p className="text-gray-500 mb-4">Build your first spacecraft to begin the evacuation.</p>
          <button
            onClick={() => onNavigate('construction')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Build Spacecraft
          </button>
        </div>
      )}
    </div>
  );
};

// Spacecraft Detail Page
const SpacecraftPage = ({ spacecraftId, onNavigate }) => {
  const { api, planets, loading, refreshData } = useSpaceTravel();
  const [spacecraft, setSpacecraft] = useState(null);
  const [spacecraftLoading, setSpacecraftLoading] = useState(true);

  useEffect(() => {
    const fetchSpacecraft = async () => {
      setSpacecraftLoading(true);
      const response = await api.getSpacecraftById(spacecraftId);
      if (!response.isError) {
        setSpacecraft(response.data);
      }
      setSpacecraftLoading(false);
    };
    fetchSpacecraft();
  }, [spacecraftId, api]);

  const handleDestroy = async () => {
    if (window.confirm('Are you sure you want to destroy this spacecraft?')) {
      await api.destroySpacecraftById(spacecraftId);
      onNavigate('spacecrafts');
    }
  };

  const getPlanetName = (planetId) => {
    const planet = planets.find(p => p.id === planetId);
    return planet ? planet.name : 'Unknown';
  };

  if (loading || spacecraftLoading) return <LoadingSpinner />;

  if (!spacecraft) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600 mb-4">Spacecraft Not Found</h1>
        <button
          onClick={() => onNavigate('spacecrafts')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Back to Fleet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => onNavigate('spacecrafts')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Fleet</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-800">{spacecraft.name}</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={spacecraft.pictureUrl}
          alt={spacecraft.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Specifications</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="text-lg font-semibold">{spacecraft.capacity.toLocaleString()} people</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Current Location</p>
                    <p className="text-lg font-semibold">{getPlanetName(spacecraft.currentLocation)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Rocket className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Spacecraft ID</p>
                    <p className="text-lg font-semibold">{spacecraft.id}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{spacecraft.description}</p>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('planets')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Send className="h-5 w-5" />
                  <span>Send to Planet</span>
                </button>
                <button
                  onClick={handleDestroy}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Destroy Spacecraft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Construction Page
const ConstructionPage = ({ onNavigate }) => {
  const { api, refreshData } = useSpaceTravel();
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    description: '',
    pictureUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.capacity.trim()) newErrors.capacity = 'Capacity is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.capacity && isNaN(parseInt(formData.capacity))) {
      newErrors.capacity = 'Capacity must be a number';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const response = await api.buildSpacecraft(formData);
    if (!response.isError) {
      await refreshData();
      onNavigate('spacecrafts');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => onNavigate('spacecrafts')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Fleet</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-800">Build New Spacecraft</h1>
        <p className="text-gray-600 mt-2">Design a new vessel for humanity's evacuation</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Spacecraft Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter spacecraft name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.capacity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter passenger capacity"
            />
            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the spacecraft's purpose and capabilities"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Picture URL (Optional)
            </label>
            <input
              type="url"
              name="pictureUrl"
              value={formData.pictureUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image URL"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Build Spacecraft</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('spacecrafts')}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Planets Page
const PlanetsPage = ({ onNavigate }) => {
  const { planets, spacecrafts, loading, api, refreshData } = useSpaceTravel();
  const [selectedSpacecraft, setSelectedSpacecraft] = useState('');
  const [targetPlanet, setTargetPlanet] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const getSpacecraftsOnPlanet = (planetId) => {
    return spacecrafts.filter(s => s.currentLocation === planetId);
  };

  const handleSendSpacecraft = async () => {
    if (!selectedSpacecraft || !targetPlanet) {
      setError('Please select both spacecraft and target planet');
      return;
    }

    setSending(true);
    setError('');
    
    const response = await api.sendSpacecraftToPlanet(selectedSpacecraft, parseInt(targetPlanet));
    
    if (response.isError) {
      setError(response.data);
    } else {
      await refreshData();
      setSelectedSpacecraft('');
      setTargetPlanet('');
    }
    
    setSending(false);
  };

  const selectedSpacecraftData = spacecrafts.find(s => s.id === selectedSpacecraft);
  const availableTargets = selectedSpacecraftData 
    ? planets.filter(p => p.id !== selectedSpacecraftData.currentLocation)
    : [];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto px-4