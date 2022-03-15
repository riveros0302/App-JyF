import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  InteractionManager,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Input, Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { isEmpty, size } from "lodash";
import { validateEmail } from "../utils/validations";
import { openDatabase } from "../utils/database";
const db = openDatabase();

export default function Datos() {
  const [smsNombre, setSmsNombre] = useState("");
  const [smsApellido, setSmsApellido] = useState("");
  const [smsEmpresa, setSmsEmpresa] = useState("");
  const [smsComuna, setSmsComuna] = useState("");
  const [smsfono, setSmsfono] = useState("");
  const [smsCorreo, setSmsCorreo] = useState("");
  const [inputData, setInputData] = useState(defaultInputData());
  const [titleBtn, setTitleBtn] = useState("Guardar");
  const isFocused = useIsFocused();

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM datos;", [], (tx, results) => {
        if (results.rows.length === 0) {
          console.log("datos = 0");
          setInputData(defaultInputData());
          setTitleBtn("Guardar");
        } else {
          console.log("datos = 1");
        }
      });
    });
  }, [isFocused]);

  const deleteDatos = () => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM datos;", []);
    });
  };

  const insertDatos = () => {
    deleteDatos();
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO datos (dt_nom, dt_ape, dt_empresa, dt_correo, dt_fono, dt_com) values ( ?, ?, ?, ?, ?, ?)",
        [
          inputData.nombre,
          inputData.apellido,
          inputData.empresa,
          inputData.correo,
          inputData.fono,
          inputData.comuna,
        ]
      );
    }, null);
  };

  const onSubmit = () => {
    setSmsNombre("");
    setSmsApellido("");
    setSmsEmpresa("");
    setSmsCorreo("");
    setSmsfono("");
    setSmsComuna("");

    if (titleBtn === "Guardar") {
      if (isEmpty(inputData.nombre)) {
        setSmsNombre("Indica tu nombre");
      } else if (isEmpty(inputData.apellido)) {
        setSmsApellido("Indica tu apellido");
      } else if (isEmpty(inputData.empresa)) {
        setSmsEmpresa("Indica el nombre de tu empresa");
      } else if (isEmpty(inputData.correo)) {
        setSmsCorreo("Indica tu correo electronico");
      } else if (!validateEmail(inputData.correo)) {
        setSmsCorreo("Correo no valido");
      } else if (isEmpty(inputData.fono)) {
        setSmsfono("Indica un número de telefono");
      } else if (size(inputData.fono) < 12) {
        setSmsfono("Faltan digitos");
      } else if (isEmpty(inputData.comuna)) {
        setSmsComuna("Indica tu comuna");
      } else {
        insertDatos();
        setTitleBtn("Actualizar");
      }
    } else {
      insertDatos();
    }
  };

  const onChange = (e, type) => {
    setInputData({ ...inputData, [type]: e.nativeEvent.text });
  };

  return (
    <ScrollView>
      <View style={styles.viewGeneral}>
        <LinearGradient
          style={styles.linearGradient}
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0.5)"]}
        >
          <View style={{ marginLeft: 20 }}>
            <View style={styles.viewInputStyle}>
              <Input
                label="Nombre"
                labelStyle={{ fontSize: 25 }}
                style={{ fontSize: 25 }}
                onChange={(e) => onChange(e, "nombre")}
                errorMessage={smsNombre}
                value={inputData.nombre}
              />
              <Input
                label="Apellido"
                labelStyle={{ fontSize: 25 }}
                style={{ fontSize: 25 }}
                onChange={(e) => onChange(e, "apellido")}
                errorMessage={smsApellido}
                value={inputData.apellido}
              />
            </View>

            <Input
              label="Nombre Empresa"
              labelStyle={{ fontSize: 25 }}
              style={{ fontSize: 25 }}
              containerStyle={{ marginTop: 40 }}
              onChange={(e) => onChange(e, "empresa")}
              errorMessage={smsEmpresa}
              value={inputData.empresa}
            />
            <Input
              label="Correo Electrónico"
              labelStyle={{ fontSize: 25 }}
              style={{ fontSize: 25 }}
              containerStyle={{ marginTop: 40 }}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              onChange={(e) => onChange(e, "correo")}
              errorMessage={smsCorreo}
              value={inputData.correo}
            />
            <View style={styles.viewInputStyle}>
              <Input
                label="Telefono"
                labelStyle={{ fontSize: 25 }}
                style={{ fontSize: 25 }}
                containerStyle={{ marginTop: 40 }}
                keyboardType="phone-pad"
                placeholder="+569"
                errorMessage={smsfono}
                errorStyle={{ color: "red" }}
                onChange={(e) => onChange(e, "fono")}
                defaultValue="+56"
                value={inputData.fono}
              />
              <Input
                label="Comuna"
                labelStyle={{ fontSize: 25 }}
                style={{ fontSize: 25 }}
                containerStyle={{ marginTop: 40 }}
                onChange={(e) => onChange(e, "comuna")}
                errorMessage={smsComuna}
                value={inputData.comuna}
              />
            </View>
          </View>
        </LinearGradient>
        <Button
          title={titleBtn}
          onPress={onSubmit}
          buttonStyle={{
            backgroundColor: "#00a680",
            marginTop: 10,
            height: 80,
            borderRadius: 20,
          }}
          titleStyle={{ fontSize: 25 }}
        />
      </View>
    </ScrollView>
  );
}

function defaultInputData() {
  return {
    nombre: "",
    apellido: "",
    empresa: "",
    correo: "",
    fono: "",
    comuna: "",
  };
}

const styles = StyleSheet.create({
  viewInputStyle: {
    marginTop: 20,
    flexDirection: "row",
    width: "50%",
  },
  viewGeneral: {
    margin: 20,
    height: 750,
  },
  linearGradient: {
    flex: 1,
    borderRadius: 10,
    marginTop: 10,
  },
});
