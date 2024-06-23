import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const StudentGrid = ({ students, setStudents }) => {
  const handleChange = (id, field, value) => {
    const updatedStudents = students.map(student => {
      if (student.id === id) {
        return { ...student, [field]: parseFloat(value) };
      }
      return student;
    });
    setStudents(updatedStudents);
  };

  const handleDelete = (id) => {
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
  };

  const addStudent = () => {
    const newId = students.length > 0 ? students[students.length - 1].id + 1 : 1;
    const newStudent = {
      id: newId,
      initialBattery: parseFloat((Math.random() * 100).toFixed(2)),
      rechargeRate: parseFloat((Math.random() * 50).toFixed(2)),
      dischargeRate: parseFloat((Math.random() * 30).toFixed(2))
    };
    setStudents([...students, newStudent]);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Button variant="contained" color="primary" onClick={addStudent} style={{ marginBottom: '20px' }}>
        ADD STUDENT
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Battery(t0)</TableCell>
            <TableCell>Recharge Rate</TableCell>
            <TableCell>Discharge Rate</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map(student => (
            <TableRow key={student.id}>
              <TableCell>{student.id}</TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={student.initialBattery}
                  onChange={(e) => handleChange(student.id, 'initialBattery', e.target.value)}
                  fullWidth
                  margin="dense"
                  variant='standard'
                  required
                  inputProps={{ style: { fontSize: '12px', padding: '5px' } }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={student.rechargeRate}
                  onChange={(e) => handleChange(student.id, 'rechargeRate', e.target.value)}
                  fullWidth
                  margin="dense"
                  variant='standard'
                  required
                  inputProps={{ style: { fontSize: '12px', padding: '5px' } }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={student.dischargeRate}
                  onChange={(e) => handleChange(student.id, 'dischargeRate', e.target.value)}
                  fullWidth
                  margin="dense"
                  variant='standard'
                  required
                  inputProps={{ style: { fontSize: '12px', padding: '5px' } }}
                />
              </TableCell>
              <TableCell>
                <IconButton color="secondary" onClick={() => handleDelete(student.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default StudentGrid;
