import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Paper, Button, Divider } from '@mui/material';

export default function DisplayReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/`);
        const data = await response.json();
        setReports(data.reports);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
      // Delete reports one by one
      for (const report of reports) {
        await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${report.id}`, {
          method: 'DELETE',
        });
      }
      // Clear reports state after deletion
      setReports([]);
    } catch (error) {
      console.error('Error deleting all reports:', error);
    }
  };

  if (loading) {
    return <Typography variant="h6" align="center">Loading reports...</Typography>;
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Submitted Reports
      </Typography>
      {reports.length === 0 ? (
        <Typography variant="body1" align="center">
          No reports available.
        </Typography>
      ) : (
        <List>
          {reports.map((report) => (
            <React.Fragment key={report.id}>
              <ListItem>
                <ListItemText
                  primary={`Title: ${report.title}`}
                  secondary={
                    <>
                      <div>Problem: {report.body}</div>
                      <div>Category: {report.category}</div>
                      <div>Location: ({report.latitude}, {report.longitude})</div>
                      <div>Email: {report.email}</div>
                      <div>First Name: {report.firstName}</div>
                      <div>Last Name: {report.lastName}</div>
                      <div>Role: {report.role}</div>
                    </>
                  }
                />
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
      {reports.length > 0 && (
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
