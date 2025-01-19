import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { useLocalSearchParams } from "expo-router";
import { IIdoso } from "../../interfaces/idoso.interface";
import { BASE_URL } from "../../config";

export default function VisualizarMetrica() {
  const params = useLocalSearchParams();
  const [idoso, setIdoso] = useState<IIdoso | null>(null);
  const [valueMetrica, setValueMetrica] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const router = useRouter();
 
   const API_URL = process.env.EXPO_PUBLIC_API_URL;
   const API_PORT = process.env.EXPO_PUBLIC_API_USUARIO_PORT;
   const BASE_URL = `${API_URL}:${API_PORT}/api/saude/idoso`;

  const getIdoso = async () => {
    if (!idUsuario) return;

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/idoso/${idUsuario}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("Dados recebidos:", data);

      const idosoPayload = data.data as IIdoso;
      setIdoso(idosoPayload);
    } catch (err) {
      const error = err as Error;
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getMetricasValues = async () => {
    try {
      setShowLoading(true);

      const response = await fetch(`${BASE_URL}/metrica/${params.id}/valores`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("Valores das métricas recebidos:", data);

      setValueMetrica(data.valoresMetrica);
    } catch (err) {
      const error = err as Error;
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: error.message,
      });
    } finally {
      setShowLoading(false);
    }
  };

  useEffect(() => {
    getIdoso();
    getMetricasValues();
  }, [idUsuario]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Text>Idoso: {idoso?.nome}</Text>
          {/* Renderize os valores das métricas aqui */}
        </View>
      )}
      {showLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {/* Renderize os valores das métricas aqui */}
      <View>
        {valueMetrica.map((metrica, index) => (
          <Text key={index}>{metrica.valor}</Text>
        ))}
      </View>
      <ModalConfirmation
        visible={modalMetaVisible}
        callbackFn={adicionarMeta}
        closeModal={() => setModalMetaVisible(false)}
        metrica={params}
        message={params.categoria}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2CCDB5",
    width: "100%",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  botaoEditarMetricas: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B4026D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginVertical: 10,
  },
  botaoAdicionarMeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B4026D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginVertical: 10,
  },

  textoBotaoEditarMetricas: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
  },
  textoBotaoAdicionarMeta: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 5,
    padding: 3,
  },

  textheader: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  botoes: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botao: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 10,
  },
  valorMaximoHidratacao: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  valorAtualCotainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 15,
    opacity: 0.7,
  },
  valorAtualTexto: {
    fontSize: 25,
  },
  botaoLimpar: {
    alignItems: "center",
    marginTop: 10,
  },
  textoBotaoLimpar: {
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
