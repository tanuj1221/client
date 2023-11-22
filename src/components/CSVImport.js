import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CSVImport = () => {
  const [csvFile, setCSVFile] = useState(null);
  const [tableName, setTableName] = useState('');
  const [message, setMessage] = useState('');
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://43.204.237.196:5000/api/tables');
        setTables(response.data.tables);
      } catch (error) {
        console.error('Error fetching tables:', error.message);
      }
    };

    fetchTables();
  }, []);

  const handleFileChange = (e) => {
    setCSVFile(e.target.files[0]);
  };

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleImportCSV = async () => {
    try {
      if (!csvFile || !tableName) {
        setMessage('Please select a CSV file and enter a table name.');
        return;
      }

      const formData = new FormData();
      formData.append('csvFilePath', csvFile);

      const response = await axios.post(`http://43.204.237.196 :5000/api/import-csv/${tableName}`, formData);
      setMessage(response.data.message);
      setTables((prevTables) => [...prevTables, tableName]); // Update the list of tables
    } catch (error) {
      console.error('Error importing CSV:', error.message);
      setMessage('Error importing CSV. Please try again.');
    }
  };

  return (
    <div>
      <h2>CSV Import</h2>
      <div>
        <label htmlFor="csvFile">Select CSV File:</label>
        <input type="file" id="csvFile" accept=".csv" onChange={handleFileChange} />
      </div>
      <div>
        <label htmlFor="tableName">Table Name:</label>
        <input type="text" id="tableName" value={tableName} onChange={handleTableNameChange} />
      </div>
      <button onClick={handleImportCSV}>Import CSV</button>
      {message && <p>{message}</p>}

      <div>
        <h3>Available Tables:</h3>
        <ul>
          {tables.map((table) => (
            <li key={table}>{table}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CSVImport;
