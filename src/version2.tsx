import React, { useEffect, useState } from "react";
import S3Uploader from "./ImageUploader";

interface Patient {
  id: number;

  name: string;

  age: number;
}
const apiEndPoint =
  "http://healthcarebackend-env.eba-a6xqt8zs.ap-southeast-2.elasticbeanstalk.com/api/patients";
function Appv2() {
  const [patients, setPatients] = useState<Patient[]>([]);

  const [sortedField, setSortedField] = useState<keyof Patient | null>(null);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(apiEndPoint);

      const data = await response.json();

      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleSort = (field: keyof Patient) => {
    if (field === sortedField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedField(field);

      setSortOrder("asc");
    }
  };

  const handleSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(apiEndPoint + "/${id}", {
        method: "DELETE",
      });

      setPatients(patients.filter((patient) => patient.id !== id));

      setSelectedPatient(null);
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPatients = sortedField
    ? filteredPatients.slice().sort((a, b) => {
        const fieldA = a[sortedField];

        const fieldB = b[sortedField];

        if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;

        if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;

        return 0;
      })
    : filteredPatients;

  return (
    <div>
      <h1>Healthcare App</h1>
      <S3Uploader />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search patient"
      />

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>

            <th onClick={() => handleSort("age")}>Age</th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sortedPatients.map((patient) => (
            <tr key={patient.id} onClick={() => handleSelect(patient)}>
              <td>{patient.name}</td>

              <td>{patient.age}</td>

              <td>
                <button onClick={() => handleDelete(patient.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPatient && (
        <div>
          <h2>Selected Patient</h2>

          <p>Name: {selectedPatient.name}</p>

          <p>Age: {selectedPatient.age}</p>
        </div>
      )}
    </div>
  );
}

export default Appv2;
