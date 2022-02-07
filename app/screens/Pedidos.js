import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  Share,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Modal from "../components/Modal";
import { Button, Icon, Input } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import Swipeout from "react-native-swipeout";
import { openDatabase } from "../utils/database";
import { isEmpty } from "lodash";
import * as Print from "expo-print";
import Loading from "../components/Loading";
const db = openDatabase();

export default function Pedidos() {
  let [flatListItems, setFlatListItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [itemID, setItemID] = useState([]);
  const [reload, setReload] = useState(false);
  const [getDatos, setGetDatos] = useState([]);
  const [inputData, setInputData] = useState({ nota: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

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
      getCurrentDate();
    }, [reload])
  );

  const htmlcontent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pdf Content</title>
      <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      
      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      
      tr:nth-child(even) {
        background-color: #dddddd;
      }

      {
        box-sizing: border-box;
      }
      

      .column {
        float: left;
        width: 30%;
        padding: 10px;
        height: 200px;
      }
      
      .row:after {
        content: "";
        display: table;
        clear: both;
      }
      img {
        width: 100%;
      }
      </style>
  </head>
  <body>
  </div>
  <div>

  <h1>Pedido de ${getDatos.map((x) => x.dt_nom + " " + x.dt_ape)}</h1>

  <div class="row">
  <div class="column" >
    <h3>Datos cliente</h3>
    <p>${getDatos.map((x) => x.dt_nom + " " + x.dt_ape)}</p>
    <p>${getDatos.map((x) => x.dt_empresa)}</p>
    <p>${getDatos.map((x) => x.dt_com)}</p>
    <p>${getDatos.map((x) => x.dt_fono)}</p>
  </div>

  <div class="column" >
    <h3>Fecha Pedido</h3>
    <p>${getCurrentDate()}</p>
    <b />
    <h3>Correo</h3>
    <p>${getDatos.map((x) => x.dt_correo)}</p>
  </div>

  <div class="column" >
  <img src="http://jyfindustrial.cl/php_crud/imagenes/Logo.png" alt="HTML5 Icon" style="width:128px;height:128px;margin-top:-80px;float:right;">
</div>
</div>

  <hr />

  <div>
  <table>
  <tr>
    <th>ID</th>
    <th>Descripción</th>
    <th>Cant.</th>
    <th>Total</th>
  </tr>
  ${htmltable()}
  </table>
  <h3>Nota: ${inputData.nota}</h3>
  </div>
  </div>
  </body>
  </html>
  `;

  function htmltable() {
    let t = "";
    // for (let i = 0; i < flatListItems.length; i++) {
    flatListItems.map((x) => {
      t =
        t +
        `<tr>
       <td>${x.id_ped}</td>
       <td>${x.desc_prod}</td>
       <td>${x.cant_ped}</td>
       <td>$${x.total_ped}</td>
     </tr>`;
    });

    //   }
    return t;
  }

  function getCurrentDate() {
    var dia = new Date().getDate();
    var mes = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hour = new Date().getHours();
    var minute = new Date().getMinutes();
    return `<p>${dia + "-" + mes + "-" + year + " " + hour + ":" + minute}</p>`;
  }

  const crearPDF = async (html) => {
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === "ios") {
        await Share.share({
          message: "mensajito",
          title: "Share file",
          url: uri,
        });
        setIsLoading(false);
      } else {
        // const result =
        await shareAsync(uri);
        // console.log("shareAsync result: ", result);
      }
    } catch (error) {
      //  console.error(error);
    }
  };

  const first = (item) => {
    setIsVisible(true);
    setItemID(item);
  };

  const deletePedido = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM pedidos WHERE id_ped = ?",
        [id],
        (tx, results) => {
          console.log("id pedido borrado: " + id);
          setReload(true);
          setIsVisible(false);
        }
      );
    });
  };

  let listItemView = (item) => {
    return (
      <Swipeout
        rowId={item.id_ped}
        autoClose={true}
        right={[
          {
            text: "Eliminar",
            backgroundColor: "red",
            onPress: () => {
              deletePedido(item.id_ped);
            },
          },
        ]}
      >
        <View
          style={{
            backgroundColor: "#EEE",
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            flexDirection: "row",
          }}
        >
          <Text style={styles.textbottom}>{item.id_ped}</Text>
          <Text style={styles.textDesc}>{item.desc_prod}</Text>
          <Text style={styles.textbottom}>{item.cant_ped}</Text>
          <Text style={styles.texttotal}>${item.total_ped}</Text>
        </View>
      </Swipeout>
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
      setIsLoading(true);
      setReload(true);
      crearPDF(htmlcontent);
      db.transaction((tx) => {
        tx.executeSql("DELETE FROM datos;", []);
        tx.executeSql("DELETE FROM pedidos;", []);
      });

      // console.log(getDatos.values);
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

  const onChange = (e, type) => {
    setInputData({ ...inputData, [type]: e.nativeEvent.text });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <LinearGradient
          style={styles.linearGradient}
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
        >
          <Input
            label="Nota"
            labelStyle={{ fontSize: 20 }}
            containerStyle={{ height: 100, marginTop: 30 }}
            onChange={(e) => onChange(e, "nota")}
          />
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
          <Loading isVisible={isLoading} text="Generando PDF..." />
        </LinearGradient>
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
    fontSize: 30,
    paddingLeft: 15,
    width: "17%",
  },
  HeaderPedidos: {
    flexDirection: "row",
    height: 60,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "#00a680",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingRight: 120,
    color: "white",
    alignSelf: "center",
  },
  textDesc: {
    width: "42%",
    fontSize: 30,
    color: "black",
    paddingRight: "10%",
  },
  texttotal: {
    color: "#111",
    fontSize: 30,
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
    bottom: 50,
    right: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  linearGradient: {
    height: "100%",
  },
});
