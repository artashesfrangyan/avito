import axios from 'axios';

export const fetchBoards = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/boards');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching boards:', error);
    throw error;
  }
};