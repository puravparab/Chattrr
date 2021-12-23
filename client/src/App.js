import React from 'react'
import RegisterForm from "./components/forms/RegisterForm"

function App() {
  // const registerUser = async (registerDetails) => {
  //   const res = await fetch('http://192.168.1.102:8000/accounts/register', {
  //     method: 'POST',
  //     headers: {
  //       'Content-type': 'application/json',
  //       'X-CSRFToken': "Oo5sKy6TRSxdoHo3p9ZJrabLSHQ8f6iB72qPh5vd72yimYYrpO3RuHgQJEY7rgj5"
  //     },
  //     body: JSON.stringify(registerDetails)
  // })}

  return (
    <div className="App">
      <h1>Chattrr</h1>
      <RegisterForm />
    </div>
  );
}

export default App;
