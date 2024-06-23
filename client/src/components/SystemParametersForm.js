import React from 'react';
import { TextField, Grid, Container } from '@mui/material';

const SystemParametersForm = ({ systemParameters, setSystemParameters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSystemParameters(prevParams => ({
      ...prevParams,
      [name]: value
    }));
  };

  return (
    <Container>
      <form>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextField
              label="S"
              name="s"
              type="number"
              value={systemParameters.s}
              onChange={handleChange}
              fullWidth
              margin="dense"
              variant='standard'
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="T"
              name="T"
              type="number"
              value={systemParameters.T}
              onChange={handleChange}
              fullWidth
              variant='standard'
              margin="dense"
              required
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="deltaT"
              name="deltaT"
              type="number"
              value={systemParameters.deltaT}
              onChange={handleChange}
              fullWidth
              variant='standard'
              margin="dense"
              required
            />
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default SystemParametersForm;
