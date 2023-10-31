import React,{useState , useEffect} from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
import "./view.css"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
function View() {
const [projectList, setprojectList] = useState([])
useEffect(() => {
    getAllprojects()
  }, [])
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const getAllprojects = () => {
    const id = JSON.parse(localStorage.getItem('user'));
    console.log(id._id,'lllll')
    const apiUrl = `http://localhost:3001/polygonuser/polygonget`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log(response.data, 'dddddd')
        setprojectList(response?.data || [])


      })
      .catch((err) => {
        console.error('Error:', err);
      });
  };
 
 
  const deleteproject = (polygonId) => {
    console.log("aaaa",polygonId)
    axios
      .delete(`http://localhost:3001/polygonuser/polygondelete/${polygonId}`)
      .then((response) => {
        console.log('project deleted:', response.data);
        setprojectList(projectList.filter((project) => project._id !== polygonId));
        toast.success('Project deleted successfully'); // Display success message
      })
      .catch((error) => {
        console.error('Error deleting project:', error);
        toast.error('Error deleting project'); // Display error message
      });
  };

  return (
  
    
      <div className="data-table">
        <h1>Data Table</h1>
        <table>
          <thead>
            <tr>
             
              <th>Image</th>
              <th>Detail</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {projectList.map((data, index) => (
              <tr key={data?._id}>
               
                <td><img width={170} src={data?.image} alt=".." /></td>
                <td>
                  <Link to="/detail" state={{ editableObj: data }} className="btn btn-primary btn-lg" id="bt2">
                    DETAIL
                  </Link>
                </td>
                <td>
                <button className="btn-light btn delete-button" onClick={() => deleteproject(data._id)}>
  <FontAwesomeIcon icon={faTrash} /> Delete
</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/selectiontool" className="btn btn-primary btn-lg" id="bt2">
          BACK
        </Link>
        <ToastContainer position="top-right" autoClose={3000} /> {/* To display toasts */}
      </div>
    );
}

export default View;
