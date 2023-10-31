import React, { useState } from 'react';

function AnnotationTool() {
  const [image, setImage] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setImage(imageURL);
    setAnnotations([]); // Clear annotations when a new image is uploaded
  };

  const handleAnnotationMouseDown = (index) => {
    setDraggedIndex(index);
    setIsDragging(true);
  };

  const handleAnnotationMouseUp = () => {
    setIsDragging(false);
    setDraggedIndex(null);
  };

  const handleMouseMove = (e) => {
    if (isDragging && draggedIndex !== null) {
      const updatedAnnotations = [...annotations];
      updatedAnnotations[draggedIndex] = {
        ...updatedAnnotations[draggedIndex],
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      };
      setAnnotations(updatedAnnotations);
    }
  };

  const handleAnnotationAdd = () => {
    if (currentAnnotation) {
      setAnnotations([...annotations, { ...currentAnnotation }]);
      setCurrentAnnotation(null);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={() => setPreviewMode(true)}>Preview</button>
      {image && !previewMode && (
        <div
          style={{ position: 'relative' }}
          onMouseUp={handleAnnotationMouseUp}
          onMouseMove={handleMouseMove}
        >
          <img src={image} alt="Uploaded" style={{ maxWidth: '100%' }} />
          <div className="annotations">
            {annotations.map((annotation, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  top: annotation.y + 'px',
                  left: annotation.x + 'px',
                  border: '1px solid red',
                  padding: '5px',
                  background: 'rgba(255, 0, 0, 0.3)',
                  cursor: 'pointer',
                }}
                onMouseDown={() => handleAnnotationMouseDown(index)}
              >
                {annotation.text}
              </div>
            ))}
          </div>
        </div>
      )}
      {previewMode && (
        <AnnotationPreview image={image} annotations={annotations} />
      )}

      <div>
        <input
          type="text"
          placeholder="Enter annotation text"
          value={currentAnnotation ? currentAnnotation.text : ''}
          onChange={(e) =>
            setCurrentAnnotation({ ...currentAnnotation, text: e.target.value })
          }
        />
        <button onClick={handleAnnotationAdd}>Add Annotation</button>
      </div>
    </div>
  );
}

function AnnotationPreview({ image, annotations }) {
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [hoveredAnnotation, setHoveredAnnotation] = useState(null);

  const handleMouseOver = (index) => {
    setHoveredAnnotation(index);
    setShowAnnotations(true);
  };

  const handleMouseLeave = () => {
    setShowAnnotations(false);
  };

  return (
    <div>
      <img src={image} alt="Preview" style={{ maxWidth: '100%' }} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} />
      <div className="annotations-preview">
        {showAnnotations && annotations.map((annotation, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: annotation.y + 'px',
              left: annotation.x + 'px',
              border: '1px solid red',
              padding: '5px',
              background: 'rgba(255, 0, 0, 0.3)',
            }}
          >
            {annotation.text}
          </div>
       ) )}
      </div>
    </div>
  );
}

export default AnnotationTool;
