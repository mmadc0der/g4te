import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const fetchContainers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/containers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching containers:', error);
    throw error;
  }
};
