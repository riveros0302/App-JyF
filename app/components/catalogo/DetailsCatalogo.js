import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Image, Input, Button } from "react-native-elements";
import Modal from "../Modal";

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

export default function DetailsCatalogo(props) {
  const { refreshing, onRefresh } = props;
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [cantidad, setCantidad] = useState("");
  const [notas, setNotas] = useState("");
  const [total, setTotal] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [enabledOK, setEnabledOK] = useState(true);
  let [dataProd, setdataProd] = useState([]);
  //console.log(prod);

  useFocusEffect(
    useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM productos;", [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setdataProd(temp);
          console.log(temp);
        });
      });
    }, [])
  );

  let ListProd = (item) => {
    return (
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <View style={styles.viewProductos}>
          <View style={styles.viewProductoImg}>
            <Image
              resizeMode="cover"
              PlaceholderContent={<ActivityIndicator color="fff" />}
              source={
                item.ruta_img
                  ? { uri: item.ruta_img }
                  : require("../../../assets/img/no-image.png")
              }
              style={styles.imgProductos}
            />
          </View>
          <View>
            <Text style={styles.prodName}>{item.desc_prod}</Text>
            <Text>${item.precio_prod}</Text>
          </View>
        </View>
        <ContentModal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          setCantidad={setCantidad}
          cantidad={cantidad}
          setNotas={setNotas}
          item={item}
          notas={notas}
          total={total}
          setTotal={setTotal}
          enabled={enabled}
          setEnabled={setEnabled}
          enabledOK={enabledOK}
          setEnabledOK={setEnabledOK}
          navigation={navigation}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View>
        <FlatList
          style={{ marginTop: 10 }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          data={dataProd}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => ListProd(item)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
}

function ContentModal(props) {
  const {
    isVisible,
    setIsVisible,
    setCantidad,
    setNotas,
    notas,
    cantidad,
    total,
    setTotal,
    enabled,
    setEnabled,
    enabledOK,
    setEnabledOK,
    item,
    navigation,
  } = props;

  const { id_prod, marca_prod, desc_prod, precio_prod, cant_prod } = item;

  const [saveCantidad, setSaveCantidad] = useState("");

  const addPedido = (cantidad, total, id_prod, notas) => {
    if (
      cantidad === null ||
      cantidad === "" ||
      total === null ||
      total === ""
    ) {
      return false;
    }
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO pedidos (cant_ped, total_ped, id_prod, nota_ped) values (?, ?, ?, ?)",
        [cantidad, total, id_prod, notas]
      );
    }, null);
  };

  const CalcularTotal = () => {
    setTotal(cantidad * precio_prod);
    setSaveCantidad(cantidad);
    setCantidad("");
    setEnabled(true);
    setEnabledOK(false);
  };

  const onChange = (e) => {
    setCantidad(e.nativeEvent.text);
    if (e.nativeEvent.text === "") {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  };

  const SubmitConfirmar = () => {
    addPedido(saveCantidad, total, id_prod, notas);
    setIsVisible(false);
  };

  return (
    <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
      <View>
        <View style={styles.viewHorizontal}>
          <View>
            <Text style={styles.Titulo}>{marca_prod}</Text>
            <Text style={styles.prodName}>{desc_prod}</Text>
          </View>
          <Image
            source={require("../../../assets/img/Logo.png")}
            style={{ width: 100, height: 100 }}
          />
        </View>

        <Text style={styles.contentProd}>Cantidades: {cant_prod}</Text>
        <Text style={styles.contentPrecio}>Precio: ${precio_prod}</Text>
        <Text style={styles.contentProdBottom}>Total: {total}</Text>
        <View style={styles.viewHorizontal}>
          <Input
            placeholder="Cantidad"
            containerStyle={{ width: "85%" }}
            onChange={onChange}
            value={cantidad.toString()}
            keyboardType="numeric"
          />
          <Button
            icon={{
              name: "check-outline",
              type: "material-community",
              size: 15,
              color: "white",
            }}
            onPress={CalcularTotal}
            disabled={enabled}
          />
        </View>

        <Input
          placeholder="Nota"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={(e) => setNotas(e.nativeEvent.text)}
        />
        <Button
          title="CONFIRMAR"
          onPress={SubmitConfirmar}
          disabled={enabledOK}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  loaderProductos: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  viewProductos: {
    flexDirection: "row",
    margin: 10,
  },
  viewProductoImg: {
    marginRight: 15,
  },
  imgProductos: {
    width: 80,
    height: 80,
  },
  prodName: {
    fontWeight: "bold",
    fontSize: 15,
    width: 230,
  },
  Titulo: {
    fontWeight: "bold",
    fontSize: 25,
  },
  contentProd: {
    marginTop: 20,
    fontSize: 15,
  },
  contentProdBottom: {
    marginBottom: 20,
    fontSize: 15,
  },
  contentPrecio: {
    fontSize: 15,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  viewHorizontal: {
    flexDirection: "row",
    width: "100%",
  },
});
