import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "../components/Modal";
import { Button, Icon } from "react-native-elements";
import { openDatabase } from "../utils/database";
import { isEmpty } from "lodash";
const db = openDatabase();

export default function Pedidos() {
  let [flatListItems, setFlatListItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [itemID, setItemID] = useState([]);
  const [reload, setReload] = useState(false);
  const [getDatos, setGetDatos] = useState([]);

  useFocusEffect(
    useCallback(() => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM pedidos INNER JOIN productos ON productos.id_prod = pedidos.id_prod;",
          [],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }

            setFlatListItems(temp);
          }
        );
      });
      setReload(false);
      console.log("aloja");
    }, [reload])
  );

  const first = (item) => {
    setIsVisible(true);
    setItemID(item);
  };

  let listItemView = (item) => {
    return (
      <View>
        <TouchableOpacity
          key={item.id_ped}
          style={{
            backgroundColor: "#EEE",
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            flexDirection: "row",
          }}
          onPress={() => first(item)}
        >
          <Text style={styles.textbottom}>{item.id_ped}</Text>
          <Text style={styles.textDesc}>{item.desc_prod}</Text>
          <Text style={styles.textbottom}>{item.cant_ped}</Text>
          <Text style={styles.texttotal}>${item.total_ped}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const SendPedidos = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM datos;", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setGetDatos(temp);
      });
    });

    if (isEmpty(getDatos)) {
      console.log("toast llenar datos");
    } else {
      setReload(true);
      db.transaction((tx) => {
        tx.executeSql("DELETE FROM datos;", []);
        tx.executeSql("DELETE FROM pedidos;", []);
      });

      console.log("enviando...");
    }
  };

  const condition = () => {
    if (isEmpty(flatListItems)) {
      return false;
    } else {
      return (
        <Icon
          reverse
          type="material-community"
          name="send"
          containerStyle={styles.btnFloat}
          onPress={SendPedidos}
        />
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1 }}>
          <View style={styles.HeaderPedidos}>
            <Text style={styles.headerText}>ID</Text>
            <Text style={styles.headerText}>Descripción</Text>
            <Text style={styles.headerText}>Cant.</Text>
            <Text style={styles.headerText}>Total</Text>
          </View>

          <FlatList
            style={{ marginTop: 10 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
      </View>
      <ModalPedidos
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        itemID={itemID}
        setReload={setReload}
      />
      {condition()}
    </SafeAreaView>
  );
}

function ModalPedidos(props) {
  const { isVisible, setIsVisible, itemID, setReload } = props;
  const { id_ped, desc_prod, id_prod } = itemID;

  const deletePedido = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM pedidos WHERE id_ped = ?",
        [id_ped],
        (tx, results) => {
          console.log("id pedido borrado");
          setReload(true);
          setIsVisible(false);
        }
      );
    });
  };

  return (
    <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
      <View>
        <Text>eliminar pedido ID: {id_ped}</Text>
        <Text>
          {id_prod} descripcion: {desc_prod}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <Button
            title={"Eliminar"}
            buttonStyle={styles.btnStyle}
            onPress={deletePedido}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  textheader: {
    color: "#111",
    fontSize: 20,
    fontWeight: "bold",
  },
  textbottom: {
    color: "#111",
    fontSize: 18,
    paddingRight: "5%",
    paddingLeft: "3%",
    width: "17%",
  },
  HeaderPedidos: {
    flexDirection: "row",
    borderColor: "black",
    borderRadius: 4,
    borderWidth: 2,
    marginLeft: 20,
    marginRight: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    paddingLeft: "5%",
    paddingRight: "3%",
  },
  textDesc: {
    width: "42%",
    fontSize: 18,
    color: "black",
    paddingRight: "10%",
  },
  texttotal: {
    color: "#111",
    fontSize: 18,
  },
  btnStyle: {
    backgroundColor: "red",
    marginTop: 50,
    alignContent: "flex-end",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  btnFloat: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
});
