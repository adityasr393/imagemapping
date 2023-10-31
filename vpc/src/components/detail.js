import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./detail.css"
import bg3 from './bg3.jpg'

export default function Detail() {
  const location = useLocation();
  const { editableObj } = location.state;
  const canvasRef = useRef(null);
  const [hoveredPolygonIndex, setHoveredPolygonIndex] = useState(null);
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  useEffect(() => {
    if (editableObj) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const image = new Image();
      image.src = editableObj.image;

      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        editableObj.coordinates.forEach((polygon, polygonIdx) => {
          ctx.beginPath();
          polygon.forEach((point, pointIdx) => {
            if (pointIdx === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.closePath();

          if (polygonIdx === hoveredPolygonIndex) {
            ctx.strokeStyle = 'blue'; // Line color for the hovered polygon
            ctx.lineWidth = 2; // Line width for the hovered polygon
            ctx.stroke();

            if (editableObj.polygonText && editableObj.polygonText[polygonIdx]) {
              const text = editableObj.polygonText[polygonIdx];
            
              // Calculate the center of the polygon
              const centerX = polygon.reduce((sum, point) => sum + point.x, 0) / polygon.length;
              const centerY = polygon.reduce((sum, point) => sum + point.y, 0) / polygon.length;
            
              // Set the text style properties
              ctx.font = 'bold 20px Arial'; // You can adjust the font size and style
              ctx.fillStyle = 'red'; // Set the text fill color
            
              // Measure the text width
              const textWidth = ctx.measureText(text).width;
            
              // Calculate text position to keep it within the polygon
              const textX = centerX - textWidth / 2;
              const textY = centerY + 8; // Adjust the vertical position as needed
            
              // Draw the text inside the polygon
              ctx.fillText(text, textX, textY);
            }
            
          }
        });
      };
    }
  }, [editableObj, hoveredPolygonIndex]);

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Check if the mouse is over any of the polygons
    editableObj.coordinates.forEach((polygon, polygonIdx) => {
      const ctx = canvas.getContext('2d'); // Define ctx here
      ctx.beginPath();
      polygon.forEach((point, pointIdx) => {
        if (pointIdx === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();

      const isPointInPath = ctx.isPointInPath(mouseX, mouseY);
      if (isPointInPath) {
        setHoveredPolygonIndex(polygonIdx);
      }
    });
  };

  const handleMouseLeave = () => {
    setHoveredPolygonIndex(null);
  };

  const imageStyle = {
    position: 'relative',
    width: '1000px', // Adjust the image width as needed
  };

  return (
    <div className="container project"style={{ backgroundImage: `url(${bg3})`, width:'100%',height:'100%'}}>
      <div className="project-head-sec">
        <div className="row project-row1">
          <div className="col">
            <p className="project-head">Details</p>
          </div>
        </div>
        <br />
      </div>
      <div className="col text-end">
        <Link to="/view" className="btn btn-primary">
          Back
        </Link>
      </div>
      <div className="project-body container">
        <div className="project-body-head">
          <p className="bl-bd-head">Your Details</p>
        </div>
        <div className="project-body-sec">
          <div className="row">
         
          </div>
          <div className="row" key={editableObj?._id}>
            <p>
              <u>
              <hr />
                <b>Image</b>
              </u>
              :&nbsp;
              </p>
                  <canvas
                    ref={canvasRef}
                    style={{ position: 'relative', left: 0, top: 0 }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  />
              
           
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
}
