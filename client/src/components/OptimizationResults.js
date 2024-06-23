import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper } from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import './OptimizationResults.css';

const OptimizationResults = ({ results }) => {
  if (!results || results.length === 0) {
    return <Typography variant="h6" gutterBottom>No results to display</Typography>;
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>Optimization Results</Typography>
      <div className="table-container">
        <Table stickyHeader="true"  maxHeight="440" >
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              {results.map((state, timeIndex) => (
                <TableCell key={timeIndex} align="center">Time {state.time}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results[0].students.map((student, studentIndex) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                {results.map((state, timeIndex) => {
                  const currentStudent = state.students[studentIndex];
                  return (
                    <TableCell  align="center" key={timeIndex}>
                      <div>{currentStudent.battery_level.toFixed(2)}</div>
                      <div style={{ color: currentStudent.operational ? green[500] : red[500] }}>
                        {currentStudent.operational ? 'On' : 'Off'}
                      </div>
                      <div style={{ color: currentStudent.has_socket ? orange[500] : 'inherit' }}>
                        {currentStudent.has_socket ? 'Charging' : ''}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
};

export default OptimizationResults;
