import React, { useState } from "react";
import "./styles.css";

const Applications = () => {
  const [applicationsList, setApplicationsList] = useState([]);
  const [newApplicationName, setNewApplicationName] = useState("");
  const [selectedApplication, setSelectedApplication] = useState("");
  const [newDocumentName, setNewDocumentName] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [currentApplicationIndex, setCurrentApplicationIndex] = useState(0);
  const [isAddApplicationModalOpen, setIsAddApplicationModalOpen] = useState(false);
  const [isAddDocumentModalOpen, setIsAddDocumentModalOpen] = useState(false);
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  const addApplication = () => {
    if (newApplicationName.trim()) {
      setApplicationsList([...applicationsList, { name: newApplicationName, documents: [] }]);
      setNewApplicationName("");
      setIsAddApplicationModalOpen(false);
    }
  };

  const addDocument = () => {
    if (selectedApplication && newDocumentName.trim()) {
      let document = { name: newDocumentName };

      if (fileToUpload) {
        document = { ...document, fileUrl: URL.createObjectURL(fileToUpload) };
      }

      setApplicationsList(
        applicationsList.map((app) =>
          app.name === selectedApplication
            ? { ...app, documents: [...app.documents, document] }
            : app
        )
      );

      setNewDocumentName("");
      setFileToUpload(null);
      setIsAddDocumentModalOpen(false);
    } else {
      alert("Please fill the document name.");
    }
  };

  // const setActiveDoc = (index) => {
  //   setActiveDocumentIndex(index === activeDocumentIndex ? null : index);
  // };

  const removeApplication = (appName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the application: ${appName}?`
      )
    ) {
      setApplicationsList(applicationsList.filter((app) => app.name !== appName));
      if (currentApplicationIndex > 0) {
        setCurrentApplicationIndex(currentApplicationIndex - 1);
      }
    }
  };

  // const removeDocument = (appName, docName) => {
  //   setApplicationsList(
  //     applicationsList.map((app) =>
  //       app.name === appName
  //         ? {
  //             ...app,
  //             documents: app.documents.filter((doc) => doc.name !== docName),
  //           }
  //         : app
  //     )
  //   );
  // };

  const goToNextDoc = () => {
    if (!applicationsList.length) return;
    const currentApp = applicationsList[currentApplicationIndex];

    if (currentApp.documents.length > 0) {
      if (activeDocumentIndex < currentApp.documents.length - 1) {
        setActiveDocumentIndex(activeDocumentIndex + 1);
      } else {
        const nextAppIndex = (currentApplicationIndex + 1) % applicationsList.length;
        setCurrentApplicationIndex(nextAppIndex);
        setSelectedApplication(applicationsList[nextAppIndex].name);
        setActiveDocumentIndex(0);
      }
    } else {
      const nextAppIndex = (currentApplicationIndex + 1) % applicationsList.length;
      setCurrentApplicationIndex(nextAppIndex);
      setSelectedApplication(applicationsList[nextAppIndex].name);
      setActiveDocumentIndex(0);
    }
  };

  const goToPrevDoc = () => {
    if (!applicationsList.length) return;
    const currentApp = applicationsList[currentApplicationIndex];

    if (currentApp.documents.length > 0) {
      if (activeDocumentIndex > 0) {
        setActiveDocumentIndex(activeDocumentIndex - 1);
      } else {
        const prevAppIndex =
          (currentApplicationIndex - 1 + applicationsList.length) % applicationsList.length;
        setCurrentApplicationIndex(prevAppIndex);
        setSelectedApplication(applicationsList[prevAppIndex].name);
        const prevAppDocs = applicationsList[prevAppIndex].documents;
        setActiveDocumentIndex(prevAppDocs.length - 1);
      }
    } else {
      const prevAppIndex =
        (currentApplicationIndex - 1 + applicationsList.length) % applicationsList.length;
      setCurrentApplicationIndex(prevAppIndex);
      setSelectedApplication(applicationsList[prevAppIndex].name);
      const prevAppDocs = applicationsList[prevAppIndex].documents;
      setActiveDocumentIndex(prevAppDocs.length - 1);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="greycolor">Document Upload</h1>
        <div className="addapplicationbtn ">
          <button onClick={() => setIsAddApplicationModalOpen(true)} className="button">
            <i className="fas fa-plus "></i> Add Application
          </button>
        </div>
      </div>

      {isAddApplicationModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <h3 className="title">Add Applicant</h3>
            <label htmlFor="appname" className="title">Name</label>
            <input
              id="appname"
              type="text"
              value={newApplicationName}
              onChange={(e) => setNewApplicationName(e.target.value)}
              className="inputstyle"
            />
            <div className="button-container">
              <button onClick={addApplication} className="savebtn">
                <i className="fa-solid fa-check"></i> &nbsp;Save
              </button>
              <button onClick={() => setIsAddApplicationModalOpen(false)} className="cancelbttn">
                <i className="fa-solid fa-x"></i>&nbsp; Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddDocumentModalOpen && (
        <div className="modal">
          <div className="modalContent">
            <h3 className="title">Add Document</h3>
            <label htmlFor="appname" className="title">Document Name</label>
            <input
              type="text"
              value={newDocumentName}
              onChange={(e) => setNewDocumentName(e.target.value)}
              className="inputstyle"
            />
            <div className="button-container">
              <button onClick={addDocument} className="savebtn">
                <i className="fa-solid fa-check"></i> &nbsp;Save
              </button>
              <button onClick={() => setIsAddDocumentModalOpen(false)} className="cancelbttn">
                <i className="fa-solid fa-x"></i>&nbsp; Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="navbar">
        {applicationsList.length === 0 ? (
          <p style={{ ...styles.navItem, color: "gray" }}></p>
        ) : (
          applicationsList.map((app) => (
            <div key={app.name} className="navItemContainer">
              <div
                onClick={() => {
                  setSelectedApplication(app.name);
                  setCurrentApplicationIndex(
                    applicationsList.findIndex((a) => a.name === app.name)
                  );
                }}
                style={{
                  ...styles.navItem,
                  borderBottom:
                    selectedApplication === app.name
                      ? "1px solid #3b82f6"
                      : "1px solid #f1f1f1",
                }}
              >
                {app.name}
                <button
                  className="deletebtn deleteAppButton"
                  onClick={() => removeApplication(app.name)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <hr />
      <div className="display-documents">
        <div>
          <div style={styles.documents}>
            {selectedApplication ? (
              applicationsList
                .find((app) => app.name === selectedApplication)
                ?.documents.map((doc, index) => (
                  <div
                    key={doc.name}
                    style={{
                      ...styles.documentBox,
                      background: activeDocumentIndex === index ? "#3b82f6" : "#fff",
                      color: activeDocumentIndex === index ? "white" : "black",
                    }}
                    onClick={() => setActiveDocumentIndex(index)}
                  >
                    <strong>{doc.name}</strong>
                  </div>
                ))
            ) : (
              <p style={{ ...styles.document, color: "gray" }}></p>
            )}
          </div>

          {applicationsList.length > 0 && selectedApplication && (
            <div className="form">
              <button onClick={() => setIsAddDocumentModalOpen(true)} className="addbutton">
                <i className="fas fa-plus iconbg"></i>&nbsp; Add
              </button>
            </div>
          )}
        </div>
        <div>
          {activeDocumentIndex !== null && (
            <div className="file-upload">
              <div className="file-upload-header">
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setFileToUpload(file);
                      setFilePreviewUrl(URL.createObjectURL(file));
                    }
                  }}
                />
                <div className="buttonContainer">
                  <button
                    className="file-upload-btn button"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <i className="fa-solid fa-plus"></i> &nbsp; Choose
                  </button>
                  <button
                    className="file-upload-btn button"
                    onClick={() => {
                      if (!fileToUpload) {
                        alert("No file selected!");
                      } else {
                        alert(`Uploading file: ${fileToUpload.name}`);
                      }
                    }}
                  >
                    <i className="fa-solid fa-upload"></i> &nbsp; Upload
                  </button>
                  <button
                    className="file-upload-btn button"
                    onClick={() => {
                      setFileToUpload(null);
                      setFilePreviewUrl(null);
                    }}
                  >
                    <i className="fa-solid fa-x"></i> &nbsp; Cancel
                  </button>
                </div>
              </div>
              <div className="fileDetails">
                {fileToUpload ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img
                      src={filePreviewUrl}
                      alt="Selected File Preview"
                      style={{
                        maxWidth: "50px",
                        maxHeight: "32px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: "bold" }}>
                        {fileToUpload.name}
                      </p>
                      <p style={{ margin: 0, color: "grey" }}>
                        {`${(fileToUpload.size / 1024).toFixed(3)} KB`}
                      </p>
                    </div>
                  </div>
                ) : (
                  "Drag and Drop files here"
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="navButtons">
        <button onClick={goToPrevDoc} className="button">
          <i className="fa-solid fa-arrow-left"></i>&nbsp;Back
        </button>
        <button onClick={goToNextDoc} className="button">
          <i className="fa-solid fa-arrow-right"></i> &nbsp;Next
        </button>
      </div>
      <hr />
    </div>
  );
};

const styles = {
  navItem: {
    padding: "20px",
    textAlign: "center",
    width: "200px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontsize: "700",
  },
  documents: {
    display: "flex",
    flexDirection: "column",
    marginTop: "20px",
  },
  documentBox: {
    marginBottom: "10px",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    position: "relative",
    cursor: "pointer",
  },
};

export default Applications;
