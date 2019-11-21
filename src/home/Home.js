import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { getCsvPutUrl, getXmlPutUrl, uploadFile } from '../service/Integration';
import Loader from 'react-loader-spinner'
import './Home.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
const fetch = require('node-fetch');

class Home extends Component {

  constructor() {
    super();
    this.initialState = {
      csvFile: null,
      xmlFile: null,
      csvValue: '',
      xmlValue: '',
      isLoading: false
    };
    this.state = this.initialState;
  }

  submitCsvFile = async (event) => {
    event.preventDefault();
    if (this.state.csvFile === null) {
      return;
    }

    const newState = { ...this.state, isLoading: true }
    this.setState({ ...newState });

    const fileObj = this.state.csvFile;
    const signedUrl = await getCsvPutUrl(fileObj.name, fileObj.type, netlifyIdentity.currentUser().email, netlifyIdentity.currentUser().user_metadata.full_name);
    await uploadFile(fileObj, signedUrl);
    this.setState(this.initialState);
  }

  submitXmlFile = async (event) => {
    event.preventDefault();
    if (this.state.xmlFile === null) {
      return;
    }

    const newState = { ...this.state, isLoading: true }
    this.setState({ ...newState });

    const fileObj = this.state.xmlFile;
    const signedUrl = await getXmlPutUrl(fileObj.name, fileObj.type, netlifyIdentity.currentUser().email, netlifyIdentity.currentUser().user_metadata.full_name);
    await uploadFile(fileObj, signedUrl);
    this.setState(this.initialState);
  }

  handleCsvFileUpload = (event) => {
    const fileObj = event.target.files[0];
    const allowedExtensions = /(\.txt)$/i;
    if (!allowedExtensions.exec(fileObj.name)) {
      alert('Favor de seleccionar solamente archivos .TXT');
      return;
    }
    this.setState({ csvFile: fileObj, csvValue: event.target.value });
  }

  handleXmlFileUpload = (event) => {
    const fileObj = event.target.files[0];
    const allowedExtensions = /(\.xml.gz)$/i;
    if (!allowedExtensions.exec(fileObj.name)) {
      alert('Favor de seleccionar solamente archivos .XML.GZ');
      return;
    }
    this.setState({ xmlFile: fileObj, xmlValue: event.target.value });
  }

  render() {
    return (
      <div>
        <div className="home-header">
          Bienvenido  {netlifyIdentity.currentUser().email} !! </div>
        <div className='home-body'>
          {this.state.isLoading &&
            <div className="uploaderMessage"><Loader
              type="ThreeDots"
              color="#58696d"
              height="100"
              width="100"
            /></div>
          }
          <form onSubmit={this.submitCsvFile}>
            Seleccionar archivo de compras .TXT (Envoy > Reportes > Mercancía Seca > Compras > Detalles de Compras > Imprimir a: Archivo Delimitado > Todos los Proveedores > Fecha de ayer) El archivo se llama "Detalles de Compra.txt":
            <input className="form-control input-sm"
              id="csvFileInput"
              type="file"
              name="file"
              value={this.state.csvValue}
              onChange={this.handleCsvFileUpload}
              accept=".txt" />
            <button className="uploadButton" type='submit'>Subir TXT</button>
          </form>
          <br />
          <form onSubmit={this.submitXmlFile}>
            Seleccionar archivo de ventas XML.GZ (Sapphire Transaction Manager > Tools > Options... > Ir a la carpeta que dice allí > jalar archivo de ayer (el .2 no el .1):
             <input className="form-control input-sm"
              id="xmlFileInput"
              type="file"
              name="file"
              value={this.state.xmlValue}
              onChange={this.handleXmlFileUpload}
              accept=".xml.gz" />
            <button className="uploadButton" type='submit'>Subir XML.GZ</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Home;

