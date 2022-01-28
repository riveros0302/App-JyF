import axios from "axios";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import DetailsCatalogo from "./DetailsCatalogo";

import * as SQLite from "expo-sqlite";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

class ListCatalogo extends Component {
  state = { listCat: [] };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    axios
      .get("http://jyfindustrial.cl/php_crud/Lista_Productos_sqlite.php")
      .then((response) => {
        this.setState({ listCat: response.data });
        this.sincronizacionProductos();
      });
  };

  sincronizacionProductos = () => {
    return this.state.listCat.map((prod) => {
      db.transaction(
        (tx) => {
          tx.executeSql("DELETE FROM productos;", []);
          tx.executeSql(
            "INSERT INTO productos (id_prod, nom_prod, desc_prod, marca_prod, precio_prod, ruta_img, cant_prod) values (?, ?, ?, ?, ?, ?, ?)",
            [
              prod.id_prod,
              prod.nom_prod,
              prod.desc_prod,
              prod.marca_prod,
              prod.precio_prod,
              prod.ruta_img,
              prod.cant_prod,
            ]
          );
        },
        null
        //forceUpdate
      );
      return (
        <DetailsCatalogo
          key={prod.id_prod}
          refreshing={this.props.refresh}
          onRefresh={this.onRefreshh}
        />
      );
    });
  };

  deleteProductos = () => {
    db.transaction((tx) => {});
  };

  onRefreshh = () => {
    //limpiar datos de la lista listCat
    this.setState({ listCat: [] });
    //llamar al servicio para obtener los datos mas recientes
    this.getData();
  };

  ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#C8C8C8",
        }}
      />
    );
  };

  render() {
    return <View>{this.sincronizacionProductos()}</View>;
  }
}

export default ListCatalogo;
