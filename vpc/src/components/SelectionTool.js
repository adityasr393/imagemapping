import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { storage } from '../components/config';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/polygontool.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faPen, faCamera, faEye } from '@fortawesome/free-solid-svg-icons'; // Import the icons you need
import bg2 from './bg2.jpg'
function PolygonTool() {
  // State variables
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [currentPolygon, setCurrentPolygon] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [polygonText, setPolygonText] = useState([]); // State to store text for each polygon
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  // Refs for canvas, image, and navigation
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  // Object for the project (image and polygons)
  const [projectObj, setProjectObj] = useState({
    image: '',
    polygons: [],
  });

  // Load the image and draw it on the canvas
  const loadImage = (url) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image on the canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Set the imageRef to the newly loaded image
      imageRef.current = image;

      // Draw existing polygons on top of the image
      drawExistingPolygons();
    };
  };

  // Function to draw existing polygons on the canvas
  const drawExistingPolygons = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < polygons.length; i++) {
      const polygon = polygons[i];
      if (polygon.length > 1) {
        ctx.beginPath();
        ctx.moveTo(polygon[0].x, polygon[0].y);
        for (let j = 1; j < polygon.length; j++) {
          ctx.lineTo(polygon[j].x, polygon[j].y);
        }
        ctx.closePath();
        ctx.stroke();
        
        // Render the text in the center of the polygon
        const centerX = polygon.reduce((sum, point) => sum + point.x, 0) / polygon.length;
        const centerY = polygon.reduce((sum, point) => sum + point.y, 0) / polygon.length;

        ctx.fillText(polygonText[i] || '', centerX, centerY);
        ctx.font = 'bold 20px Arial';
      }
    }
  };

 // Updated captureImage function
const captureImage = () => {
  const imageInput = document.querySelector('input[type="file"]');
  const file = imageInput.files[0];

  if (!file) {
    toast.warning('Please select an image before capturing.'); // Show a warning toast
    return;
  }

  // Create a Blob from the selected image file
  const blob = new Blob([file], { type: file.type });

  // Generate a unique name for the image
  const imageName = `${Date.now()}_${file.name}`;

  // Create a reference to Firebase Storage
  const imageRef = storage.ref().child(`images/${imageName}`);

  // Upload the image to Firebase Storage
  imageRef
    .put(blob)
    .then((snapshot) => {
      toast.success('Image uploaded successfully'); // Show success toast
      return snapshot.ref.getDownloadURL();
    })
    .then((downloadURL) => {
      toast.info('Image URL obtained'); // Show info toast

      // Update your project object with the image URL
      setProjectObj((prevValue) => {
        return {
          image: downloadURL,
          polygons: prevValue.polygons, // Keep the existing polygons, don't add new ones
        };
      });

      // You can call other functions or navigate as needed
      createProject(downloadURL);
    })
    .catch((error) => {
      toast.error('Error uploading image: ' + error.message); // Show error toast
      console.error('Error uploading image:', error);
    });
};
  // Helper function to convert a data URL to a Blob
  function dataURLtoBlob(dataURL) {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  // Create a project with the image and polygons
  const createProject = (url) => {
    setPolygons([...polygons, points]);
    setPoints([]);

    let obj = {
      image: url,
      projectData: [],
      coordinates: coordinates,
      polygonText:polygonText,
    };

    for (let i = 0; i < polygons.length; i++) {
      const polygonData = {
        title: `Polygon ${i + 1}`,
        points: polygons[i],
        text: polygonText[i] || '', // Include text property for each polygon
      };
      obj.projectData.push(polygonData);
    }

    setProjectObj(obj);
    console.log('Project data:', polygons,polygonText);
    let arr = polygons.filter((item) => item?.length !== 0);
    let arr2 = polygonText.filter((item) => item?.length !== 0);

    axios
      .post('http://localhost:3001/polygonuser/polygonadd', {
        image: url,
        projectData: [],
        coordinates: arr || [],
        polygonText: arr2 || []
      })
      .then((result) => {
        console.log(result);
        navigate('/selectiontool');
      })
      .catch((err) => {
        toast.error('Error creating project: ' + err.message); // Show error toast
        console.log(err);
      });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      loadImage(imageUrl); // Load the uploaded image
    }
  };

  // Start a new polygon
  const startNewPolygon = () => {
    if (points.length > 0) {
      // Save the current polygon to the list of polygons
      setPolygons([...polygons, points]);

      // Clear the current points and coordinates
      setPoints([]);
      setCoordinates([]);

      // Start a new current polygon
      setCurrentPolygon([]);
      setPolygonText([...polygonText, '']); // Add an empty text for the new polygon
    } else {
      toast.warning('Current polygon is empty'); // Show a warning toast
    }
  };

  // Add a point to the current polygon
  const addPointToCurrentPolygon = (newPoint) => {
    setCurrentPolygon([...currentPolygon, newPoint]);
    setCoordinates([...coordinates, `(${newPoint.x}, ${newPoint.y})`]);
  };

  // Event listeners for drawing polygons
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext('2d');
    let newPoint = {};

    const handleMouseDown = (e) => {
      if (!drawing && ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        newPoint = { x, y };
        setDrawing(true);
        setPoints([...points, newPoint]);
        setCoordinates([...coordinates, `(${x}, ${y})`]);
      }
    };

    const handleMouseMove = (e) => {
      if (drawing) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        newPoint = { x, y };
        setPoints([...points, newPoint]);
      }
    };

    const handleMouseUp = () => {
      if (drawing) {
        setDrawing(false);
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [drawing, points, coordinates]);

  // Render the canvas and polygons
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (imageRef.current) {
        ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
      }

      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw existing polygons
      for (let i = 0; i < polygons.length; i++) {
        const polygon = polygons[i];
        if (polygon.length > 1) {
          ctx.beginPath();
          ctx.moveTo(polygon[0].x, polygon[0].y);
          for (let j = 1; j < polygon.length; j++) {
            ctx.lineTo(polygon[j].x, polygon[j].y);
          }
          ctx.closePath();
          ctx.stroke();

          // Render the text in the center of the polygon
          const centerX = polygon.reduce((sum, point) => sum + point.x, 0) / polygon.length;
          const centerY = polygon.reduce((sum, point) => sum + point.y, 0) / polygon.length;

          ctx.fillText(polygonText[i] || '', centerX, centerY);
        }
      }

      // Draw the current polygon
      if (currentPolygon.length > 1) {
        ctx.beginPath();
        ctx.moveTo(currentPolygon[0].x, currentPolygon[0].y);
        for (let i = 1; i < currentPolygon.length; i++) {
          ctx.lineTo(currentPolygon[i].x, currentPolygon[i].y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }, [points, currentPolygon, polygons, polygonText]);

  return (
    
    <div className="polygon-tool-container">
 
  <div className="content-container">
    <div className="buttons-container" style={{backgroundColor:"white",borderRadius:"15px",padding:"25px"}}>
      <div className="upload-section">
        <label htmlFor="image-upload" className="upload-label">
          <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          <FontAwesomeIcon icon={faImage} /> Upload Image
        </label>
      </div>

      <div className="drawing-section">
        <div className='image'>
          <canvas ref={canvasRef} width={0} height={0} />
        </div>
        <button type="button" className="btn btn-primary btn-lg" onClick={startNewPolygon}>
          <FontAwesomeIcon icon={faPen} /> Finish Polygon
        </button>
      </div>

      <div className="coordinates-section">
        {coordinates.map((coord, index) => (
          <p key={index}>{coord}</p>
        ))}
      </div>

      <div className="polygons-section">
        {polygons.map((polygon, index) => (
          <div key={index} className="polygon">
            <h3>Polygon {index + 1}</h3>
            {polygon.map((point, pointIndex) => (
              <p key={pointIndex}>{`(${point.x}, ${point.y})`}</p>
            ))}
            <input
            className="polygon-text-input" 
              type="text"
              placeholder="Enter text"
              value={polygonText[index] || ''}
              onChange={(e) => {
                const newText = e.target.value;
                const updatedPolygonText = [...polygonText];
                updatedPolygonText[index] = newText;
                setPolygonText(updatedPolygonText);
                
              }}
            />
          </div>
        ))}
      </div>

      <div className="capture-section">
        <button type="button" className="btn btn-primary btn-lg" onClick={captureImage}>
          <FontAwesomeIcon icon={faCamera} /> Capture Image
        </button>
      </div>

      <div className="view-section">
        <Link to="/view" className="btn btn-primary btn-lg" id="bt2">
          <FontAwesomeIcon icon={faEye} /> View
        </Link>
      </div>

      <div className="toast-container">
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  </div>
  </div>
  );
}

export default PolygonTool;