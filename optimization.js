// optimization.js
function calculateCurrentBatteryLevels(B_matrix, r, d, Y_matrix, U_matrix, t, delta_t) {
    if (t > 0) {
      for (let i = 0; i < B_matrix.length; i++) {
        B_matrix[i][t] = B_matrix[i][t - 1] + Y_matrix[i][t - 1] * r[i] * delta_t + Y_matrix[i][t - 1] * U_matrix[i][t - 1] * d[i] * delta_t - U_matrix[i][t - 1] * d[i] * delta_t;
      }
    }
  }
  
  function forecastNextBatteryLevels(B_matrix, d, t, delta_t) {
    return B_matrix.map((row, i) => row[t] - d[i] * delta_t);
  }
  
  function allocateSockets(forecasted_battery_levels, U_matrix, num_sockets, t, r, d) {
    const sockets_allocated = Array(forecasted_battery_levels.length).fill(0);
    const students_needing_sockets = forecasted_battery_levels.map((level, index) => level < 0 ? index : -1).filter(index => index !== -1);
  
    if (students_needing_sockets.length <= num_sockets) {
      students_needing_sockets.forEach(i => sockets_allocated[i] = 1);
    } else {
      students_needing_sockets.sort((a, b) => {
        const a_usage = U_matrix[a].slice(0, t).reduce((sum, val) => sum + val, 0);
        const b_usage = U_matrix[b].slice(0, t).reduce((sum, val) => sum + val, 0);
        if (a_usage !== b_usage) return a_usage - b_usage;
        if (forecasted_battery_levels[a] !== forecasted_battery_levels[b]) return forecasted_battery_levels[a] - forecasted_battery_levels[b];
        return (r[a] - d[a]) - (r[b] - d[b]);
      });
      students_needing_sockets.slice(0, num_sockets).forEach(i => sockets_allocated[i] = 1);
    }
  
    for (let i = 0; i < sockets_allocated.length; i++) {
      if (sockets_allocated[i] === 1) {
        U_matrix[i][t] = 1;
      }
    }
  
    return sockets_allocated;
  }
  
  function distributeRemainingSockets(forecasted_battery_levels, Y_matrix, U_matrix, num_remaining_sockets, r, d, t, delta_t) {
    const students_without_sockets = Y_matrix.map((y, index) => y[t] === 0 ? index : -1).filter(index => index !== -1);
  
    if (num_remaining_sockets > 0) {
      students_without_sockets.sort((a, b) => forecasted_battery_levels[a] - forecasted_battery_levels[b]);
      const allocated_sockets = Math.min(num_remaining_sockets, students_without_sockets.length);
  
      for (let i = 0; i < allocated_sockets; i++) {
        const student_index = students_without_sockets[i];
        if (forecasted_battery_levels[student_index] + r[student_index] * delta_t + d[student_index] * delta_t <= 100) {
          Y_matrix[student_index][t] = 1;
          if (U_matrix[student_index][t] === 0) {
            U_matrix[student_index][t] = 1;
          }
        }
      }
    }
  }
  
  function optimizeAllocation(optimizationInstance) {
    const students = optimizationInstance.students;
    const num_students = students.length;
    const num_sockets = optimizationInstance.systemParameters.s;
    const total_time = optimizationInstance.systemParameters.T;
    const delta_t = optimizationInstance.systemParameters.deltaT;

    const r = students.map(s => s.rechargeRate);
    const d = students.map(s => s.dischargeRate);
    const b0 = students.map(s => s.initialBattery);
  
    const num_time_slots = Math.ceil(total_time / delta_t);
  
    const B_matrix = Array.from({ length: num_students }, () => Array(num_time_slots + 1).fill(0));
    B_matrix.forEach((row, index) => row[0] = b0[index]);
  
    const Y_matrix = Array.from({ length: num_students }, () => Array(num_time_slots).fill(0));
    const U_matrix = Array.from({ length: num_students }, () => Array(num_time_slots).fill(0));
  
    for (let t = 0; t < num_time_slots; t++) {
      calculateCurrentBatteryLevels(B_matrix, r, d, Y_matrix, U_matrix, t, delta_t);
      const forecasted_battery_levels = forecastNextBatteryLevels(B_matrix, d, t, delta_t);
      U_matrix.forEach((row, index) => row[t] = forecasted_battery_levels[index] >= 0 ? 1 : 0);
      Y_matrix.forEach((row, index) => row[t] = allocateSockets(forecasted_battery_levels, U_matrix, num_sockets, t, r, d)[index]);
  
      const remaining_sockets = num_sockets - Y_matrix.reduce((sum, row) => sum + row[t], 0);
      if (remaining_sockets > 0) {
        distributeRemainingSockets(forecasted_battery_levels, Y_matrix, U_matrix, remaining_sockets, r, d, t, delta_t);
      }
    }
  
    const results = [];
    for (let t = 0; t < num_time_slots; t++) {
      const state = {
        time: t * delta_t,
        students: students.map((s, i) => ({
          id: s.id,
          battery_level: B_matrix[i][t],
          operational: U_matrix[i][t] === 1,
          has_socket: Y_matrix[i][t] === 1
        }))
      };
      results.push(state);
    }
  
    return {
      states: results,
      optimization_time: performance.now(),  // Assuming we start measuring at the beginning of the function
      status: 'optimal'
    };
  }
  
  module.exports = {
    optimizeAllocation
  };
  