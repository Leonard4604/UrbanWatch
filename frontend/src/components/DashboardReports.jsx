import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Paper, Button
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material'; // Import icone

export default function DisplayReportsTable() {

  const [activeReports, setActiveReports] = useState([]);
  const [closedReports, setClosedReports] = useState([]); // Stato per i closed reports
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState({});

  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch Active Reports
        const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/`);
        const data = await response.json();
        setActiveReports(data.reports);

        // Fetch Closed/Resolved Reports
        const closedResponse = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/closed-or-resolved`);
        const closedData = await closedResponse.json();
        setClosedReports(closedData.reports);

        setLoading(false);
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

   // Funzione per chiudere un report con motivazione
    const closeReport = async (reportId, motivation) => {
        try {
        const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${reportId}/close`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ closed: true, motivation }), // Invia la motivazione
        });
        if (response.ok) {
            // Aggiorna la lista dei report attivi dopo aver chiuso il report
            setActiveReports(activeReports.filter(report => report.id !== reportId));
    
            // Ricarica la lista dei closedReports
            const closedResponse = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/closed-or-resolved`);
            const closedData = await closedResponse.json();
            setClosedReports(closedData.reports);

            await fetch(`http://${process.env.IP_ADDRESS}:5177/notifications/submit_notifications_by_follows/${reportId}`, {
              method: 'GET',
            });
        } else {
            console.error('Failed to close report:', await response.text());
        }
        } catch (error) {
        console.error('Error closing report:', error);
        }
    };
    
    // Funzione per risolvere un report con motivazione
    const resolveReport = async (reportId, motivation) => {
        try {
        const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${reportId}/resolve`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resolved: true, motivation }),
        });
        if (response.ok) {
            // Aggiorna la lista dei report attivi dopo aver risolto il report
            setActiveReports(activeReports.filter(report => report.id !== reportId));
    
            // Ricarica la lista dei closedReports
            const closedResponse = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/closed-or-resolved`);
            const closedData = await closedResponse.json();
            setClosedReports(closedData.reports);

            await fetch(`http://${process.env.IP_ADDRESS}:5177/notifications/submit_notifications_by_follows/${reportId}`, {
              method: 'GET',
            });
        } else {
            console.error('Failed to resolve report:', await response.text());
        }
        } catch (error) {
        console.error('Error resolving report:', error);
        }
    };  

  const deleteReport = async (reportId) => {
    try {
      const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${reportId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setActiveReports(activeReports.filter(report => report.id !== reportId));
        setClosedReports(closedReports.filter(report => report.id !== reportId));
      } else {
        console.error('Failed to delete report:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Active Reports
      </Typography>

      {activeReports.length === 0 ? (
        <Typography variant="body1" align="center">
          No active reports available.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="active reports table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Body</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell component="th" scope="row">{report.title}</TableCell>
                  <TableCell align="right">{report.category}</TableCell>
                  <TableCell align="right">{report.body}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => toggleDetails(report.id)}
                      variant="contained"
                      style={{ marginRight: '10px' }}
                    >
                      {showDetails[report.id] ? 'Hide Details' : 'Show Details'}
                    </Button>

                    {/* Pulsante per chiudere il report */}
                     <Button
                       onClick={() => {
                         const motivation = prompt('Enter motivation for closing the report:');
                         if (motivation) {
                           closeReport(report.id, motivation);
                         }
                       }}
                       variant="contained"
                       color="warning"
                       style={{ marginRight: '10px' }}
                     >
                       Close
                     </Button>                  

                     {/* Pulsante per risolvere il report */}
                     <Button
                       onClick={() => {
                         const motivation = prompt('Enter motivation for resolving the report:');
                         if (motivation) {
                           resolveReport(report.id, motivation);
                         }
                       }}
                       variant="contained"
                       color="success"
                       style={{ marginRight: '10px' }}
                     >
                       Resolve
                     </Button>

                    {/* Pulsante per eliminare il report */}
                    <Button
                      onClick={() => deleteReport(report.id)}
                      variant="contained"
                      color="error"
                    >
                      Delete
                    </Button>

                    {/* Mostra dettagli aggiuntivi */}
                    {showDetails[report.id] && (
                      <div style={{ marginTop: '10px' }}>
                        <Typography component="span">Location: ({report.latitude}, {report.longitude})</Typography>
                        <br />
                        <Typography component="span">Email: {report.email}</Typography>
                        <br />
                        <Typography component="span">First Name: {report.firstName}</Typography>
                        <br />
                        <Typography component="span">Last Name: {report.lastName}</Typography>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tabella per i report chiusi/risolti */}
      <Typography variant="h4" align="center" gutterBottom style={{ marginTop: '40px' }}>
        Closed/Resolved Reports
      </Typography>

      {closedReports.length === 0 ? (
        <Typography variant="body1" align="center">
          No closed or resolved reports.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="closed reports table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Body</TableCell>
                <TableCell align="right">Motivation</TableCell>
                <TableCell align="right">Closed</TableCell>
                <TableCell align="right">Resolved</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {closedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell component="th" scope="row">{report.title}</TableCell>
                  <TableCell align="right">{report.category}</TableCell>
                  <TableCell align="right">{report.body}</TableCell>
                  <TableCell align="right">{report.motivation}</TableCell>
                  
                  {/* Icona per Closed */}
                  <TableCell align="right">
                    {report.closed ? <Cancel color="error" /> : null}
                  </TableCell>

                  {/* Icona per Resolved */}
                  <TableCell align="right">
                    {report.resolved ? <CheckCircle color="success" /> : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

// import React, { useEffect, useState } from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Typography, Paper, Button
// } from '@mui/material';

// export default function DisplayReportsTable() {

//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showDetails, setShowDetails] = useState({});
//   const [motivation, setMotivation] = useState(''); // Stato per la motivazione

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/`);
//         const data = await response.json();
//         setReports(data.reports);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching reports:', error);
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, []);

//   const toggleDetails = (reportId) => {
//     setShowDetails(prevState => ({
//       ...prevState,
//       [reportId]: !prevState[reportId]
//     }));
//   };

//   // Funzione per chiudere un report con motivazione
//   const closeReport = async (reportId, motivation) => {
//     try {
//         const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${reportId}/close`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ closed: true, motivation }), // Invia la motivazione
//         });

//         if (response.ok) {
//             // Rimuovi il report dalla lista se chiuso
//             setReports(reports.filter(report => report.id !== reportId));
//         } else {
//             console.error('Failed to close report:', await response.text());
//         }
//     } catch (error) {
//         console.error('Error closing report:', error);
//     }
// };

//   // Funzione per risolvere un report con motivazione
//   const resolveReport = async (reportId, motivation) => {
//     try {
//       const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${reportId}/resolve`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ resolved: true, motivation }),
//       });
//       if (response.ok) {
//          // Rimuovi il report dalla lista se chiuso
//          setReports(reports.filter(report => report.id !== reportId));
//         // setReports((prevReports) =>
//         //   prevReports.map((report) =>
//         //     report.id === reportId ? { ...report, resolved: true, motivation } : report
//         //   )
//         // );
//       } else {
//         console.error('Failed to resolve report:', await response.text());
//       }
//     } catch (error) {
//       console.error('Error resolving report:', error);
//     }
//   };

//   const deleteReport = async (reportId) => {
//     try {
//       const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${reportId}`, {
//         method: 'DELETE',
//       });
//       if (response.ok) {
//         setReports(reports.filter(report => report.id !== reportId));
//       } else {
//         console.error('Failed to delete report:', await response.text());
//       }
//     } catch (error) {
//       console.error('Error deleting report:', error);
//     }
//   };

//   const deleteAllReports = async () => {
//     try {
//       for (const report of reports) {
//         await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${report.id}`, {
//           method: 'DELETE',
//         });
//       }
//       setReports([]);  // Clear the reports after deletion
//     } catch (error) {
//       console.error('Error deleting all reports:', error);
//     }
//   };

//   return (
//     <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
//       <Typography variant="h4" align="center" gutterBottom>
//         Active Reports
//       </Typography>

//       {reports.length === 0 ? (
//         <Typography variant="body1" align="center">
//           No reports available.
//         </Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-label="reports table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Title</TableCell>
//                 <TableCell align="right">Category</TableCell>
//                 <TableCell align="right">Body</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {reports.map((report) => (
//                 <TableRow key={report.id}>
//                   <TableCell component="th" scope="row">{report.title}</TableCell>
//                   <TableCell align="right">{report.category}</TableCell>
//                   <TableCell align="right">{report.body}</TableCell>
//                   <TableCell align="right">
//                     <Button
//                       onClick={() => toggleDetails(report.id)}
//                       variant="contained"
//                       style={{ marginRight: '10px' }}
//                     >
//                       {showDetails[report.id] ? 'Hide Details' : 'Show Details'}
//                     </Button>
                    
//                     {/* Pulsante per chiudere il report */}
//                     <Button
//                       onClick={() => {
//                         const motivation = prompt('Enter motivation for closing the report:');
//                         if (motivation) {
//                           closeReport(report.id, motivation);
//                         }
//                       }}
//                       variant="contained"
//                       color="warning"
//                       style={{ marginRight: '10px' }}
//                     >
//                       Close
//                     </Button>
                    
//                     {/* Pulsante per risolvere il report */}
//                     <Button
//                       onClick={() => {
//                         const motivation = prompt('Enter motivation for resolving the report:');
//                         if (motivation) {
//                           resolveReport(report.id, motivation);
//                         }
//                       }}
//                       variant="contained"
//                       color="success"
//                       style={{ marginRight: '10px' }}
//                     >
//                       Resolve
//                     </Button>
                    
//                     {/* Pulsante per eliminare il report */}
//                     <Button
//                       onClick={() => deleteReport(report.id)}
//                       variant="contained"
//                       color="error"
//                     >
//                       Delete
//                     </Button>

//                     {/* Mostra dettagli aggiuntivi */}
//                     {showDetails[report.id] && (
//                       <div style={{ marginTop: '10px' }}>
//                         <Typography component="span">Location: ({report.latitude}, {report.longitude})</Typography>
//                         <br />
//                         <Typography component="span">Email: {report.email}</Typography>
//                         <br />
//                         <Typography component="span">First Name: {report.firstName}</Typography>
//                         <br />
//                         <Typography component="span">Last Name: {report.lastName}</Typography>
//                         <br />
//                         <Typography component="span">Closed: {report.closed ? 'Yes' : 'No'}</Typography>
//                         <br />
//                         <Typography component="span">Resolved: {report.resolved ? 'Yes' : 'No'}</Typography>
//                         <br />
//                         {report.motivation && (
//                           <Typography component="span">Motivation: {report.motivation}</Typography>
//                         )}
//                       </div>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Bottone per eliminare tutti i report */}
//       {reports.length > 0 && (
//         <Button
//           onClick={deleteAllReports}
//           variant="contained"
//           color="error"
//           style={{ marginTop: '20px' }}
//         >
//           Delete All Reports
//         </Button>
//       )}
//     </Paper>
//   );
// }











// // import React, { useEffect, useState } from 'react';
// // import {
// //   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
// //   Typography, Paper, Button
// // } from '@mui/material';

// // export default function DisplayReportsTable() {
// //   const [reports, setReports] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [showDetails, setShowDetails] = useState({});

// //   useEffect(() => {
// //     const fetchReports = async () => {
// //       try {
// //         const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/`);
// //         const data = await response.json();
// //         setReports(data.reports);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching reports:', error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchReports();
// //   }, []);

// //   const toggleDetails = (reportId) => {
// //     setShowDetails(prevState => ({
// //       ...prevState,
// //       [reportId]: !prevState[reportId]
// //     }));
// //   };

// //   const deleteReport = async (reportId) => {
// //     try {
// //       const response = await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${reportId}`, {
// //         method: 'DELETE',
// //       });
// //       if (response.ok) {
// //         setReports(reports.filter(report => report.id !== reportId));
// //       } else {
// //         console.error('Failed to delete report:', await response.text());
// //       }
// //     } catch (error) {
// //       console.error('Error deleting report:', error);
// //     }
// //   };

// //   const deleteAllReports = async () => {
// //     try {
// //       for (const report of reports) {
// //         await fetch(`http://${process.env.IP_ADDRESS}:5176/reports/${report.id}`, {
// //           method: 'DELETE',
// //         });
// //       }
// //       setReports([]);  // Clear the reports after deletion
// //     } catch (error) {
// //       console.error('Error deleting all reports:', error);
// //     }
// //   };

// //   if (loading) {
// //     return <Typography variant="h6" align="center">Loading reports...</Typography>;
// //   }

// //   return (
// //     <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
// //       <Typography variant="h4" align="center" gutterBottom>
// //         Reports in the Database
// //       </Typography>

// //       {reports.length === 0 ? (
// //         <Typography variant="body1" align="center">
// //           No reports available.
// //         </Typography>
// //       ) : (
// //         <TableContainer component={Paper}>
// //           <Table sx={{ minWidth: 650 }} aria-label="reports table">
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Title</TableCell>
// //                 <TableCell align="right">Category</TableCell>
// //                 <TableCell align="right">Body</TableCell>
// //                 <TableCell align="right">Actions</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {reports.map((report) => (
// //                 <TableRow key={report.id}>
// //                   <TableCell component="th" scope="row">{report.title}</TableCell>
// //                   <TableCell align="right">{report.category}</TableCell>
// //                   <TableCell align="right">{report.body}</TableCell>
// //                   <TableCell align="right">
// //                     <Button
// //                       onClick={() => toggleDetails(report.id)}
// //                       variant="contained"
// //                       style={{ marginRight: '10px' }}
// //                     >
// //                       {showDetails[report.id] ? 'Hide Details' : 'Show Details'}
// //                     </Button>
// //                     <Button
// //                       onClick={() => deleteReport(report.id)}
// //                       variant="contained"
// //                       color="error"
// //                     >
// //                       Delete
// //                     </Button>
// //                     {/* Show additional details when toggled */}
// //                     {showDetails[report.id] && (
// //                       <div style={{ marginTop: '10px' }}>
// //                         <Typography component="span">Location: ({report.latitude}, {report.longitude})</Typography>
// //                         <br />
// //                         <Typography component="span">Email: {report.email}</Typography>
// //                         <br />
// //                         <Typography component="span">First Name: {report.firstName}</Typography>
// //                         <br />
// //                         <Typography component="span">Last Name: {report.lastName}</Typography>
// //                       </div>
// //                     )}
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       )}

// //       {/* Button to delete all reports */}
// //       {reports.length > 0 && (
// //         <Button
// //           onClick={deleteAllReports}
// //           variant="contained"
// //           color="error"
// //           style={{ marginTop: '20px' }}
// //         >
// //           Delete All Reports
// //         </Button>
// //       )}
// //     </Paper>
// //   );
// // }

// import React, { useEffect, useState } from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Typography, Paper, Button
// } from '@mui/material';

// export default function DisplayReportsTable() {
//   const [reports, setReports] = useState([
//     // Report di test
//     {
//       id: 1,
//       title: "Pothole on Main Street",
//       category: "Pothole",
//       body: "Large pothole near the intersection of 5th and Main St.",
//       latitude: 40.7128,
//       longitude: -74.0060,
//       email: "user1@example.com",
//       firstName: "John",
//       lastName: "Doe"
//     },
//     {
//       id: 2,
//       title: "Damaged Road near Park",
//       category: "Road Damage",
//       body: "The road near Central Park is severely damaged.",
//       latitude: 40.7851,
//       longitude: -73.9683,
//       email: "user2@example.com",
//       firstName: "Jane",
//       lastName: "Smith"
//     },
//     {
//       id: 3,
//       title: "Street Lights Out",
//       category: "Street lights outage",
//       body: "Several street lights are not working on 7th Avenue.",
//       latitude: 40.748817,
//       longitude: -73.985428,
//       email: "user3@example.com",
//       firstName: "Bob",
//       lastName: "Johnson"
//     }
//   ]);

//   const [loading, setLoading] = useState(false); // Disable loading for test data
//   const [showDetails, setShowDetails] = useState({});

//   const toggleDetails = (reportId) => {
//     setShowDetails(prevState => ({
//       ...prevState,
//       [reportId]: !prevState[reportId]
//     }));
//   };

//   const deleteReport = (reportId) => {
//     setReports(reports.filter(report => report.id !== reportId));
//   };

//   const deleteAllReports = () => {
//     setReports([]);  // Clear the reports after deletion
//   };

//   return (
//     <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
//       <Typography variant="h4" align="center" gutterBottom>
//         Submitted Reports
//       </Typography>

//       {reports.length === 0 ? (
//         <Typography variant="body1" align="center">
//           No reports available.
//         </Typography>
//       ) : (
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-label="reports table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Title</TableCell>
//                 <TableCell align="right">Category</TableCell>
//                 <TableCell align="right">Body</TableCell>
//                 <TableCell align="right">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {reports.map((report) => (
//                 <TableRow key={report.id}>
//                   <TableCell component="th" scope="row">{report.title}</TableCell>
//                   <TableCell align="right">{report.category}</TableCell>
//                   <TableCell align="right">{report.body}</TableCell>
//                   <TableCell align="right">
//                     <Button
//                       onClick={() => toggleDetails(report.id)}
//                       variant="contained"
//                       style={{ marginRight: '10px' }}
//                     >
//                       {showDetails[report.id] ? 'Hide Details' : 'Show Details'}
//                     </Button>
//                     <Button
//                       onClick={() => deleteReport(report.id)}
//                       variant="contained"
//                       color="error"
//                     >
//                       Delete
//                     </Button>
//                     {/* Show additional details when toggled */}
//                     {showDetails[report.id] && (
//                       <div style={{ marginTop: '10px' }}>
//                         <Typography component="span">Location: ({report.latitude}, {report.longitude})</Typography>
//                         <br />
//                         <Typography component="span">Email: {report.email}</Typography>
//                         <br />
//                         <Typography component="span">First Name: {report.firstName}</Typography>
//                         <br />
//                         <Typography component="span">Last Name: {report.lastName}</Typography>
//                       </div>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       {/* Button to delete all reports */}
//       {reports.length > 0 && (
//         <Button
//           onClick={deleteAllReports}
//           variant="contained"
//           color="error"
//           style={{ marginTop: '20px' }}
//         >
//           Delete All Reports
//         </Button>
//       )}
//     </Paper>
//   );
// }
