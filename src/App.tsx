import { useEffect, useState } from "react";

interface Patient {
  id: number;
  name: string;
  age: number;
}
const apiEndPoint = "http://16.50.98.184:3000/api/patients";
function App() {
  const [patients, setPatients] = useState<Patient[]>([]);

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

  return (
    <div>
      <h1>Healthcare App</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            {patient.name} – {patient.age} years old
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
