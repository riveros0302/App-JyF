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
import { SearchBar } from "react-native-elements";
import DetailsCatalogo from "./DetailsCatalogo";
import { openDatabase } from "../../utils/database";
const db = openDatabase();

class ListCatalogo extends Component {
  state = { listCat: [], listProd: [], isLoading: true, search: "" };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    axios
      .get("http://jyfindustrial.cl/php_crud/Lista_Productos_sqlite.php")
      .then((response) => {
        this.setState({
          listCat: response.data,
          isLoading: false,
        });
        this.sincronizacionProductos();
        this.getProd();
      });
  };

  search = (text) => {
    console.log(text);
  };
  clear = () => {
    this.search.clear();
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

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    // const newData = this.listCat.filter(function (item) {
    const newData = this.state.listCat.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.desc_prod
        ? item.desc_prod.toUpperCase()
        : "".toUpperCase();
      /* const itemData2 = item.marca_prod
        ? item.marca_prod.toUpperCase()
        : "".toUpperCase();*/
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      listProd: newData,
      search: text,
    });
  }

  render() {
    if (this.state.isLoading) {
      // Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <SafeAreaView>
        <View>
          <SearchBar
            round
            searchIcon={{ size: 24 }}
            onChangeText={(text) => this.SearchFilterFunction(text)}
            onClear={(text) => this.SearchFilterFunction("")}
            placeholder="Buscar..."
            value={this.state.search}
            containerStyle={{
              backgroundColor: "rgba(52, 52, 52, 0.5)",
            }}
          />
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
