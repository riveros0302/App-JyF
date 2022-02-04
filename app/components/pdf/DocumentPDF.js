import { StyleSheet, View, Text, Image } from "react-native";
import React from "react";
export default function DocumentPDF() {
  return (
    <View>
      <Image
        source={require("../../../assets/img/Logo.png")}
        style={{ height: 150, width: 150, alignSelf: "flex-end" }}
      />
      <View style={styles.viewHead}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>PEDIDOS</Text>
        <View style={{ flexDirection: "row", top: 20, width: "60%" }}>
          <View>
            <Text style={{ fontWeight: "bold" }}>Datos cliente</Text>
            <Text>Bryan Riveros</Text>
            <Text>R.twins Games</Text>
            <Text>Lolol</Text>
            <Text>+56992963779</Text>
          </View>
          <View style={{ left: 40 }}>
            <Text style={styles.txtTitle}>Fecha Pedido</Text>
            <Text style={{ paddingBottom: 10 }}>03-02-2022</Text>
            <Text style={styles.txtTitle}>Correo</Text>
            <Text>riveros.bryan@gmail.com</Text>
          </View>
        </View>
      </View>
      <View style={styles.viewBody}>
        <View style={{ flexDirection: "row", backgroundColor: "#00a680" }}>
          <Text style={styles.txtTabletitle}>ID</Text>
          <Text style={styles.txtTabletitle}>Descripcion</Text>
          <Text
            style={{ fontWeight: "bold", marginLeft: "15%", color: "white" }}
          >
            Cant.
          </Text>
          <Text style={styles.txtTabletitle}>Total</Text>
        </View>
        <View style={styles.viewTable}>
          <Text style={styles.contentTable}>1</Text>
          <Text style={styles.contentTable}>
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccc
          </Text>
          <Text style={styles.contentTable}>100</Text>
          <Text style={styles.contentTable}>100.000</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewHead: {
    left: 10,
    top: -50,
  },
  txtTitle: {
    fontWeight: "bold",
  },
  viewBody: {
    margin: 20,
    borderWidth: 1,
  },
  txtTabletitle: {
    fontWeight: "bold",
    marginLeft: "6%",
    color: "white",
  },
  viewTable: {
    flexDirection: "row",
    width: "49%",
  },
  contentTable: {
    marginLeft: 20,
  },
});
