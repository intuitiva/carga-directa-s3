import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { getCsvPutUrl, getXmlPutUrl, uploadFile } from '../service/Integration';
import Loader from 'react-loader-spinner'
import './../index.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

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
    const complex_metadata = netlifyIdentity.currentUser().user_metadata.full_name.split(' ')
    const signedUrl = await getCsvPutUrl(fileObj.name, fileObj.type, netlifyIdentity.currentUser().email, complex_metadata[1], complex_metadata[0]);
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
    const complex_metadata = netlifyIdentity.currentUser().user_metadata.full_name.split(' ')
    const signedUrl = await getXmlPutUrl(fileObj.name, fileObj.type, netlifyIdentity.currentUser().email, complex_metadata[1], complex_metadata[0]);
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
      <div class="container">
        <h5>
          Bienvenido {netlifyIdentity.currentUser().email}
        </h5>
        {this.state.isLoading &&
          <div className="uploaderMessage"><Loader
            type="ThreeDots"
            color="#58696d"
            height="100"
            width="100"
          /></div>
        }
        <div class="row">
          <div class="column">
            <div class="tile">
              <h5 class="tile-title">Seleccionar archivo de compras .TXT</h5>
              <p>Envoy > Reportes > Mercancía Seca > Compras > Detalles de Compras > Imprimir a: Archivo Delimitado > Todos los Proveedores > Fecha de ayer.</p>
              <p class="small">El archivo se llama "Detalles de Compra.txt"</p>
              <form onSubmit={this.submitCsvFile}>
                <input className="form-control input-sm"
                  id="csvFileInput"
                  type="file"
                  name="file"
                  value={this.state.csvValue}
                  onChange={this.handleCsvFileUpload}
                  accept=".txt" />
                <button className="btn btn-success" type='submit'>Subir TXT</button>
              </form>
            </div>
          </div>

          <div class="column">
            <div class="tile">
              <h5 class="tile-title">Seleccionar archivo de ventas XML.GZ </h5>
              <p>Sapphire Transaction Manager > Tools > Options... > Ir a la carpeta que dice allí > jalar archivo de ayer</p>
              <p class="small">El archivo termina en .2.xml.gz y no el .1.xml.gz</p>
              <form onSubmit={this.submitXmlFile}>
                <input className="form-control input-sm"
                  id="xmlFileInput"
                  type="file"
                  name="file"
                  value={this.state.xmlValue}
                  onChange={this.handleXmlFileUpload}
                  accept=".xml.gz" />
                <button className="btn btn-inverse" type='submit'>Subir XML.GZ</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;