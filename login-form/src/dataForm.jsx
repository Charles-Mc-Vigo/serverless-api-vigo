import React, { useEffect, useState } from "react";
import axios from 'axios';
import './DataForm.css'

function DataForm() {
  const [data, setData] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get('https://serverless-api-vigo.netlify.app/.netlify/functions/api/')
      .then((response) => {
        // Modify data to include id along with name and age
        const formattedData = response.data.map(item => ({
          id: item._id,
          name: item.name,
          age: item.age
        }));
        setData(formattedData);
      })
      .catch((error) => {
        console.error('Failed to load the data', error);
      });
  };

  const handleAddData = (e) => {
    e.preventDefault();
    axios
      .post('https://serverless-api-vigo.netlify.app/.netlify/functions/api/', { name, age })
      .then((response) => {
        console.log('Data posted successfully:', response.data);
        fetchData();
        setName('');
        setAge('');
      })
      .catch((error) => {
        console.error('Failed to post data', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred while posting data');
        }
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://serverless-api-vigo.netlify.app/.netlify/functions/api/${id}`)
      .then((response) => {
        console.log('Data deleted successfully:', response.data);
        fetchData();
        setIdToDelete('');
      })
      .catch((error) => {
        console.error('Failed to delete data', error);
      });
  };

  const handleUpdateData = () => {
    const newData = {
      name: newName,
      age: newAge
    };
    axios
      .put(`https://serverless-api-vigo.netlify.app/.netlify/functions/api/${idToUpdate}`, newData)
      .then((response) => {
        console.log('Data updated successfully:', response.data);
        fetchData();
        setIdToUpdate('');
        setNewName('');
        setNewAge('');
      })
      .catch((error) => {
        console.error('Failed to update data', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('An error occurred while updating data');
        }
      });
  };

  return (
    <div className="container">
      <h1>Listahan ng kahit sino <br /><em>wala na akong maisip eh</em></h1>
      <div className="form-container">
        <form onSubmit={handleAddData}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <button type="submit" className="add-button">Add Data</button>
        </form>
      </div>
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter ID to delete"
          value={idToDelete}
          onChange={(e) => setIdToDelete(e.target.value)}
        />
        <button onClick={() => handleDelete(idToDelete)} className="delete-button">Delete</button>
      </div>
      <div className="form-container">
        <input
          type="text"
          placeholder="Enter ID to update"
          value={idToUpdate}
          onChange={(e) => setIdToUpdate(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          placeholder="New Age"
          value={newAge}
          onChange={(e) => setNewAge(e.target.value)}
        />
        <button onClick={handleUpdateData} className="update-button">Update</button>
      </div>
      {data.length > 0 ? (
        <table className="table-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}

export default DataForm;
