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
  state = { listCat: [], listProd: [] };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    axios
      .get("http://jyfindustrial.cl/php_crud/Lista_Productos_sqlite.php")
      .then((response) => {
        this.setState({ listCat: response.data });
        this.sincronizacionProductos();
        this.getProd();
      });
  };

  sincronizacionProductos = () => {
    return this.state.listCat.map((prod) => {
      db.transaction((tx) => {
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
      }, null);
    });
  };

  listProd = (item) => {
    return <DetailsCatalogo key={item.id_prod} prod={item} />;
  };

  getProd = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM productos;", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
          console.log(results.rows.item(i));
        }
        this.setState({ listProd: temp });
      });
    });
  };

  onRefreshh = () => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM productos;", []);
    });
    //limpiar datos de la lista listCat
    this.setState({ listCat: [] });
    //llamar al servicio para obtener los datos mas recientes
    this.getData();
  };

  render() {
    return (
      <SafeAreaView>
        <View>
          <FlatList
            style={{ marginTop: 10 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            data={this.state.listProd}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => this.listProd(item)}
            refreshControl={
              <RefreshControl
                refreshing={this.props.refresh}
                onRefresh={this.onRefreshh}
              />
            }
          />
          {this.sincronizacionProductos()}
        </View>
      </SafeAreaView>
    );
  }
}

export default ListCatalogo;
