import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Paper, Button, Divider, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

export default function DisplayReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/get_by_email/${sessionStorage.getItem('email')}`);
        const data = await response.json();
        setReports(data.reports);
        setLoading(false);
        console.log(data.reports); // Debugging: Log fetched reports
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const toggleDetails = (reportId) => {
    setShowDetails(prevState => ({
      ...prevState,
      [reportId]: !prevState[reportId]
    }));
  };

  const deleteReport = async (reportId) => {
    try {
      const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${reportId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setReports(reports.filter(report => report.id !== reportId));
      } else {
        console.error('Failed to delete report:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const deleteAllReports = async () => {
    try {
      for (const report of reports) {
        await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${report.id}`, {
          method: 'DELETE',
        });
      }
      setReports([]);  // Clear the reports after deletion
    } catch (error) {
      console.error('Error deleting all reports:', error);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value); // Update selected category
  };

  // Filter reports based on selected category
  const filteredReports = selectedCategory
    ? reports.filter(report => report.category === selectedCategory)
    : reports;

  if (loading) {
    return <Typography variant="h6" align="center">Loading reports...</Typography>;
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Submitted Reports
      </Typography>

      {/* Category Filter */}
      <FormControl fullWidth style={{ marginBottom: '20px' }}>
        <InputLabel>Filter by Category</InputLabel>
        <Select value={selectedCategory} onChange={handleCategoryChange}>
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="Pothole">Pothole</MenuItem>
          <MenuItem value="Road Damage">Road Damage</MenuItem>
          <MenuItem value="Environment">Environment</MenuItem>
          <MenuItem value="Street lights outage">Street lights outage</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      {filteredReports.length === 0 ? (
        <Typography variant="body1" align="center">
          No reports available.
        </Typography>
      ) : (
        <List>
          {filteredReports.map((report) => (
            <React.Fragment key={report.id}>
              <ListItem>
                <ListItemText
                  primary={`Title: ${report.title}`}
                  secondary={
                    <>
                      <Typography component="span">Category: {report.category}</Typography>
                      <br />
                      <Typography component="span">Address: {report.body}</Typography>
                      <br />
                      {showDetails[report.id] ? (
                        <>
                          <Typography component="span">Location: ({report.latitude}, {report.longitude})</Typography>
                          <br />
                          <Typography component="span">Email: {report.email}</Typography>
                          <br />
                          <Typography component="span">First Name: {report.firstName}</Typography>
                          <br />
                          <Typography component="span">Last Name: {report.lastName}</Typography>
                        </>
                      ) : null}
                    </>
                  }
                />
                <Button
                  onClick={() => toggleDetails(report.id)}
                  variant="contained"
                  style={{ marginLeft: '10px' }}
                >
                  {showDetails[report.id] ? 'Hide Details' : 'Show Details'}
                </Button>
                <Button
                  onClick={() => deleteReport(report.id)}
                  variant="contained"
                  color="error"
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Button to delete all reports */}
      {filteredReports.length > 0 && (
        <Button
          onClick={deleteAllReports}
          variant="contained"
          color="error"
          style={{ marginTop: '20px' }}
        >
          Delete All Reports
        </Button>
      )}
    </Paper>
  );
}
