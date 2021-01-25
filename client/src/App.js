import {connect} from 'react-redux'
import { loadUser } from './Redux/user/userAction'
import Main from './00/SignIn-SignUp/main'

import React, { useContext, useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Auth from './components/Auth/Auth';
import Router from './Router';
import { UserContext } from './context/UserContext';

import './styles/index.css';
import 'emoji-mart/css/emoji-mart.css'

function App() {

  const { user } = useContext(UserContext);


  return (
    <>
      <ToastContainer autoClose={2000} closeButton={false} />
      {user ? <Router /> : <Auth />}
    </>
  );
}

export default App;


// const App = ({loadUser}) => {

//   useEffect(() => {
//     loadUser()
//   },[])


//   return (
//     <div className="App">
//       {/* <Main /> */}
//       <ToastContainer autoClose={2000} closeButton={false} />
//       {<Auth />}
//       {/* {user ? <Router /> : <Auth />} */}
//     </div>
//   );
// }

// const mapDispatchToProps = (dispatch) => {
//   return{
//     loadUser : () => dispatch(loadUser())
//   }
// }

// export default connect(null,mapDispatchToProps)(App);