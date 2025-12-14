// src/hooks/useAnimalSightings.js
import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

export function useAnimalSightings() {
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSightings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAnimalSightings();
      setSightings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching animal sightings:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSighting = async (sightingData) => {
    try {
      const newSighting = await apiService.createAnimalSighting(sightingData);
      setSightings(prev => [newSighting, ...prev]);
      return newSighting;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSighting = async (id, sightingData) => {
    try {
      const updatedSighting = await apiService.updateAnimalSighting(id, sightingData);
      setSightings(prev => prev.map(s => s.id === id ? updatedSighting : s));
      return updatedSighting;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteSighting = async (id) => {
    try {
      await apiService.deleteAnimalSighting(id);
      setSightings(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSightings();
  }, []);

  return {
    sightings,
    loading,
    error,
    refetch: fetchSightings,
    createSighting,
    updateSighting,
    deleteSighting
  };
}