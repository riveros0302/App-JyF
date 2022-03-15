import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Input, Button } from "react-native-elements";
import Modal from "../Modal";
import { openDatabase } from "../../utils/database";
import { isEmpty } from "lodash";
const db = openDatabase();

export default function DetailsCatalogo(props) {
  const { prod } = props;
  const { ruta_img, desc_prod, precio_prod, marca_prod } = prod;
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [cantidad, setCantidad] = useState("");
  const [notas, setNotas] = useState("");

  const [enabled, setEnabled] = useState(true);
  const [enabledOK, setEnabledOK] = useState(true);

  return (
    <SafeAreaView>
      <View>
        <LinearGradient
          style={styles.linearGradient}
          colors={["rgba(255,255,255,0.5)", "rgba(255,255,255,1)"]}
        >
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
              enabled={enabled}
              setEnabled={setEnabled}
              enabledOK={enabledOK}
              setEnabledOK={setEnabledOK}
            />
          </TouchableOpacity>
        </LinearGradient>
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
    enabled,
    setEnabled,
    enabledOK,
    setEnabledOK,
    item,
  } = props;

  const { id_prod, marca_prod, desc_prod, precio_prod, cant_prod } = item;

  const [saveCantidad, setSaveCantidad] = useState("");
  const [EnabledDto, setEnabledDto] = useState(true);
  const [total, setTotal] = useState(0);

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

  const onChange = (e) => {
    if (e.nativeEvent.text === "" || e.nativeEvent.text === "0") {
      setEnabledOK(true);
      setEnabledDto(true);
    } else {
      setEnabledOK(false);
      setEnabledDto(false);
    }
    setTotal(e.nativeEvent.text * precio_prod);
    setSaveCantidad(e.nativeEvent.text);
  };

  const onChangeDto = (e) => {
    let dto;
    let totalInterno;
    totalInterno = saveCantidad * precio_prod;
    dto = (totalInterno * e.nativeEvent.text) / 100;
    setTotal(totalInterno - dto);
    if (e.nativeEvent.text === "") {
      setTotal(saveCantidad * precio_prod);
    }
  };

  const SubmitConfirmar = () => {
    addPedido(saveCantidad, total, id_prod, notas);

    setIsVisible(false);
    setTotal(0);
    setEnabledOK(true);
  };

  return (
    <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
      <View
        style={{
          height: 700,
          width: 700,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.viewHorizontal}>
          <View style={{ width: "65%" }}>
            <Text style={styles.Titulo}>{marca_prod}</Text>
            <Text style={styles.prodName}>{desc_prod}</Text>
          </View>
          <Image
            containerStyle={{ marginTop: -30 }}
            source={require("../../../assets/img/Logo.png")}
            style={{ width: 200, height: 200 }}
            PlaceholderContent={<ActivityIndicator color="fff" />}
          />
        </View>

        <Text style={styles.contentProd}>Cantidades: {cant_prod}</Text>
        <Text style={styles.contentPrecio}>Precio: ${precio_prod}</Text>
        <Text style={styles.contentProdBottom}>Total: {total}</Text>
        <View>
          <Input
            placeholder="Cantidad"
            containerStyle={{ width: "81%", marginTop: 30, marginLeft: 30 }}
            style={{ fontSize: 25 }}
            onChange={onChange}
            keyboardType="numeric"
          />
          <Input
            placeholder="Descuento"
            containerStyle={{ width: "81%", marginTop: 10, marginLeft: 30 }}
            style={{ fontSize: 25 }}
            onChange={onChangeDto}
            keyboardType="numeric"
            disabled={EnabledDto}
          />
          {/*  <Button
            icon={{
              name: "check-outline",
              type: "material-community",
              size: 25,
              color: "white",
            }}
            buttonStyle={{
              width: 80,
              height: 70,
              backgroundColor: "#00a680",
              borderRadius: 20,
            }}
            onPress={CalcularTotal}
            disabled={enabled}
          />*/}
        </View>

        {/* <Input
          placeholder="Nota"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={(e) => setNotas(e.nativeEvent.text)}
       />*/}
        <Button
          title="CONFIRMAR"
          onPress={SubmitConfirmar}
          disabled={enabledOK}
          buttonStyle={{
            backgroundColor: "#00a680",
            height: 70,
            marginLeft: 30,
            marginRight: 30,
            borderRadius: 20,
          }}
          titleStyle={{ fontSize: 25 }}
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
  TouchStyle: {
    backgroundColor: "white",
    marginTop: 20,
  },
  viewProductos: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    height: 400,
    width: "100%",
  },
  viewProductoImg: {
    flex: 1,
  },
  imgProductos: {
    width: 250,
    height: 250,
    marginTop: 30,
    marginLeft: 100,
  },
  viewTexto: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 20,
  },
  prodName: {
    fontWeight: "bold",
    fontSize: 25,
    marginLeft: 30,
  },
  prodMarca: {
    fontWeight: "bold",
    fontSize: 40,
    marginLeft: 10,
  },
  Titulo: {
    fontWeight: "bold",
    fontSize: 40,
    marginLeft: 30,
  },
  contentProd: {
    marginTop: 20,
    fontSize: 25,
    marginLeft: 30,
  },
  contentProdBottom: {
    marginBottom: 20,
    fontSize: 25,
    marginLeft: 30,
  },
  contentPrecio: {
    fontSize: 25,
    marginLeft: 30,
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
    width: 250,
    height: 80,
    marginTop: 30,
    alignSelf: "center",
  },
  txtImg: {
    position: "absolute",
    top: "30%",
    width: "90%",
    textAlign: "center",
    fontSize: 30,
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
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    textShadowColor: "black",
    textShadowRadius: 8,
    textShadowOffset: { width: 1, height: 1 },
  },
  txtIVA: {
    position: "absolute",
    top: "50%",
    width: "100%",
    textAlign: "center",
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
    marginLeft: 60,
    textShadowColor: "black",
    textShadowRadius: 8,
    textShadowOffset: { width: 1, height: 1 },
  },
  txtJyF: {
    fontWeight: "bold",
    alignSelf: "flex-end",
    marginRight: 20,
    marginTop: 15,
    fontSize: 20,
  },
  shadowview: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  linearGradient: {
    flex: 1,
    borderRadius: 5,
    marginTop: 30,
  },
});
