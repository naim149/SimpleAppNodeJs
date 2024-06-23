import React, { useState } from 'react';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import SystemParametersForm from './components/SystemParametersForm';
import StudentGrid from './components/StudentGrid';
import OptimizationResults from './components/OptimizationResults';
import axios from 'axios';
import './App.css'; // Ensure you import the CSS file

function App() {
  const [systemParameters, setSystemParameters] = useState({ s: '', T: '', deltaT: '' });
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const handleOptimize = () => {
    // Validate that systemParameters are set and there is at least one student
    if (!systemParameters.s || !systemParameters.T || !systemParameters.deltaT || students.length === 0) {
      alert("Please set the system parameters and add at least one student.");
      return;
    }

    // Convert system parameters to numbers
    const params = {
      s: parseInt(systemParameters.s),
      T: parseFloat(systemParameters.T),
      deltaT: parseFloat(systemParameters.deltaT)
    };

    // Simulating server call
    axios.post('/api/optimize', { systemParameters: params, students })
      .then(response => setResults(response.data.states))
      .catch(error => console.error(error));
  };

  return (
    <Container maxWidth="false" className="container">
      <Typography variant="h2" align="center" gutterBottom>Resource Allocation App</Typography>
      <Grid container spacing={3}>
        <Grid item xs={3} className="paper-left">
          <Paper elevation={3} style={{ padding: '10px', marginTop: '20px' }}>
            <Typography variant="h5" align="center" gutterBottom>System Parameters</Typography>
            <Container>
            <Button  variant="contained" color="primary" onClick={handleOptimize}>
              Optimize
            </Button>
            </Container>
            <SystemParametersForm systemParameters={systemParameters} setSystemParameters={setSystemParameters} />
            <StudentGrid students={students} setStudents={setStudents} />
          </Paper>
        </Grid>
        <Grid item xs={9} className="paper-right">
          <OptimizationResults results={results} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
