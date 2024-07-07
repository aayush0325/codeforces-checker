import './App.css'
import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useState } from 'react';
let resArray = [];
import image from './assets/logo.png'

function App() {
  const [statusMessage, setStatusMessage] = useState("");
  const [handle, setHandle] = useState("");
  let content;
  if (statusMessage !== "") {
    content = <ClearButton statusMessage={statusMessage} setStatusMessage={setStatusMessage} setHandle={setHandle} />;
  } else {
    content = null;
  }

  return (
    <div className='flex flex-col items-center h-screen justify-center'>
      <img src={image} alt="pic" className='w-80 sm:w-200' />
      <p className='text-center text-gray-700 mb-8 p-4 max-w-lg'>
        If you have a doubt whether a Codeforces Account is Cheating or not, you can use this site to find that out. This site checks if the user has cheated based on whether they have a skipped submission in a contest or not. A submission gets skipped when the code has been copy-pasted from someone else. Please don't cheat in contests!!!!!
      </p>
      <Search handle={handle} setHandle={setHandle} />
      <CheckButton handle={handle} statusMessage={statusMessage} setStatusMessage={setStatusMessage} />
      {content}
    </div>
  )
}

function Search({ handle, setHandle }) {
  return (
    <div className='mb-4'>
      <TextField
        id="outlined-basic"
        label="Codeforces handle"
        variant="outlined"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        className='w-64'
      />
    </div>
  )
}

function CheckButton({ handle, statusMessage, setStatusMessage }) {
  const handleCheck = async () => {
    if (!handle) {
      setStatusMessage("Please enter a Codeforces handle.");
      return;
    }

    try {
      const res = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000000000`);
      if (res.data.status === "OK") {
        resArray = res.data.result;
        const isCheater = checkCheater(resArray);
        setStatusMessage(isCheater ? "Cheater detected!" : "No cheating detected.");
      } else {
        setStatusMessage("User not found");
      }
    } catch (error) {
      setStatusMessage(`${error.response?.data?.comment || "Request failed"}`);
    }
  };

  return (
    <div className='flex flex-col items-center'>
      <Button
        variant="contained"
        onClick={handleCheck}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Check
      </Button>
      {statusMessage && (
        <div className='mt-4 p-5 text-lg text-white bg-red-600 rounded'>
          {statusMessage}
        </div>
      )}
    </div>
  )
}

function checkCheater(array) {
  return array.some(submission => submission.verdict === "SKIPPED");
}

function ClearButton({ setStatusMessage, setHandle }) {
  return (
    <div className='mt-4'>
      <Button variant="outlined" onClick={() => {
        setStatusMessage("");
        setHandle("");
      }}>Clear</Button>
    </div>
  )
}

export default App
