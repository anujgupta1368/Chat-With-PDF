// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react'
import { getAllProjects } from '../services/api.js';

const Dashboard = () => {

  const [projects, setProjects] = useState({});
  
  useEffect(() => {
    const fetchProjects = async() => {
      try {
        const response = await getAllProjects();
        setProjects(response?.data?.rows);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    fetchProjects();
  },[]);

  
  console.log(projects);
  
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard;