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
  const { prod } = props;
  const { ruta_img, desc_prod, precio_prod, marca_prod } = prod;
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [cantidad, setCantidad] = useState("");
  const [notas, setNotas] = useState("");
  const [total, setTotal] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [enabledOK, setEnabledOK] = useState(true);

  //console.log(prod);

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <View style={styles.viewProductos}>
            <View style={styles.viewTexto}>
              <Text style={styles.prodMarca}>{marca_prod}</Text>
              <Text style={styles.prodName}>{desc_prod}</Text>
              <View style={styles.viewImg}>
                <Image
                  source={require("../../../assets/img/yellowButton.png")}
                  style={styles.imgYellow}
                />

                <Text style={styles.txtPrecio}>Precio:</Text>
                <Text style={styles.txtImg}>${precio_prod}</Text>
                <Text style={styles.txtIVA}>+IVA</Text>
              </View>
            </View>
            <View style={styles.viewProductoImg}>
              <Text style={styles.txtJyF}>JyF Industrial</Text>
              <Image
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator color="fff" />}
                source={
                  ruta_img
                    ? { uri: ruta_img }
                    : require("../../../assets/img/no-image.png")
                }
                style={styles.imgProductos}
              />
            </View>
          </View>
          <ContentModal
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            setCantidad={setCantidad}
            cantidad={cantidad}
            setNotas={setNotas}
            item={prod}
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
    marginTop: 20,
    height: 200,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  viewProductoImg: {
    marginRight: 15,
  },
  imgProductos: {
    width: 130,
    height: 130,
    marginTop: "15%",
  },
  viewTexto: {
    marginTop: 30,
  },
  prodName: {
    fontWeight: "bold",
    fontSize: 15,
    width: 230,
    marginLeft: 10,
  },
  prodMarca: {
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
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
  imgYellow: {
    width: "100%",
    height: "100%",
  },
  viewImg: {
    position: "relative",
    width: 150,
    height: 50,
    marginTop: 30,
    marginLeft: 30,
  },
  txtImg: {
    position: "absolute",
    top: "40%",
    width: "90%",
    textAlign: "center",
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowRadius: 8,
    textShadowOffset: { width: 1, height: 1 },
  },
  txtPrecio: {
    position: "absolute",
    top: "10%",
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 10,
    textShadowColor: "black",
    textShadowRadius: 8,
    textShadowOffset: { width: 1, height: 1 },
  },
  txtIVA: {
    position: "absolute",
    top: "60%",
    width: "100%",
    textAlign: "center",
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
    marginLeft: 30,
    textShadowColor: "black",
    textShadowRadius: 8,
    textShadowOffset: { width: 1, height: 1 },
  },
  txtJyF: {
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 15,
    fontSize: 10,
  },
});
