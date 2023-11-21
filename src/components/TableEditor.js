import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableEditor = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedTables = JSON.parse(localStorage.getItem('tables')) || [];
    setTables(storedTables);
  }, []);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tables');
        setTables(response.data.tables);
        localStorage.setItem('tables', JSON.stringify(response.data.tables));
      } catch (error) {
        console.error('Error fetching tables:', error.message);
      }
    };

    fetchTables();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        if (selectedTable) {
          const response = await axios.get(`http://localhost:5000/api/table-data/${selectedTable}`);
          setTableData(response.data.tableData);
        }
      } catch (error) {
        console.error('Error fetching table data:', error.message);
      }
    };

    fetchTableData();
  }, [selectedTable]);

  const handleTableSelect = (e) => {
    setSelectedTable(e.target.value);
    setTableData([]);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/save-changes/${selectedTable}`, { tableData });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error saving changes:', error.message);
      setMessage('Error saving changes. Please try again.');
    }
  };

  const handleDeleteTable = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/delete-table/${selectedTable}`);
      setMessage(response.data.message);
      setSelectedTable('');
      setTableData([]);
      setTables(response.data.tables);
      localStorage.setItem('tables', JSON.stringify(response.data.tables));
    } catch (error) {
      console.error('Error deleting table:', error.message);
      setMessage('Error deleting table. Please try again.');
    }
  };

  const handleCellValueChange = (rowIndex, columnName, newValue) => {
    setTableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][columnName] = newValue;
      return newData;
    });
  };

  return (
    <div>
      <h2>Table Editor</h2>
      <div>
        <label htmlFor="selectTable">Select Table:</label>
        <select id="selectTable" onChange={handleTableSelect} value={selectedTable}>
          <option value="">-- Select a Table --</option>
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>
      {selectedTable && (
        <div>
          <h3>Edit Table: {selectedTable}</h3>
          <table>
            <thead>
              <tr>
                {tableData.length > 0 &&
                  Object.keys(tableData[0]).map((columnName) => (
                    <th key={columnName}>{columnName}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.keys(row).map((columnName) => (
                    <td key={columnName}>
                      <input
                        type="text"
                        value={row[columnName]}
                        onChange={(e) =>
                          handleCellValueChange(rowIndex, columnName, e.target.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={handleDeleteTable}>Delete Table</button>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
};

export default TableEditor;
