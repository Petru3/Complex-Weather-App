import React from 'react'

// api :https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Granada?unitGroup=metric&key=FAHFSD8SKYCU2ERYKPE42VWXH&contentType=json

import Home from "./components/Home";

function App() {
  return (
    <div className='app-page'>
      {/* <Loader /> */}
      <Home />
    </div>
  );
}

export default App;
