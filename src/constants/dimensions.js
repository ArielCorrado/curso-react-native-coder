import { Dimensions, StatusBar } from "react-native";

export const SCREEN_HEIGHT = Dimensions.get("window").height;                           //No incluye barra de estado
export const SCREEN_WIDTH = Dimensions.get("window").width;
export const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
export const SPEAKER_BAR_HEIGHT = StatusBar.currentHeight;
export const SCREEN_AVAILABLE_HEIGHT = SCREEN_HEIGHT - SPEAKER_BAR_HEIGHT;
export const MAIN_PADDING = 20;




